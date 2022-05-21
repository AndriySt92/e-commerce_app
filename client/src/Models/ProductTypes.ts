export interface IReview {
  _id: string
  name: string
  rating: number
  comment: string
  user: string
}

export interface IProduct {
  _id: string
  name: string
  image: string
  description: string
  reviews: Array<IReview>
  rating: string
  numReviews: string
  price: string
  countInStock: number
}


export interface IGetProductsResponse {
    products: Array<IProduct>
    currentPage: number
    totalPages: number
}

export interface IReviewFormData {
    comment: string
    rating: number
    productId?: string
}
