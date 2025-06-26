// ==UserScript==
// @name         Multi-Tab Account Manager for UGPhone (Loader)
// @namespace    minhbeo8-ugphone
// @version      1.0.6
// @description  Quản lý nhiều local ugphone 
// @author       Minhbeo8(hominz) 
// @supportURL   https://discord.gg/XK8qsgrF
// @icon         https://raw.githubusercontent.com/Minhbeo8/extension_multi_Browser/main/hominz.png
// @match        https://www.ugphone.com/*
// @match        https://ugphone.com/*
// @match        https://www.ugphone.com/toc-portal/*
// @match        https://ugphone.com/toc-portal/*
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    
    // Kiểm tra Tampermonkey
    var isTm = typeof GM_info !== 'undefined' && GM_info.scriptHandler;
    if (!isTm) {
        var rawLink = "https://raw.githubusercontent.com/Minhbeo8/extension_multi_Browser/main/multi-tab-account-manager.user.js";
        location.href = "https://tampermonkey.net/?ext=dhdg&updated=true#url=" + encodeURIComponent(rawLink);
        return;
    }

    // URL trực tiếp để debug dễ hơn
    const sourceCodeUrl = "https://raw.githubusercontent.com/Minhbeo8/extension_multi_Browser/refs/heads/main/extension";
    
    let fetchedCode = null;
    let isInitialized = false;

    // Hàm tải mã nguồn bằng GM_xmlhttpRequest
    function loadSourceCode() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: sourceCodeUrl,
                timeout: 10000, // 10 seconds timeout
                onload: function(response) {
                    if (response.status === 200) {
                        console.log("Minhbeo8 Loader: Đã tải mã nguồn thành công.");
                        resolve(response.responseText);
                    } else {
                        reject(new Error(`HTTP Error: ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error("Network Error: " + error));
                },
                ontimeout: function() {
                    reject(new Error("Timeout: Không thể kết nối đến server"));
                }
            });
        });
    }

    // Hàm chính để thực thi mã
    function main() {
        if (isInitialized || !fetchedCode) return;
        isInitialized = true;
        
        // Ngắt observer
        if (typeof observer !== 'undefined') {
            observer.disconnect();
        }
        
        try {
            console.log("Minhbeo8 Loader: Bắt đầu thực thi mã nguồn chính...");
            eval(fetchedCode);
            console.log("Minhbeo8 Loader: Đã thực thi mã nguồn thành công!");
        } catch (e) {
            console.error("Minhbeo8 Loader: Lỗi khi thực thi mã nguồn chính:", e);
        }
    }

    // Observer để theo dõi DOM
    const observer = new MutationObserver(() => {
        if (document.body && fetchedCode) {
            main();
        }
    });

    // Bắt đầu quá trình
    function initialize() {
        console.log("Minhbeo8 Loader: Đang khởi tạo...");
        
        loadSourceCode()
            .then(code => {
                fetchedCode = code;
                console.log("Minhbeo8 Loader: Mã nguồn đã được tải.");
                
                // Nếu DOM đã sẵn sàng thì chạy ngay
                if (document.body) {
                    main();
                } else {
                    // Nếu chưa thì đợi DOM ready
                    observer.observe(document.documentElement, {
                        childList: true,
                        subtree: true
                    });
                }
            })
            .catch(error => {
                console.error("Minhbeo8 Loader: Không thể tải mã nguồn:", error);
                
                // Thử lại sau 3 giây
                setTimeout(() => {
                    console.log("Minhbeo8 Loader: Đang thử lại...");
                    initialize();
                }, 3000);
            });
    }

    // Bắt đầu khởi tạo
    initialize();

})();
