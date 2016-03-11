export interface Song {
  title: string;
  artist: string;
  uri: string;
  preview: string;
  image_large: string;
  spotify_url: string;
  likes: number;
  comments: Array<{}>;
  deleted?: boolean;
  searched?: boolean;
  decided?: boolean;
  choice?: boolean;
}
