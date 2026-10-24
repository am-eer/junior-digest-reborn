import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/globals";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (BASE_URL || "https://juniordigest.com").replace(/\/+$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/search/", "/archives/", "/categories/"],
      },
      {
        userAgent: [
          // AI and search scrapers
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "Anthropic-AI",
          "ClaudeBot",
          "Google-Extended",
          "PerplexityBot",
          "Bytespider",
          "AhrefsBot",
          "SemrushBot",
          "MJ12bot",
          // Social media crawlers
          "facebookexternalhit",
          "Facebot",
          "Twitterbot",
          "LinkedInBot",
          "Pinterestbot",
          "Slackbot",
          "TelegramBot",
          "WhatsApp",
          "Discordbot",
          "SkypeURIPreview",
          // Monitoring & uptime bots
          "UptimeRobot",
          "Pingdom",
          "PingdomBot",
          "Better Uptime",
          "Site24x7",
          "StatusCake",
          "Datadog",
          "NewRelicPinger",
        ],
        disallow: ["/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
