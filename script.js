// ==UserScript==
// @name         Multi-Tab Account Manager for UGPhone (Loader)
// @namespace    minhbeo8-ugphone
// @version      1.0.1
// @description  Quản lý nhiều local ugphone 
// @author       Minhbeo8(hominz) 
// @supportURL   https://discord.gg/XK8qsgrF
// @icon         https://i.postimg.cc/Jhcr8R5L/hominz-png-4.png
// @match        *://*.ugphone.com/toc-portal/*
// @match        *://*.cloudemulator.net/*
// @match        *://*.cccloudphone.com/*
// @match        *://*.vmoscloud.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @run-at       document-start
// ==/UserScript==


(function() {
    'use strict';
    
    
    const encodedUrl = "https://raw.githubusercontent.com/Minhbeo8/extension_multi_Browser/refs/heads/main/script.js";
    
  
    const sourceUrl = atob(encodedUrl);
    
    GM_xmlhttpRequest({
        method: "GET",
        url: sourceUrl,
        timeout: 10000,
        onload: function(response) {
            if (response.status === 200 && response.responseText.trim().length > 0) {
                eval(response.responseText);
            }
        },
        onerror: function() {},
        ontimeout: function() {}
    });
})();
