export interface PixabayImage {
  id: number;
  tags: string;
  type: string; // 'vector', 'illustration', 'photo'
  user: string;
  userImageURL: string;
  previewURL: string;
  previewWidth: number;
  previewHeight: number;
  webURL: string;
  largeImageURL: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
  views: number;
  downloads: number;
  collections: number;
  likes: number;
  comments: number;
  category: string;
  colors: string[];
}

export interface PixabaySearchResponse {
  total: number;
  totalHits: number;
  hits: PixabayImage[];
}
