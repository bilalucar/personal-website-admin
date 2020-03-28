import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// pages
import { PostsComponent } from './posts.component';
import { EditPostComponent } from './edit-post/edit-post.component';

const routes: Routes = [
  { path: '', component: PostsComponent },
  { path: ':id', component: EditPostComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class PostsRoutingModule {}
