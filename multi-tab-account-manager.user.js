// ==UserScript==
// @name         Multi-Tab Account Manager (Minimal Loader)
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @author       Minhbeo8 (hominz)
// @icon         https://i.postimg.cc/Jhcr8R5L/hominz-png-4.png
// @match        https://www.ugphone.com/*
// @match        https://ugphone.com/*
// @match        https://cloud.vsphone.com/*
// @match        https://cloud.vmoscloud.com/*
// @match        https://h5.cccloudphone.com/*
// @match        https://nexus.cccloudphone.com/*
// @connect      gist.githubusercontent.com
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

    const sourceUrl = 'https://gist.githubusercontent.com/Minhbeo8/eaf509f053d755d739946cb70d70a3fd/raw/MultiTabAccountManager.js';

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
        }
    });
})();
