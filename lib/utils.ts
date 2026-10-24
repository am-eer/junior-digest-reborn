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