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
    const colonIdx = result.substring(0, 100).indexOf(":");
    if(colonIdx !== -1) result = `<b>${result.substring(0, colonIdx + 1)}</p></b><p>${result.substring(colonIdx + 1)}`;
    return result.replace('<a class="storyTags" href="http://www.business-standard.com/search?type=news&amp;q=Lodha+Committee" target="_blank">Lodha Committee </a>', "");
}