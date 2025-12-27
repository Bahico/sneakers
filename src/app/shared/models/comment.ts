export interface Comment {
  id?: string;
  user_name: string;
  product_id: string;
  rating: number;
  text: string;
  status: number;
  images: string[];
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateCommentDto {
  user_name: string;
  product_id: string;
  rating: number;
  text: string;
  images?: string[];
}

export interface UpdateCommentDto {
  rating?: number;
  text?: string;
  images?: string[];
}

export interface CommentListResult {
  stats: {
    total_reviews: number;
    total_ratings: number;
    average_rating: number;
    rating_distribution: {
      [key: number]: number;
    };
  };
  reviews: Comment[];
}