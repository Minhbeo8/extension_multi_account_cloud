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

    function decodeBase64(encodedString) {
        try {
            return atob(encodedString);
        } catch (e) {
            console.error("[Minhbeo8 Loader] Lỗi khi giải mã Base64:", e);
            return "";
        }
    }

    const encodedSourceCodeUrl = "aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL01pbmhiZW84L2V4dGVuc2lvbl9tdWx0aV9Ccm93c2VyL21haW4vZXh0ZW5zaW9u";
    const sourceCodeUrl = decodeBase64(encodedSourceCodeUrl);

    let fetchedCode = null;
    let isInitialized = false;

    var isTm = typeof GM_info !== 'undefined' && GM_info.scriptHandler;
    if (!isTm) {
        const encodedRawLinkTm = "aHR0cHM6Ly90YW1wZXJtb25rZXkubmV0P2V4dD1kaGRnJnVwZGF0ZWQ9dHJ1ZSN1cmw9aHR0cHMlM0ElMkYlMkZyYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tJTJGTWluaGJlbyU4JTJGMGV4dGVuc2lvbl9tdWx0aV9Ccm93c2VyJTJGbWFpbiUyRm11bHRpLXRhYi1hY2NvdW50LW1hbmFnZXIudXNlci5qcw==";
        const rawLinkTm = decodeBase64(encodedRawLinkTm);
        location.href = rawLinkTm;
        return;
    }

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

    function executeScript() {
        if (isInitialized || !fetchedCode) return;
        isInitialized = true;

        try {
            eval(fetchedCode);
            console.log("[Minhbeo8 Loader] Đã thực thi mã nguồn chính!");
        } catch (e) {
            console.error("[Minhbeo8 Loader] Lỗi khi thực thi mã nguồn chính:", e);
        }
    }

    function initialize() {
        console.log("[Minhbeo8 Loader] Đang khởi tạo...");
        loadSourceCode()
            .then(code => {
                fetchedCode = code;
                if (document.body) {
                    executeScript();
                } else {
                    const checkBodyInterval = setInterval(() => {
                        if (document.body) {
                            clearInterval(checkBodyInterval);
                            executeScript();
                        }
                    }, 50);
                }
            })
            .catch(error => {
                console.error("[Minhbeo8 Loader] Không thể tải mã nguồn:", error);
            });
    }

    initialize();
})();
