export interface article {
  article_id: string,
  article_url: string,
  brief_content: string,
  create_time: number,
  detail: string,
  name: string,
  title: string,
  tags:string[],
  update_time: number,
  cover_image: string,
  isHtml?:boolean
}
