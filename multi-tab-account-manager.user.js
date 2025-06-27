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
    
    // URL đã được sửa để trỏ đến đúng file extension (không có .js)
    const sourceUrl = "https://raw.githubusercontent.com/Minhbeo8/extension_multi_Browser/refs/heads/main/extension";
    
    console.log("Đang tải mã nguồn từ:", sourceUrl);
    
    GM_xmlhttpRequest({
        method: "GET",
        url: sourceUrl,
        timeout: 10000, // Timeout 10 giây
        onload: function(response) {
            console.log("Response status:", response.status);
            console.log("Response headers:", response.responseHeaders);
            
            if (response.status === 200) {
                console.log("LOAD OK - Kích thước:", response.responseText.length, "ký tự");
                
                try {
                    // Kiểm tra xem có nội dung không
                    if (response.responseText.trim().length === 0) {
                        console.error("File rỗng hoặc không có nội dung");
                        alert("File mã nguồn rỗng!");
                        return;
                    }
                    
                    // Thực thi code
                    eval(response.responseText);
                    console.log("Mã nguồn đã được thực thi thành công");
                    
                } catch (error) {
                    console.error("Lỗi khi thực thi mã nguồn:", error);
                    alert("Lỗi khi chạy mã nguồn: " + error.message);
                }
                
            } else if (response.status === 404) {
                console.error("File không tồn tại (404)");
                alert("File mã nguồn không tồn tại!");
            } else {
                console.error("Lỗi HTTP:", response.status, response.statusText);
                alert("Không tải được mã nguồn. Mã lỗi: " + response.status);
            }
        },
        
        onerror: function(error) {
            console.error("Lỗi mạng:", error);
            alert("Có lỗi mạng khi tải mã nguồn!");
        },
        
        ontimeout: function() {
            console.error("Timeout khi tải mã nguồn");
            alert("Timeout - Mất quá nhiều thời gian để tải mã nguồn!");
        }
    });
})();
