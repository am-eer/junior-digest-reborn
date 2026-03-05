export interface Article {
  id: number,
  date_gmt: string,
  modified_gmt: string,
  title: {
    rendered: string,
  },
  status: string,
  content: {
    rendered: string,
    protected: boolean,
  },
  _embedded: {
    "wp:featuredmedia": {
      source_url: string,
      alt_text: string,
    }[],
    "wp:term": {
      id: number,
      name: string,
    }[][],
  },
}