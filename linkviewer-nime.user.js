// ==UserScript==
// @name         SKIPPER
// @version      0.1
// @description  Sebuah kegabutan belaka
// @author       You
// @match        https://kusonime.com/*
// @match        https://anime.meownime.io/*
// @match        https://otakudesu.media/episode/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kusonime.com
// @grant        GM_xmlhttpRequest
// @connect      self
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

(async function() {
    const DB_ALLOWED_URL = {
        "clicksfly.com":{type: "base64", param:"url"}, // URL:HOST , URL:PARAM
        "lia.flashtik.com":{type: "base64", param:"r"},
        "desudrive.com":{type:"redirect"}
    }
    let listUrl = $("a")
    for (const urls of listUrl){
        try{
            let url = new URL(urls);
            if(!Object.keys(DB_ALLOWED_URL).includes(url.host)) continue
            switch(DB_ALLOWED_URL[url.host].type){
                case "base64":
                    var checkParam = url.searchParams.get(DB_ALLOWED_URL[url.host].param)
                    if(!checkParam) continue
                    var decodeUrl = atob(checkParam)
                    changeLink(urls, decodeUrl)
                    break;
                case "redirect":
                    var linkRedirect = await getRedirect(url)
                    changeLink(urls, linkRedirect)
                    break
                default:
                    break
            }
        }catch(e){
            console.log(urls)
            console.log(e)
        }
    }
})();
async function getRedirect(url){
    const r = await GM.xmlHttpRequest({
        url: url
    }).catch((e) => {console.error(e); return null});
    if(!r) return null
    return r.finalUrl;
}
function changeLink(element, url){
    $(element).attr("href", url)
}
