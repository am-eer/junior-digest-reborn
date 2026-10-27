import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import {
  BASE_URL,
  API_JSON_URL,
  CUSTOM_API_JSON_URL,
  INITIAL_CATEGORIES,
  ARCHIVES_START_DATE,
} from "@/lib/globals";
import { fetchWordPressJSON } from "@/lib/utils";
import { Article } from "@/types/types";

interface PostSummary {
  id: number;
  modified_gmt?: string;
  date_gmt?: string;
  modified?: string;
  date?: string;
}

interface CategorySummary {
  id: number;
  name?: string;
}

let ALL_ROUTES: MetadataRoute.Sitemap = [];
const ROUTES_PER_SITEMAP = 45_000;

const MONTH_NAMES = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec"
];

const CACHE_FILE_PATH = path.join(process.cwd(), "lib", "archives-cache.json");

function loadArchivesCache(): Record<string, number> {
  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const content = fs.readFileSync(CACHE_FILE_PATH, "utf-8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.warn("Could not read archives-cache.json from disk, fallback to empty cache:", error);
  }
  return {};
}

function saveArchivesCache(cache: Record<string, number>): void {
  try {
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cache, null, 2), "utf-8");
  } catch (error) {
    console.warn("Could not write archives-cache.json to disk:", error);
  }
}

function getMonthDateRange(monthSlug: string): { start: Date; end: Date } {
  const [monStr, yearStr] = monthSlug.split("-");
  const monthIndex = MONTH_NAMES.indexOf((monStr || "").toLowerCase());
  const year = parseInt(yearStr || "", 10);

  const start = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0));
  const end = new Date(Date.UTC(year, monthIndex + 1, 1, 0, 0, 0));
  return { start, end };
}

function getAllArchiveMonths(): { pastMonths: string[]; currentMonth: string } {
  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const currentMonthIndex = now.getUTCMonth();
  const currentMonth = `${MONTH_NAMES[currentMonthIndex]}-${currentYear}`;

  const startDate = new Date(ARCHIVES_START_DATE);
  const startYear = startDate.getUTCFullYear();
  const startMonthIndex = startDate.getUTCMonth();

  const pastMonths: string[] = [];
  let y = currentYear;
  let m = currentMonthIndex - 1;

  while (y > startYear || (y === startYear && m >= startMonthIndex)) {
    if (m < 0) {
      m = 11;
      y--;
      continue;
    }
    pastMonths.push(`${MONTH_NAMES[m]}-${y}`);
    m--;
  }

  return { pastMonths, currentMonth };
}

async function fetchMonthTotalPages(
  monthSlug: string
): Promise<{ success: boolean; totalPages: number }> {
  const { start, end } = getMonthDateRange(monthSlug);
  try {
    const url = `${API_JSON_URL}/posts?after=${start.toISOString()}&before=${end.toISOString()}&per_page=24&page=1&_fields=id`;
    const { response } = await fetchWordPressJSON<Article[]>(url);
    const totalPagesHeader = response.headers.get("X-WP-TotalPages");
    const totalPages = totalPagesHeader ? parseInt(totalPagesHeader, 10) : 0;
    return { success: true, totalPages: Math.max(0, totalPages) };
  } catch (error) {
    console.error(`Failed to fetch total pages for archive month ${monthSlug}:`, error);
    return { success: false, totalPages: 0 };
  }
}

