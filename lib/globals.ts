export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "noEnvFile";
export const API_JSON_URL = `${API_BASE_URL}/wp-json/wp/v2`;
export const API_IMG_HOST = API_BASE_URL.replace("https://", "");

export const FALLBACK_IMG = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5qROQFV_3SDisHS4ISFujMVkZQq528xxgKg&s";