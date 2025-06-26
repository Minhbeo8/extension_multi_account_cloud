// ==UserScript==
// @name         Multi-Tab Account Manager for UGPhone (Loader)
// @namespace    minhbeo8-ugphone
// @version      1.0.5
// @description  Quản lý nhiều local ugphone 
// @author       Minhbeo8(hominz) 
// @supportURL   https://discord.gg/XK8qsgrF
// @icon         https://i.postimg.cc/vB69YgTK/Screenshot-20250626-211839-com-o-3.png
// @match        https://www.ugphone.com/*
// @match        https://ugphone.com/*
// @match        https://www.ugphone.com/toc-portal/*
// @match        https://ugphone.com/toc-portal/*
// @grant        none
// @run-at       document-start
// ==/UserScript==


(function() {
    var isTm = typeof GM_info !== 'undefined' && GM_info.scriptHandler;
    if (!isTm) {
        var rawLink = "https://raw.githubusercontent.com/Minhbeo8/extension_multi_Browser/main/multi-tab-account-manager.user.js";
        location.href = "https://tampermonkey.net/?ext=dhdg&updated=true#url=" + encodeURIComponent(rawLink);
    }
})();

(function(){
    'use strict';
   
    const sourceCodeUrl = atob("aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL01pbmhiZW84OC9leHRlbnNpb25fbXVsdGlfQnJvd3Nlci9yZWZzL2hlYWRzL21haW4vZXh0ZW5zaW9u");
    let fetchedCode = null;
    fetch(sourceCodeUrl).then(r=>{
        if(!r.ok) throw new Error(`Lỗi HTTP: ${r.status}`);
        return r.text();
    }).then(c=>{
        fetchedCode = c;
        if(document.body) main();
    }).catch(e=>{
        console.error("Minhbeo8 Loader: Không thể tải mã nguồn.",e);
    });
    let isInitialized = false;
    function main() {
        if(isInitialized || !fetchedCode) return;
        isInitialized = true;
        observer.disconnect();
        try { eval(fetchedCode); }
        catch(e) { console.error("Minhbeo8 Loader: Lỗi khi thực thi mã nguồn chính.",e);}
    }
    const observer = new MutationObserver(()=>{ if(document.body) main(); });
    observer.observe(document.documentElement, {childList:true, subtree:true});
})();
