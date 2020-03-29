import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { UserService } from '@core/services/user.service';
import { PostService } from '@shared/services/post.service';
import { PostStateConstantEnum } from '@shared/enums/post-state-constant.enum';

import { RoleConstantEnum } from '@shared/enums/role-constant.enum';
import { convertToSlug, validateFormGroup } from '@shared/utils/form.util';

import { environment } from '@env/environment';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html'
})
export class EditPostComponent implements OnInit {

  id: string;
  loading: boolean;
  imageUploading: boolean;
  buttonLoading: boolean;
  postForm: FormGroup;
  type: 'edit' | 'create' = 'create';
  Editor = ClassicEditor;
  blogUrl = environment.blogUrl;
  postDetail: Post.PostModel;

  // enums
  roleConstantEnum = RoleConstantEnum;
  postStateConstantEnum = PostStateConstantEnum;

  // user
  activeUser: User.UserInfoModel;
  isAdmin: boolean;

  // tags
  @ViewChild('tagInputElement', { static: false }) tagInputElement: ElementRef;
  tagInputVisible = false;
  tagInputValue = '';

  constructor(
      private activatedRoute: ActivatedRoute,
      private postService: PostService,
      private userService: UserService,
      private notificationService: NzNotificationService,
      private msg: NzMessageService,
      private fb: FormBuilder
  ) {
    this.id = activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.activeUser = this.userService.firebaseUserInfo;

    this.isAdmin = this.userService.isAdmin;

    if (this.id === 'new') {
      this.postDetail = {
        id: '',
        authorId: this.activeUser.id,
        state: PostStateConstantEnum.PUBLISHED,
        featuredImage: '',
        created: new Date(),
        title: '',
        summary: '',
        content: '',
        url: '',
        htmlTitle: '',
        metaDescription: '',
        tags: []
      };

      this.createFormGroup(this.postDetail);
    } else {
      this.loading = true;

      this.postService.getPostDetail(this.id).subscribe(response => {
        this.type = 'edit';
        this.loading = false;

        this.postDetail = response;
        this.createFormGroup(this.postDetail);
      }, error => {
        this.loading = false;
        console.log('error while fetching post detail', error);
      });
    }
  }
  
  createFormGroup(data?): void {
    const { id, summary, title } = data;

    this.postForm = this.fb.group({
      id: [{value: id, disabled: !this.isAdmin}, []],
      summary: [{value: summary, disabled: !this.isAdmin}, []],
      title: [{value: title, disabled: !this.isAdmin}, []]
    });

    this.postForm.get('title').valueChanges.subscribe(item => {
      this.postDetail.url = convertToSlug(item);
    });
  }

  submitForm(): void {
    validateFormGroup(this.postForm);
    
    if (this.postForm.invalid) {
      return;
    }

    this.buttonLoading = true;

    const data = this.createRequestObject();

    this.postService.createPost(data).then(() => {
      const message = this.type === 'edit' ? 'Update Successfully' : 'Create Successfully';

      this.buttonLoading = false;
      this.notificationService.success(message, '');
    });
  }

  createRequestObject(): Post.PostModel {
    const formData = this.postForm.value;

    const postData: Post.PostModel = {
      ...this.postDetail,
      ...formData,
      htmlTitle: formData.title,
      metaDescription: formData.summary
    };

    if (this.type === 'edit') {
      postData.updated = new Date();
    }

    if (this.type === 'create') {
      postData.created = new Date();
    }

    return postData;
  }

  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';

      if (!isJPG) {
        this.msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }

      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isLt2M) {
        this.msg.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }

      observer.next(isJPG && isLt2M);
      observer.complete();
    });
  };

  customReq = (item) => {
    const filePath = `posts/${item.file.name}`;

    const task = this.postService.uploadStorage(item.file, filePath);

    this.imageUploading = true;

    task.snapshotChanges().pipe(
        finalize(() => this.postService.getFileRef(filePath).getDownloadURL().subscribe(item => this.postDetail.featuredImage = item))
    ).subscribe();

    task.percentageChanges().subscribe((percentage) => {
      if (percentage === 100) {
        this.imageUploading = false;
      }
    })
  };

  handleClose(removedTag: string): void {
    this.postDetail.tags = this.postDetail.tags.filter(tag => tag !== removedTag);
  }

  sliceTagName(tag: string): string {
    const isLongTag = tag.length > 20;

    return isLongTag ? `${tag.slice(0, 20)}...` : tag;
  }

  showInput(): void {
    this.tagInputVisible = true;
    setTimeout(() => {
      this.tagInputElement.nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(): void {
    if (this.tagInputValue && this.postDetail.tags.indexOf(this.tagInputValue) === -1) {
      this.postDetail.tags = [...this.postDetail.tags, this.tagInputValue];
    }
    this.tagInputValue = '';
    this.tagInputVisible = false;
  }
}
