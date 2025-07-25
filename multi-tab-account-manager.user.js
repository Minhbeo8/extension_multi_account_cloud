// ==UserScript==
// @name         Multi-Tab Account Manager (Loader)
// @namespace    http://tampermonkey.net/
// @version      7.0.0
// @description  Loads the latest version of the Account Manager script.
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

    // Chuỗi Base64 chứa URL của Gist
    const encodedUrl = "aHR0cHM6Ly9naXN0LmdpdGh1YnVzZXJjb250ZW50LmNvbS9NaW5oYmVvOC9lYWY1MDlmMDUzZDc1NWQ3Mzk5NDZjYjcwZDcwYTNmZC9yYXcvMWNhNTJkZjk0ZTk4OWVmNjgwZWNkZjg3NzZhODBmNGY2YjQyZmE0L011bHRJVGFiQWNjb3VudE1hbmFnZXIuanM=";

    // Giải mã URL tại thời điểm chạy
    const sourceUrl = atob(encodedUrl);

    GM_xmlhttpRequest({
        method: "GET",
        url: `${sourceUrl}?t=${Date.now()}`, // Thêm timestamp để đảm bảo luôn tải bản mới
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
            console.error("Account Manager Loader: Failed to load script.", err);
        }
    });
})();
