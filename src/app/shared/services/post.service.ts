import { Injectable } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

import 'firebase/firestore';
import 'firebase/storage';

@Injectable({
  providedIn: SharedModule
})
export class PostService {

  PATH = 'posts';

  constructor(
      private afs: AngularFirestore,
      private storage: AngularFireStorage
  ) { }

  getPostList() {
    return this.afs.collection<any>(this.PATH).snapshotChanges();
  }

  getPostDetail(id: string) {
    return this.afs.doc<any>(`${this.PATH}/${id}`).valueChanges();
  }

  createPost(data: Post.PostModel) {
    let postId = data.id;

    if (!postId) {
      const id = this.afs.createId();

      postId = id;
      data.id = id;
    }

    return this.afs.doc<any>(`${this.PATH}/${postId}`).set(data);
  }

  uploadStorage(file, filePath) {
    return this.storage.upload(filePath, file);
  }

  getFileRef(filePath) {
    return this.storage.ref(filePath);
  }
}
