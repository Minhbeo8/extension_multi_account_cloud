// ==UserScript==
// @name         Multi-Tab Account Manager for UGPhone (Loader)
// @namespace    minhbeo8-ugphone
// @version      1.0.3
// @description  Quản lý nhiều tài khoản UGPhone. Loader auto cập nhật code mới nhất từ Github, tự động mở trang cài đặt Tampermonkey nếu chưa cài!
// @author       Minhbeo8
// @homepageURL  https://github.com/Minhbeo8/extension_multi_Browser
// @supportURL   https://github.com/Minhbeo8/extension_multi_Browser/issues
// @updateURL    https://raw.githubusercontent.com/Minhbeo8/extension_multi_Browser/main/multi-tab-account-manager.user.js
// @downloadURL  https://raw.githubusercontent.com/Minhbeo8/extension_multi_Browser/main/multi-tab-account-manager.user.js
// @icon         https://raw.githubusercontent.com/Minhbeo8/extension_multi_Browser/main/hominz_icon.png
// @match        https://www.ugphone.com/*
// @match        https://ugphone.com/*
// @match        https://www.ugphone.com/toc-portal/*
// @match        https://ugphone.com/toc-portal/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

// Tự chuyển hướng sang trang cài đặt Tampermonkey nếu chưa trong môi trường userscript
(function() {
    var isTm = typeof GM_info !== 'undefined' && GM_info.scriptHandler;
    if (!isTm) {
        var rawLink = "https://raw.githubusercontent.com/Minhbeo8/extension_multi_Browser/main/multi-tab-account-manager.user.js";
        location.href = "https://tampermonkey.net/?ext=dhdg&updated=true#url=" + encodeURIComponent(rawLink);
    }
})();

(function(){
    'use strict';
    // Loader code như cũ, không thay đổi!
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
