import { API_JSON_URL, CACHE_OPTIONS } from "@/lib/globals";
import { Article } from "@/types/types";
import ArticleCard from "@/components/ArticleCard";

interface RelatedProps {
  categories: {
    id: number,
    name: string
  }[],
  currentArticle: string
}

export default async function Related({categories, currentArticle}:RelatedProps) {
  const categoryIds = categories.map((category) => category.id).join();
  const fields = "&_fields=id,title,date_gmt,content,_links,_embedded";
  const response = await fetch(`${API_JSON_URL}/posts?per_page=6&exclude=${currentArticle}&_embed${fields}&categories=${categoryIds}`, CACHE_OPTIONS);
  let articles = await response.json() as Article[];

  let articleGrid = (
    <main className="px-4 md:px-6 lg:px-8 py-6 text-center flex-1 grid place-items-center max-w-300 w-full mx-auto">
      Sorry, no articles available
    </main>
  );

  if (0 < articles.length) {
    articleGrid = (
      <main className="lg:py-6 grid grid-cols-1 gap-6 flex-1 md:grid-cols-2 lg:grid-cols-3 max-w-300 w-full mx-auto">
        {articles.map((article, idx) => (
          <ArticleCard
            key={idx}
            article={article}
          />
        ))}
      </main>
    );
  }

  return (
    <>{articleGrid}</>
  );
}
