declare namespace Post {
  export interface PostModel {
    id: string;
    author: string;
    content: string;
    imageUrl: string;
    summary: string;
    timestamp: number;
    title: string;
    url: string;
  }

  export class PostClassModel {
    id: string;
    author: string;
    content: string;
    imageUrl: string;
    summary: string;
    timestamp: number;
    title: string;
    url: string;
  }
}
