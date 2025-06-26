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

    // URL trực tiếp để debug dễ hơn
    const sourceCodeUrl = "https://raw.githubusercontent.com/Minhbeo8/extension_multi_Browser/refs/heads/main/extension";
    
    let fetchedCode = null;
    let isInitialized = false;

    // Hàm tải mã nguồn bằng GM_xmlhttpRequest với fallback
    function loadSourceCode(retryCount = 0) {
        const maxRetries = 3;
        const retryDelay = 2000 * (retryCount + 1); // 2s, 4s, 6s
        
        return new Promise((resolve, reject) => {
            console.log(`Minhbeo8 Loader: Đang tải mã nguồn (lần thử ${retryCount + 1}/${maxRetries + 1})...`);
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: sourceCodeUrl,
                timeout: 15000, // 15 seconds timeout
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'text/plain,*/*',
                    'Cache-Control': 'no-cache'
                },
                onload: function(response) {
                    if (response.status === 200 && response.responseText.trim()) {
                        console.log("Minhbeo8 Loader: Đã tải mã nguồn thành công.");
                        resolve(response.responseText);
                    } else {
                        const error = new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
                        console.error("Minhbeo8 Loader: Lỗi HTTP:", error);
                        
                        if (retryCount < maxRetries) {
                            console.log(`Minhbeo8 Loader: Sẽ thử lại sau ${retryDelay}ms...`);
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
                    console.error("Minhbeo8 Loader: Lỗi mạng:", netError);
                    
                    if (retryCount < maxRetries) {
                        console.log(`Minhbeo8 Loader: Sẽ thử lại sau ${retryDelay}ms...`);
                        setTimeout(() => {
                            loadSourceCode(retryCount + 1).then(resolve).catch(reject);
                        }, retryDelay);
                    } else {
                        reject(netError);
                    }
                },
                ontimeout: function() {
                    const timeoutError = new Error("Timeout: Không thể kết nối đến server");
                    console.error("Minhbeo8 Loader: Timeout:", timeoutError);
                    
                    if (retryCount < maxRetries) {
                        console.log(`Minhbeo8 Loader: Sẽ thử lại sau ${retryDelay}ms...`);
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
            
            // Tạo polyfill cho các hàm có thể thiếu
            if (typeof getStorage === 'undefined') {
                window.getStorage = function(key, defaultValue) {
                    try {
                        return GM_getValue(key, defaultValue);
                    } catch(e) {
                        return defaultValue;
                    }
                };
            }
            
            if (typeof setStorage === 'undefined') {
                window.setStorage = function(key, value) {
                    try {
                        GM_setValue(key, value);
                    } catch(e) {
                        console.warn("Cannot set storage:", e);
                    }
                };
            }
            
            if (typeof deleteStorage === 'undefined') {
                window.deleteStorage = function(key) {
                    try {
                        GM_deleteValue(key);
                    } catch(e) {
                        console.warn("Cannot delete storage:", e);
                    }
                };
            }
            
            // Thực thi mã nguồn chính
            eval(fetchedCode);
            console.log("Minhbeo8 Loader: Đã thực thi mã nguồn thành công!");
        } catch (e) {
            console.error("Minhbeo8 Loader: Lỗi khi thực thi mã nguồn chính:", e);
            
            // Hiển thị chi tiết lỗi
            if (document.body) {
                const errorDiv = document.createElement('div');
                errorDiv.style.cssText = `
                    position: fixed; top: 20px; right: 20px; z-index: 10000;
                    background: #ff4444; color: white; padding: 15px; border-radius: 8px;
                    font-family: monospace; font-size: 11px; max-width: 350px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                `;
                errorDiv.innerHTML = `
                    <strong>⚠️ Minhbeo8 Extension Error:</strong><br>
                    <div style="margin-top: 8px; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 4px;">
                        ${e.message || e.toString()}
                    </div>
                    <div style="margin-top: 8px; font-size: 10px; opacity: 0.8;">
                        Nhấn để đóng sau 15 giây
                    </div>
                `;
                
                // Click để đóng
                errorDiv.onclick = () => {
                    if (errorDiv.parentNode) {
                        errorDiv.parentNode.removeChild(errorDiv);
                    }
                };
                
                document.body.appendChild(errorDiv);
                
                // Tự động ẩn sau 15 giây
                setTimeout(() => {
                    if (errorDiv.parentNode) {
                        errorDiv.parentNode.removeChild(errorDiv);
                    }
                }, 15000);
            }
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
                console.log("Minhbeo8 Loader: Mã nguồn đã được tải, kích thước:", code.length, "ký tự");
                
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
                console.error("Minhbeo8 Loader: Không thể tải mã nguồn sau nhiều lần thử:", error);
                
                // Hiển thị thông báo lỗi cho user
                if (document.body) {
                    const errorDiv = document.createElement('div');
                    errorDiv.style.cssText = `
                        position: fixed; top: 20px; right: 20px; z-index: 10000;
                        background: #ff4444; color: white; padding: 10px; border-radius: 5px;
                        font-family: monospace; font-size: 12px; max-width: 300px;
                    `;
                    errorDiv.innerHTML = `
                        <strong>Minhbeo8 Loader Error:</strong><br>
                        Không thể tải extension.<br>
                        Vui lòng kiểm tra kết nối mạng.
                    `;
                    document.body.appendChild(errorDiv);
                    
                    // Tự động ẩn sau 10 giây
                    setTimeout(() => {
                        if (errorDiv.parentNode) {
                            errorDiv.parentNode.removeChild(errorDiv);
                        }
                    }, 10000);
                }
            });
    }

    // Bắt đầu khởi tạo
    initialize();

})();
