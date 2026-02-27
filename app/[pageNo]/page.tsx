import { API_JSON_URL } from "@/lib/globals";
import { Article } from "@/types/types";
import ArticleCard from "@/components/ArticleCard";
import CategoryFilter from "@/components/CategoryFilter";
import Pagination from "@/components/Pagination";

interface Props {
    params: Promise<{ pageNo: string }>,
}

export default async function Home({ params }: Props) {
  const { pageNo } = await params;  
  const fields = "&_fields=id,title,date_gmt,content,status,_links,_embedded";
  const response = await fetch(`${API_JSON_URL}/posts?per_page=21&offset=20&page=${Number(pageNo)-1}&_embed${fields}`);
  const totalPages = Number(response.headers.get('X-WP-TotalPages'));
  let articles = await response.json() as Article[];
  articles = articles.filter(article => article.status && article.status === "publish");

  let articleGrid = (
    <main className="px-4 md:px-6 lg:px-8 py-6 text-center flex-1 grid place-items-center max-w-[1200px] w-full mx-auto">
      Sorry, no articles available
    </main>
  );

  if (0 < articles.length) {
    articleGrid = (
      <main className="px-4 md:px-6 lg:px-8 py-6 grid grid-cols-1 gap-6 flex-1 md:grid-cols-2 lg:grid-cols-3 max-w-[1200px] w-full mx-auto">
        {articles.map((article, idx) => (
          <ArticleCard
            key={idx}
            article={article}
            featured={false}
          />
        ))}
      </main>
    );
  }

  return (
    <>
      <CategoryFilter/>
      {articleGrid}
      <Pagination
        currentPage={Number(pageNo)}
        totalPages={totalPages}
        buildHref={(page) => page === 1 ? "/" : `/${page}`}
      />
    </>
  );
}
