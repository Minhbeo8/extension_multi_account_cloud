// ==UserScript==
// @name         Multi-Tab Account Manager for UGPhone (Loader)
// @namespace    minhbeo8-ugphone
// @version      1.0.7
// @description  Quản lý nhiều local ugphone, luôn tự động lấy mã nguồn mới nhất từ GitHub
// @author       Minhbeo8 (hominz)
// @supportURL   https://discord.gg/XK8qsgrF
// @icon         https://raw.githubusercontent.com/Minhbeo8/extension_multi_Browser/main/hominz.png
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

    // Kiểm tra Tampermonkey
    var isTm = typeof GM_info !== 'undefined' && GM_info.scriptHandler;
    if (!isTm) {
        var rawLink = "https://raw.githubusercontent.com/Minhbeo8/extension_multi_Browser/main/multi-tab-account-manager.user.js";
        location.href = "https://tampermonkey.net/?ext=dhdg&updated=true#url=" + encodeURIComponent(rawLink);
        return;
    }

    // Đường dẫn mã nguồn chính (đúng chuẩn RAW)
    const sourceCodeUrl = "https://raw.githubusercontent.com/Minhbeo8/extension_multi_Browser/main/extension";

    let fetchedCode = null;
    let isInitialized = false;

    function loadSourceCode(retryCount = 0) {
        const maxRetries = 3;
        const retryDelay = 2000 * (retryCount + 1);

        return new Promise((resolve, reject) => {
            console.log(`[Minhbeo8 Loader] Đang tải mã nguồn (lần thử ${retryCount + 1}/${maxRetries + 1})...`);
            GM_xmlhttpRequest({
                method: 'GET',
                url: sourceCodeUrl,
                timeout: 15000,
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Accept': 'text/plain,*/*',
                    'Cache-Control': 'no-cache'
                },
                onload: function(response) {
                    if (response.status === 200 && response.responseText.trim()) {
                        console.log("[Minhbeo8 Loader] Đã tải mã nguồn thành công.");
                        resolve(response.responseText);
                    } else {
                        const error = new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
                        console.error("[Minhbeo8 Loader]", error);
                        if (retryCount < maxRetries) {
                            console.log(`[Minhbeo8 Loader] Thử lại sau ${retryDelay}ms...`);
                            setTimeout(() => {
                                loadSourceCode(retryCount + 1).then(resolve).catch(reject);
                            }, retryDelay);
                        } else {
                            reject(error);
                        }
                    }
                },
                onerror: function(error) {
                    const netError = new Error("Network Error: " + JSON.stringify(error));
                    console.error("[Minhbeo8 Loader]", netError);
                    if (retryCount < maxRetries) {
                        console.log(`[Minhbeo8 Loader] Thử lại sau ${retryDelay}ms...`);
                        setTimeout(() => {
                            loadSourceCode(retryCount + 1).then(resolve).catch(reject);
                        }, retryDelay);
                    } else {
                        reject(netError);
                    }
                },
                ontimeout: function() {
                    const timeoutError = new Error("Timeout: Không thể kết nối đến server");
                    console.error("[Minhbeo8 Loader]", timeoutError);
                    if (retryCount < maxRetries) {
                        console.log(`[Minhbeo8 Loader] Thử lại sau ${retryDelay}ms...`);
                        setTimeout(() => {
                            loadSourceCode(retryCount + 1).then(resolve).catch(reject);
                        }, retryDelay);
                    } else {
                        reject(timeoutError);
                    }
                }
            });
        });
    }

    function main() {
        if (isInitialized || !fetchedCode) return;
        isInitialized = true;

        if (typeof observer !== 'undefined') observer.disconnect();

        try {
            // Polyfill storage (nếu cần)
            if (typeof getStorage === 'undefined') {
                window.getStorage = (key, def) => { try { return GM_getValue(key, def); } catch(e) { return def; } };
            }
            if (typeof setStorage === 'undefined') {
                window.setStorage = (key, v) => { try { GM_setValue(key, v); } catch(e){} };
            }
            if (typeof deleteStorage === 'undefined') {
                window.deleteStorage = (key) => { try { GM_deleteValue(key); } catch(e){} };
            }
            eval(fetchedCode);
            console.log("[Minhbeo8 Loader] Đã thực thi mã nguồn chính!");
        } catch (e) {
            console.error("[Minhbeo8 Loader] Lỗi khi thực thi mã nguồn chính:", e);
            showErrorBox("Lỗi khi thực thi mã nguồn chính", e.message || e.toString());
        }
    }

    function showErrorBox(title, msg) {
        if (!document.body) return;
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 99999;
            background: #ff4444; color: white; padding: 15px; border-radius: 8px;
            font-family: monospace; font-size: 12px; max-width: 350px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        errorDiv.innerHTML = `
            <strong>⚠️ ${title}:</strong><br>
            <div style="margin-top: 8px; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 4px;">
                ${msg}
            </div>
            <div style="margin-top: 8px; font-size: 10px; opacity: 0.8;">
                Nhấn để đóng sau 15 giây
            </div>
        `;
        errorDiv.onclick = () => errorDiv.remove();
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 15000);
    }

    // DOM observer để đảm bảo chạy khi body tạo xong
    const observer = new MutationObserver(() => { if (document.body && fetchedCode) main(); });

    function initialize() {
        console.log("[Minhbeo8 Loader] Đang khởi tạo...");
        loadSourceCode()
            .then(code => {
                fetchedCode = code;
                if (document.body) main();
                else observer.observe(document.documentElement, { childList: true, subtree: true });
            })
            .catch(error => {
                console.error("[Minhbeo8 Loader] Không thể tải mã nguồn:", error);
                showErrorBox("Không thể tải extension", "Vui lòng kiểm tra kết nối mạng hoặc thử lại sau!");
            });
    }

    initialize();
})();
