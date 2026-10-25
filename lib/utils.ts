import { ARCHIVES_START_DATE } from "./globals";

export async function goodImgCheck(url:string) {
    try {
        const response = await fetch(url, {method: "HEAD"});
        if(response.status >= 400 && response.status < 600) return false;    
    } catch(error) {
        return false;
    }
    return true;
}

export function formatContent(htmlString: string): string {
    let result = htmlString;
    const imgHtml = htmlString.match(/<img[^>]+>/);
    if (imgHtml) result = htmlString.replace(imgHtml[0], "");
    result = result.replace(/^([^:]+:)/, '<b>$1</b>');
    return result;
}

export async function fetchWordPressJSON<T>(
  url: string,
  options: RequestInit = {}
): Promise<{ data: T; response: Response }> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(
      `WordPress API returned HTTP ${response.status}`
    );
  }

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.toLowerCase().includes("application/json")) {
    throw new Error("WordPress API did not return JSON");
  }

  let data: T;

  try {
    data = (await response.json()) as T;
  } catch {
    throw new Error("WordPress API returned invalid JSON");
  }

  return { data, response };
}

export function isOnlyDigits(str: string): boolean {
  return /^\d+$/.test(str);
}

const MONTH_NAMES = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec"
];

export function isValidArchiveMonth(dateStr: string): boolean {
  const splitMonth = dateStr.split("-")
  if(splitMonth.length !== 2) return false;
  if(MONTH_NAMES.indexOf(splitMonth[0]) === -1) return false;
  if(!isOnlyDigits(splitMonth[1])) return false;
  const startDate = new Date(ARCHIVES_START_DATE);
  const dateObj = new Date(dateStr);
  if(+dateObj < +startDate) return false;
  const now = Date.now();
  if(+dateObj > now) return false;

  return true;
}
