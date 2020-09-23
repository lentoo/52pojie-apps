
export interface Plate {
  name: string
  more_link: string
  id: Number
  list: PlateItem[]
}
export interface PlateItem {
  text: string
  link: string
}

export interface Article {
  id: string
  plate: string
  title: string
  username: string
  avatar: string
  post_date: string
  content: string
  link: string
  pan_links: string[]
  pages: string
  diff: DiffImageContent[]
  comments: ArticleCommentItem[]
  hasNext: boolean
}
interface DiffImageContent {
  old: string
  new: string
}
export interface ArticleComment {
  comments: ArticleCommentItem[]
  id: string
  page: string
  pages: string
  hasNext: boolean
}
export interface ArticleCommentItem {
  username: string
  avatar: string
  content: string
  post_date: string
}