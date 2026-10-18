import { API_JSON_URL, CACHE_OPTIONS } from "@/lib/globals";
import { Article } from "@/types/types";
import ArticleCard from "@/components/ArticleCard";
import CategoryFilter from "@/components/CategoryFilter";
import Pagination from "@/components/Pagination";

interface Props {
    params: Promise<{ searchTerm: string, pageNo: string }>,
}

export default async function SearchResults({ params }: Props) {
  const { searchTerm, pageNo } = await params;
  const fields = "&_fields=id,title,date_gmt,content,_links,_embedded";
  const response = await fetch(`${API_JSON_URL}/posts?search=${searchTerm}&page=${pageNo}&per_page=24&_embed${fields}`, CACHE_OPTIONS);
  const totalPages = Number(response.headers.get('X-WP-TotalPages'));
  let articles = await response.json() as Article[];

  let articleGrid = (
    <main className="px-4 md:px-6 lg:px-8 py-6 text-center flex-1 grid place-items-center max-w-300 w-full mx-auto">
      Sorry, no articles available
    </main>
  );

  if (0 < articles.length) {
    articleGrid = (
      <main className="px-4 md:px-6 lg:px-8 py-6 grid grid-cols-1 gap-6 flex-1 md:grid-cols-2 lg:grid-cols-3 max-w-300 w-full mx-auto">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            featured={false}
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
        currentPage={Number(pageNo)}
        totalPages={totalPages}
        buildHref={(page) => `/search/${searchTerm}/${page}`}
      />
    </>
  );
}
