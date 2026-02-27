import { API_JSON_URL, FALLBACK_IMG } from "@/lib/globals";
import type { Article } from "@/types/types";

interface Props {
    params: Promise<{ articleId: string }>,
}

export default async function ArticlePage({ params }: Props) {
    const { articleId } = await params;
    const response = await fetch(`${API_JSON_URL}/posts/${articleId}?_embed`);
    const article = await response.json() as Article;

    const title = article.title.rendered;
    const imgData = {
        source_url: FALLBACK_IMG,
        alt_text: "article image"
    };

    if(article._embedded["wp:featuredmedia"] && 0 < article._embedded["wp:featuredmedia"].length) {
        const fetchedImgData = article._embedded["wp:featuredmedia"][0];
        if(fetchedImgData.source_url) {
            imgData.source_url = fetchedImgData.source_url;
        }
        if(fetchedImgData.alt_text) {
            imgData.alt_text = fetchedImgData.alt_text;
        }
    }

    const content = article.content.protected ? "Not available" : article.content.rendered;

    return (
        <main className="space-y-8 px-52 py-4">
            <header className="mt-8 text-2xl text-center px-52 py-4 rounded-xl border border-gray-50 dark:border-gray-900" dangerouslySetInnerHTML={{ __html: title }}></header>
            <img src={imgData.source_url} alt={imgData.alt_text} className="w-md h-auto object-contain mx-auto" />
            <div className="text-justify space-y-4 p-10 rounded-2xl border border-gray-50 dark:border-gray-900">{content}</div>
        </main>
    );
}