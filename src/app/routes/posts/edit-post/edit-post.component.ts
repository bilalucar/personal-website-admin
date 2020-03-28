import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { PostService } from '@shared/services/post.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { convertToSlug, validateFormGroup } from '@shared/utils/form.util';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment } from '@env/environment';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html'
})
export class EditPostComponent implements OnInit {

  id: string;
  loading: boolean;
  imageUploading: boolean;
  buttonLoading: boolean;
  postDetail;
  postForm: FormGroup;
  type: 'edit' | 'create' = 'create';

  Editor = ClassicEditor;
  editorData;
  featuredImageUrl: string;
  createdDate: Date = new Date();

  blogUrl = environment.blogUrl;
  postUrl: string;
  author: string;

  constructor(
      private activatedRoute: ActivatedRoute,
      private postService: PostService,
      private notificationService: NzNotificationService,
      private msg: NzMessageService,
      private fb: FormBuilder
  ) {
    this.id = activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    if (this.id === 'new') {
      this.editorData = '';
      this.createFormGroup({});
    } else {
      this.loading = true;
      this.postService.getPostDetail(this.id).subscribe(response => {
        this.type = 'edit';
        this.loading = false;
        this.postDetail = response;
        this.editorData = response.content;
        this.createFormGroup(this.postDetail);
      })
    }
  }
  
  createFormGroup(data?) {
    const {
      id = '',
      imageUrl = '',
      summary = '',
      title = '',
      timestamp = 0,
      url = ''
    } = data;

    if (url) {
      this.postUrl = url;
    }

    if (imageUrl) {
      this.featuredImageUrl = imageUrl;
    }

    if (timestamp) {
      this.createdDate = new Date(timestamp * 1000);
    }

    this.postForm = this.fb.group({
      id: [id, []],
      summary: [summary, []],
      title: [title, []]
    });

    this.postForm.get('title').valueChanges.subscribe(item => {
      this.postUrl = convertToSlug(item);
    });
  }

  submitForm() {
    validateFormGroup(this.postForm);
    
    if (this.postForm.invalid) {
      return;
    }

    this.buttonLoading = true;
    
    const formData = {
      ...this.postForm.value,
      content: this.editorData,
      imageUrl: this.featuredImageUrl,
      url: this.postUrl,
      timestamp: Math.floor(new Date().getTime() / 1000),
      author: 'Bilal Uçar'
    };
    
    this.postService.createPost(formData).then(() => {
      this.buttonLoading = false;
      this.notificationService.success('Create Successfully', '');
    });
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
        finalize(() => this.postService.getFileRef(filePath).getDownloadURL().subscribe(item => this.featuredImageUrl = item))
    ).subscribe();

    task.percentageChanges().subscribe((percentage) => {
      if (percentage === 100) {
        this.imageUploading = false;
      }
    })
  }
}
