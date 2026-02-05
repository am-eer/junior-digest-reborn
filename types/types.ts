export interface Article {
  id: number,
  slug: string,
  title: {
    rendered: string,
  },
  excerpt: {
    rendered: string,
  },
  status: string,
  content: {
    rendered: string,
    protected: boolean,
  },
  "_embedded": {
    "wp:featuredmedia": {
      "source_url": string,
      "alt_text": string,
    }[]
  },
}