async function getArchiveRoutes(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const archiveRoutes: MetadataRoute.Sitemap = [];
  const { pastMonths, currentMonth } = getAllArchiveMonths();

  const cache = loadArchivesCache();
  let cacheModified = false;

  // Identify past months not yet recorded in the permanent cache
  const uncachedPastMonths = pastMonths.filter((m) => cache[m] === undefined);

  if (uncachedPastMonths.length > 0) {
    const BATCH_SIZE = 5;
    for (let i = 0; i < uncachedPastMonths.length; i += BATCH_SIZE) {
      const batch = uncachedPastMonths.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(
        batch.map((m) => fetchMonthTotalPages(m).then((res) => ({ month: m, ...res })))
      );

      for (const res of results) {
        if (res.status === "fulfilled" && res.value.success) {
          cache[res.value.month] = res.value.totalPages;
          cacheModified = true;
        }
      }
    }

    if (cacheModified) {
      saveArchivesCache(cache);
    }
  }

  // Generate routes for all previous months (frozen; never changed)
  for (const month of pastMonths) {
    const totalPages = cache[month] ?? 0;
    if (totalPages > 0) {
      const { end } = getMonthDateRange(month);
      for (let page = 1; page <= totalPages; page++) {
        archiveRoutes.push({
          url: `${baseUrl}/archives/${month}/${page}`,
          lastModified: end,
          changeFrequency: "never",
          priority: 0.5,
        });
      }
    }
  }

  // Generate routes for current in-progress month dynamically
  const currentMonthResult = await fetchMonthTotalPages(currentMonth);
  if (currentMonthResult.totalPages > 0) {
    for (let page = 1; page <= currentMonthResult.totalPages; page++) {
      archiveRoutes.push({
        url: `${baseUrl}/archives/${currentMonth}/${page}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  return archiveRoutes;
}

async function fetchCategoryTotalPages(
  categoryId: number
): Promise<{ success: boolean; totalPages: number }> {
  try {
    const url = `${API_JSON_URL}/posts?categories=${categoryId}&per_page=24&page=1&_fields=id`;
    const { response } = await fetchWordPressJSON<Article[]>(url);
    const totalPagesHeader = response.headers.get("X-WP-TotalPages");
    const totalPages = totalPagesHeader ? parseInt(totalPagesHeader, 10) : 0;
    return { success: true, totalPages: Math.max(0, totalPages) };
  } catch (error) {
    console.error(`Failed to fetch total pages for category ${categoryId}:`, error);
    return { success: false, totalPages: 0 };
  }
}

async function getCategoryRoutes(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const categoryRoutes: MetadataRoute.Sitemap = [];
  const categoryIds = new Set<number>();

  const collectCategoryIds = (items: CategorySummary[]) => {
    for (const cat of items) {
      if (!cat?.id || cat.id <= 0) continue;
      categoryIds.add(cat.id);
    }
  };

  try {
    const { data } = await fetchWordPressJSON<CategorySummary[]>(
      `${API_JSON_URL}/categories?per_page=100&_fields=id,name`
    );
    if (Array.isArray(data) && data.length > 0) {
      collectCategoryIds(data);
    }
  } catch (error) {
    console.error("Failed to fetch categories from API for sitemap. Using INITIAL_CATEGORIES from env variable. Error:", error);
  }

  // Fallback using INITIAL_CATEGORIES from env variables
  if (INITIAL_CATEGORIES) {
    try {
      const initialCats: CategorySummary[] = JSON.parse(INITIAL_CATEGORIES);
      if (Array.isArray(initialCats)) {
        collectCategoryIds(initialCats);
      }
    } catch (e) {
      console.error("Failed to parse INITIAL_CATEGORIES for sitemap:", e);
    }
  }

  // Fetch total pages for each category and generate routes for all pages
  const categoryIdsList = Array.from(categoryIds);
  const BATCH_SIZE = 5;

  for (let i = 0; i < categoryIdsList.length; i += BATCH_SIZE) {
    const batch = categoryIdsList.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map((id) =>
        fetchCategoryTotalPages(id).then((res) => ({ categoryId: id, ...res }))
      )
    );

    for (const res of results) {
      if (res.status === "fulfilled") {
        const { categoryId, success, totalPages } = res.value;
        const pagesCount = totalPages > 0 ? totalPages : (!success ? 1 : 0);
        for (let page = 1; page <= pagesCount; page++) {
          categoryRoutes.push({
            url: `${baseUrl}/category/${categoryId}/${page}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
          });
        }
      }
    }
  }

  return categoryRoutes;
}

