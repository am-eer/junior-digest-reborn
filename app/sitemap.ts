import type { MetadataRoute } from "next";
import {
  BASE_URL,
  API_JSON_URL,
  CACHE_OPTIONS,
} from "@/lib/globals";
import { fetchWordPressJSON } from "@/lib/utils";

interface PostSummary {
  id: number;
  modified_gmt?: string;
  date_gmt?: string;
}

async function getArticleRoutes(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const articles: MetadataRoute.Sitemap = [];

  try {
    const fields = "&_fields=id,modified_gmt,date_gmt";
    const firstPageUrl = `${API_JSON_URL}/posts?per_page=100&page=1${fields}`;
    const { data: firstPageData, response } = await fetchWordPressJSON<PostSummary[]>(
      firstPageUrl,
      CACHE_OPTIONS
    );

    const addPosts = (posts: PostSummary[]) => {
      for (const post of posts) {
        if (!post?.id) continue;
        articles.push({
          url: `${baseUrl}/article/${post.id}`,
          lastModified: post.modified_gmt
            ? new Date(post.modified_gmt)
            : post.date_gmt
            ? new Date(post.date_gmt)
            : new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    };

    if (Array.isArray(firstPageData)) {
      addPosts(firstPageData);
    }

    const totalPagesHeader = response.headers.get("X-WP-TotalPages");
    const totalPages = totalPagesHeader ? parseInt(totalPagesHeader, 10) : 1;

    // Fetch remaining pages in parallel up to 20 pages (2,000 articles)
    if (totalPages > 1) {
      const maxPagesToFetch = Math.min(totalPages, 20);
      const pagePromises: Promise<{ data: PostSummary[] }>[] = [];

      for (let page = 2; page <= maxPagesToFetch; page++) {
        pagePromises.push(
          fetchWordPressJSON<PostSummary[]>(
            `${API_JSON_URL}/posts?per_page=100&page=${page}${fields}`,
            CACHE_OPTIONS
          )
        );
      }

      const results = await Promise.allSettled(pagePromises);
      for (const res of results) {
        if (res.status === "fulfilled" && Array.isArray(res.value.data)) {
          addPosts(res.value.data);
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch articles for sitemap:", error);
  }

  return articles;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (BASE_URL || "https://juniordigest.com").replace(/\/+$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const articleRoutes = await getArticleRoutes(baseUrl);

  return [
    ...staticRoutes,
    ...articleRoutes,
  ];
}
