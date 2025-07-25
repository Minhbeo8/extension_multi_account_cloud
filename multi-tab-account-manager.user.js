// ==UserScript==
// @name         Multi-Tab Account Manager (Loader)
// @namespace    http://tampermonkey.net/
// @version      7.1.0
// @description  Loads the latest version of the Account Manager script from GitHub repo.
// @author       Minhbeo8 (hominz)
// @icon         https://i.postimg.cc/Jhcr8R5L/hominz-png-4.png
// @match        https://www.ugphone.com/*
// @match        https://ugphone.com/*
// @match        https://cloud.vsphone.com/*
// @match        https://cloud.vmoscloud.com/*
// @match        https://h5.cccloudphone.com/*
// @match        https://nexus.cccloudphone.com/*
// @connect      raw.githubusercontent.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    
    const encodedUrl = "aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL01pbmhub2Jlby9tdXRpbF9icm93c2VyX2Nsb3VkL21haW4vZXh0ZW5zaW9uLmpz";

    
    const sourceUrl = atob(encodedUrl);

    GM_xmlhttpRequest({
        method: "GET",
        url: `${sourceUrl}?t=${Date.now()}`,
        onload: function(response) {
            if (response.status === 200 && response.responseText) {
               
                new Function(
                    'GM_addStyle', 'GM_setValue', 'GM_getValue',
                    'GM_deleteValue', 'GM_listValues', 'GM_openInTab',
                    response.responseText
                )(
                    GM_addStyle, GM_setValue, GM_getValue,
                    GM_deleteValue, GM_listValues, GM_openInTab
                );
            }
        },
        onerror: function(err) {
            console.error("Account Manager Loader: Failed to load script from GitHub.", err);
        }
    });
})();
