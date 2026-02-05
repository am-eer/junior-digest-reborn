import { FALLBACK_IMG } from "@/lib/globals";
import type { Article } from "@/types/types";
import Link from "next/link";
import { goodImgCheck } from "@/lib/utils";

interface Props {
    article: Article,
    featured?: boolean,
}

export default async function ArticleCard({ article, featured = false }: Props) {
    const title = article.title.rendered;
    const excerpt = article.excerpt.rendered;
    const imgData = {
        source_url: FALLBACK_IMG,
        alt_text: "article image",
        display: false
    };

    if (article._embedded["wp:featuredmedia"] && 0 < article._embedded["wp:featuredmedia"].length) {
        const fetchedImgData = article._embedded["wp:featuredmedia"][0];
        if (fetchedImgData.source_url) {
            imgData.source_url = fetchedImgData.source_url;
            imgData.display = true;
        }
        if (fetchedImgData.alt_text) {
            imgData.alt_text = fetchedImgData.alt_text;
        }
    }

    return (
        <Link
            href={`/${article.id}`}
            className={`
                p-5 bg-surface-card rounded-[20px] space-y-3 text-left cursor-pointer
                shadow-(--shadow-card) hover:shadow-(--shadow-card-hover)
                transition-shadow duration-180 ease-out
                ${featured ? "md:col-span-2 lg:col-span-2" : ""}
            `}
        >
            {(imgData.display && await goodImgCheck(imgData.source_url)) ? (
                <>
                    <img
                        src={imgData.source_url}
                        alt={imgData.alt_text}
                        className="w-full h-48 object-cover rounded-2xl"
                    />
                    <h2 className="text-heading text-lg" dangerouslySetInnerHTML={{ __html: title }}></h2>
                </>
            ) : (
                <>
                    <h2 className="text-heading text-lg" dangerouslySetInnerHTML={{ __html: title }}></h2>
                    <div className="text-body text-text-secondary" dangerouslySetInnerHTML={{ __html: excerpt }}></div>
                </>
            )}
        </Link>
    );
}