import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// region: third libs
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

const THIRD_MODULES = [
  NgZorroAntdModule,
  CKEditorModule
];
// endregion

// region: your components & directives
const COMPONENTS = [];
const DIRECTIVES = [];
const PIPES = [];
// endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    // third libs
    ...THIRD_MODULES
  ],
  declarations: [
    // components and directives
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // third libs
    ...THIRD_MODULES,
    // components and directives
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES
  ]
})
export class SharedModule {}
