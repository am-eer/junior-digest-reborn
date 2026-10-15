import type { Article } from "@/types/types";
import { API_JSON_URL, FALLBACK_IMG } from "@/lib/globals";
import { goodImgCheck, formatContent } from "@/lib/utils";
import TimeAgo from "@/components/TimeAgo";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import ShareButton from "@/components/ShareButton";
import { Calendar, Pencil } from "lucide-react";
import Related from "@/components/Related";

interface Props {
    params: Promise<{ articleId: string }>,
}

export default async function ArticlePage({ params }: Props) {
    const { articleId } = await params;
    const fields = "&fields=date_gmt,modified_gmt,title,content,_links,_embedded";
    const response = await fetch(`${API_JSON_URL}/posts/${articleId}?_embed${fields}`);
    const article = await response.json() as Article;

    const title = article.title.rendered;
    const publishDate = article.date_gmt;
    const editDate = article.modified_gmt;
    const content = article.content.protected ? "Not available" : formatContent(article.content.rendered);
    const categories = article._embedded["wp:term"][0];
    const imgData = {
        source_url: FALLBACK_IMG,
        alt_text: "article image",
        display: false
    };

    if(article._embedded["wp:featuredmedia"] && 0 < article._embedded["wp:featuredmedia"].length) {
        const fetchedImgData = article._embedded["wp:featuredmedia"][0];
        if(fetchedImgData.source_url) {
            imgData.source_url = fetchedImgData.source_url;
            imgData.display = true;
        }
        if(fetchedImgData.alt_text) {
            imgData.alt_text = fetchedImgData.alt_text;
        }
    }

    const showImg = imgData.display && await goodImgCheck(imgData.source_url);

    return (
        <main className="flex-1 max-w-300 w-full mx-auto px-4 md:px-6 lg:px-8 py-8">
            {/* Top navigation */}
            <div className="flex items-center gap-6 mb-8">
                <BackButton />
                <ShareButton />
            </div>

            {/* Article card container */}
            <article className="bg-surface-card rounded-card shadow-md overflow-hidden">
                {/* Hero image */}
                {showImg && (
                    <div className="w-full aspect-video overflow-hidden">
                        <img
                            src={imgData.source_url}
                            alt={imgData.alt_text}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Article body */}
                <div className="px-6 md:px-10 lg:px-16 py-8 md:py-12">
                    {/* Category pills */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={category.id === -1 ? '/' : `/category/${category.id}/1`}
                                className="px-3.5 py-1 text-[13px] rounded-full border border-text-secondary/20 text-text-secondary hover:border-accent hover:text-accent transition-colors duration-180"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>

                    {/* Title */}
                    <h1
                        className="text-display text-2xl md:text-3xl lg:text-4xl mb-6"
                        dangerouslySetInnerHTML={{ __html: title }}
                    />

                    {/* Metadata bar */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-meta text-text-secondary mb-8 pb-8 border-b border-text-secondary/10">
                        <span className="inline-flex items-center gap-1.5">
                            <Calendar size={14} className="text-accent" />
                            {"Published "}
                            <TimeAgo dateGmt={publishDate} />
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Pencil size={14} className="text-accent" />
                            {"Modified "}
                            <TimeAgo dateGmt={editDate} />
                        </span>
                    </div>

                    {/* Article content */}
                    <div
                        className="article-content text-body text-justify"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                </div>
            </article>

            {/* Related News */}
            <div className="flex items-center gap-4 md:gap-6 my-12">
                <div className="flex-1 h-px bg-text-secondary/20" />
                <h2 className="text-xl md:text-2xl font-light text-text-secondary">
                    Related
                </h2>
                <div className="flex-1 h-px bg-text-secondary/20" />
            </div>
            <Related categories={categories} currentArticle={articleId}/>
        </main>
    );
}