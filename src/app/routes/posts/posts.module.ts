import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { PostsRoutingModule } from './posts-routing.module';

import { PostsComponent } from './posts.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { NgxPermissionsModule } from 'ngx-permissions';

const COMPONENTS = [
  // page components
    PostsComponent,
    EditPostComponent
];

@NgModule({
    imports: [
        SharedModule,
        PostsRoutingModule,
        NgxPermissionsModule
    ],
  declarations: [
    ...COMPONENTS,
  ]
})
export class PostsModule {}
