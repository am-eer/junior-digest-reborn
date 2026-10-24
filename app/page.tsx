import { API_JSON_URL, CACHE_OPTIONS } from "@/lib/globals";
import { Article } from "@/types/types";
import ArticleCard from "@/components/ArticleCard";
import CategoryFilter from "@/components/CategoryFilter";
import Pagination from "@/components/Pagination";
import { fetchWordPressJSON } from "@/lib/utils";

export default async function Home() {
  const fields = "&_fields=id,title,date_gmt,content,_links,_embedded";
  const { data: articles, response } = await fetchWordPressJSON<Article[]>(`${API_JSON_URL}/posts?per_page=23&_embed${fields}`, CACHE_OPTIONS);
  const totalPages = Math.ceil((Number(response.headers.get('X-WP-Total')) + 1)/24);

  let articleGrid = (
    <main className="px-4 md:px-6 lg:px-8 py-6 text-center flex-1 grid place-items-center max-w-300 w-full mx-auto">
      Sorry, no articles available
    </main>
  );

  if (0 < articles.length) {
    articleGrid = (
      <main className="px-4 md:px-6 lg:px-8 py-6 grid grid-cols-1 gap-6 flex-1 md:grid-cols-2 lg:grid-cols-3 max-w-300 w-full mx-auto">
        {articles.map((article, idx) => (
          <ArticleCard
            key={idx}
            article={article}
            featured={idx === 0}
          />
        ))}
      </main>
    );
  }

  return (
    <>
      <CategoryFilter />
      {articleGrid}
      <Pagination
        currentPage={1}
        totalPages={totalPages}
        buildHref={(page) => page === 1 ? "/" : `/${page}`}
      />
    </>
  );
}
