export async function goodImgCheck(url:string) {
    try {
        const response = await fetch(url, {method: "HEAD"});
        if(response.status >= 400 && response.status < 600) return false;    
    } catch(error) {
        return false;
    }
    return true;
}