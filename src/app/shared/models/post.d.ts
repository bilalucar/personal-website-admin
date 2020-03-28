declare namespace Post {
  export interface PostModel {
    id: string;
    author: string;
    content: string;
    imageUrl: string;
    summary: string;
    timestamp: number | Date;
    title: string;
    url: string;
  }
}
