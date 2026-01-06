import { FALLBACK_IMG } from "@/lib/globals";
import type { Article } from "@/types/types";
import Link from "next/link";
import { goodImgCheck } from "@/lib/utils";

interface Props {
    article: Article,
}

export default async function ArticleCard({ article }: Props) {
    const title = article.title.rendered;
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

    return (
        <Link href={`/${article.id}`} className="p-4 shadow-lg rounded-2xl space-y-2 hover:bg-gray-50 dark:hover:bg-gray-900 text-center cursor-pointer">
            {/* todo: Use Next.js' Image element instead of img */}
            {imgData.display && await goodImgCheck(imgData.source_url) && <img src={imgData.source_url} alt={imgData.alt_text} className="size-64 object-contain mx-auto" />}
            <div dangerouslySetInnerHTML={{ __html: title }}></div>
        </Link>
    );
}