import type { Article } from "@/types/types";
import { FALLBACK_IMG } from "@/lib/globals";
import Link from "next/link";
import { goodImgCheck, formatContent } from "@/lib/utils";
import TimeAgo from "./TimeAgo";

interface Props {
    article: Article,
    featured?: boolean,
}

export default async function ArticleCard({ article, featured = false }: Props) {
    const title = article.title.rendered;
    const publishDate = article.date_gmt; //	"2025-07-12T16:30:53"
    const content = formatContent(article.content.rendered);
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
        <Link
            href={`/article/${article.id}`}
            className={`
                relative p-5 h-100 overflow-clip bg-surface-card rounded-card space-y-3 text-left cursor-pointer
                border-2 border-transparent hover:border-accent transition-border duration-180 ease-out shadow-md
                ${featured ? "md:col-span-2" : ""}
            `}
        >
            <div className="absolute z-10 shadow-(--card-mask) h-full w-250 top-full -left-20"></div>
            {showImg && (
                    <img
                        src={imgData.source_url}
                        alt={imgData.alt_text}
                        className="w-full h-48 object-cover rounded-2xl"
                    />
                )
            }
            <TimeAgo dateGmt={publishDate} className="text-accent" />
            <h2 className="text-heading text-lg pt-3" dangerouslySetInnerHTML={{ __html: title }}></h2>
            <div className="text-body text-text-secondary" dangerouslySetInnerHTML={{ __html: content }}></div>
        </Link>
    );
}