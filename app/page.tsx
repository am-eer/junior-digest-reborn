import { API_JSON_URL } from "@/lib/globals";
import { Article } from "@/types/types";
import ArticleCard from "@/components/ArticleCard";

export default async function Home() {
  const response = await fetch(`${API_JSON_URL}/posts?per_page=20&_embed`);
  let articles = await response.json() as Article[];
  articles = articles.filter(article => article.status && article.status === "publish");

  let articleGrid = (
    <main className="px-52 py-4 text-center flex-1 grid place-items-center">
      Sorry, no articles available
    </main>
  );

  if(0 < articles.length) {
    articleGrid = (
      <main className="px-52 py-4 grid grid-cols-3 gap-2 flex-1">
        {articles.map((article, idx) => <ArticleCard key={idx} article={article} />)}
      </main>
    );
  }

  return articleGrid;
}
