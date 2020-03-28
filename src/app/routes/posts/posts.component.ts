import { Component, OnInit } from '@angular/core';

import { PostService } from '@shared/services/post.service';

import { RoleConstantEnum } from '@shared/enums/role-constant.enum';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html'
})
export class PostsComponent implements OnInit {

  TABLE_PAGE_SIZE = 20;

  loading = false;
  posts: Post.PostModel[];
  roleConstantEnum = RoleConstantEnum;

  constructor(
      private postService: PostService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.postService.getPostList().subscribe(response => {
      this.loading = false;
      this.posts = response.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;

        return { id, ...data };
      });
    }, error => {
      this.loading = false;
      console.log('error while fetching post list', error);
    });
  }
}