async function getArticleRoutes(
  baseUrl: string,
  sitemapId: number = 0
): Promise<MetadataRoute.Sitemap> {
  const articles: MetadataRoute.Sitemap = [];

  try {
    const fields = "&_fields=id,modified_gmt,date_gmt,modified,date";
    const firstPageUrl = `${API_JSON_URL}/posts?per_page=100&page=1${fields}`;
    const { data: firstPageData, response } = await fetchWordPressJSON<PostSummary[]>(firstPageUrl);

    const parseDate = (dateStr?: string) => {
      if (!dateStr) return null;
      const parsed = new Date(dateStr.endsWith("Z") ? dateStr : `${dateStr}Z`);
      return isNaN(parsed.getTime()) ? null : parsed;
    };

    const addPosts = (posts: PostSummary[]) => {
      for (const post of posts) {
        if (!post?.id) continue;
        const lastMod =
          parseDate(post.modified_gmt) ||
          parseDate(post.date_gmt) ||
          (post.modified ? new Date(post.modified) : null) ||
          (post.date ? new Date(post.date) : null) ||
          new Date();

        articles.push({
          url: `${baseUrl}/article/${post.id}`,
          lastModified: lastMod,
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

    // Fetch all remaining pages for this sitemap chunk in controlled batches
    const BATCH_SIZE = 5;

    for (let i = 2; i <= totalPages; i += BATCH_SIZE) {
      const batchPromises: Promise<{ data: PostSummary[] }>[] = [];
      for (let page = i; page < i + BATCH_SIZE && page <= totalPages; page++) {
        batchPromises.push(
          fetchWordPressJSON<PostSummary[]>(`${API_JSON_URL}/posts?per_page=100&page=${page}${fields}`)
        );
      }

      const results = await Promise.allSettled(batchPromises);
      for (const res of results) {
        if (res.status === "fulfilled" && Array.isArray(res.value.data)) {
          addPosts(res.value.data);
        }
      }
    }
  } catch (error) {
    console.error(`Failed to fetch articles for sitemap ${sitemapId}:`, error);
  }

  return articles;
}

async function getHomeRoutes(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const homeRoutes: MetadataRoute.Sitemap = [];

  try {
    const fields = "&_fields=id";
    const { data: articles, response } = await fetchWordPressJSON<Article[]>(`${API_JSON_URL}/posts?per_page=24&offset=23${fields}`);
    const totalPages = Number(response.headers.get("X-WP-TotalPages"));

    for(let i = 2; i <= totalPages; i++) {
        homeRoutes.push({
        url: `${baseUrl}/${i}`,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch (error) {
    console.error("Failed to fetch page routes for home:", error);
  }

  return homeRoutes;
}

async function getAllRoutes(): Promise<MetadataRoute.Sitemap> {
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
    {
      url: `${baseUrl}/archives`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const [articleRoutes, homeRoutes, categoryRoutes, archiveRoutes, ] = await Promise.all([
    getArticleRoutes(baseUrl, 0),
    getHomeRoutes(baseUrl),
    getCategoryRoutes(baseUrl),
    getArchiveRoutes(baseUrl),
  ]);

  const routes = [
    ...staticRoutes,
    ...articleRoutes,
    ...homeRoutes,
    ...categoryRoutes,
    ...archiveRoutes,
  ];

  return routes;
}

export async function generateSitemaps(): Promise<{ id: number }[]> {
  if(ALL_ROUTES.length === 0) ALL_ROUTES = await getAllRoutes();
  const numSitemaps = Math.max(1, Math.ceil(ALL_ROUTES.length / ROUTES_PER_SITEMAP));
  const sitemaps: { id: number }[] = [];
  for (let i = 0; i < numSitemaps; i++) {
    sitemaps.push({ id: i });
  }
  return sitemaps;

  // uncomment this to build without sitemap generation 
  // return [{id: 0}];
}

export default async function sitemap(props?: {
  id?: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const rawId = props?.id ? await props.id : "0";
  const sitemapId = parseInt(rawId, 10) || 0;

  if(ALL_ROUTES.length === 0) ALL_ROUTES = await getAllRoutes();
  return ALL_ROUTES.slice(sitemapId * ROUTES_PER_SITEMAP, Math.min(ROUTES_PER_SITEMAP * (sitemapId + 1), ALL_ROUTES.length));

  // uncomment this to build without sitemap generation
  // return [{
  //   url: BASE_URL,
  //   lastModified: new Date(),
  //   changeFrequency: "daily",
  //   priority: 1.0,
  // }];
}
