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