export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "noEnvFile";
export const API_JSON_URL = `${API_BASE_URL}/wp-json/wp/v2`;
export const CUSTOM_API_JSON_URL = `${API_BASE_URL}/wp-json/custom-endpoints/v1`;
export const API_IMG_HOST = API_BASE_URL.replace("https://", "");
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
export const INITIAL_CATEGORIES = process.env.NEXT_PUBLIC_INITIAL_CATEGORIES;
export const FALLBACK_IMG = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5qROQFV_3SDisHS4ISFujMVkZQq528xxgKg&s";
export const ARCHIVES_START_DATE = "2016-01-01T00:00:00";
export const CACHE_TIME_LIMIT = Number(process.env.NEXT_PUBLIC_CACHE_TIME_LIMIT);
export const CACHE_OPTIONS = {
    next: {
        tags: ["all"],
        revalidate: CACHE_TIME_LIMIT,
    },
};