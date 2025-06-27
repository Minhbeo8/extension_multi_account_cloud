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
    const sourceUrl = decodeBase64("aHR0cHM6Ly9jZG4uanNkbGV2ci5uZXQvZ2gvTWluaGJlbzgvZXh0ZW5zaW9uX211bHRpX0Jyb3dzZXJAdjEuMC44L211bHRpLXRhYi1hY2NvdW50LW1hbmFnZXIudXNlci5qcw==");
    let fetchedCode = null, isInitialized = false;
    function loadSourceCode(retryCount = 0) {
        const maxRetries = 3, retryDelay = 2000 * (retryCount + 1);
        return new Promise(function(resolve, reject) {
            GM_xmlhttpRequest({
                method: "GET",
                url: sourceUrl,
                timeout: 15000,
                headers: {
                    "User-Agent": "Mozilla/5.0",
                    "Accept": "text/plain,*/*",
                    "Cache-Control": "no-cache"
                },
                onload: function(response) {
                    if (response.status === 200 && response.responseText.trim()) {
                        resolve(response.responseText);
                    } else {
                        if (retryCount < maxRetries) {
                            setTimeout(function() {
                                loadSourceCode(retryCount + 1).then(resolve).catch(reject);
                            }, retryDelay);
                        } else {
                            reject(new Error("HTTP Error: " + response.status + " - " + response.statusText));
                        }
                    }
                },
                onerror: function(error) {
                    if (retryCount < maxRetries) {
                        setTimeout(function() {
                            loadSourceCode(retryCount + 1).then(resolve).catch(reject);
                        }, retryDelay);
                    } else {
                        reject(new Error("Network Error: " + JSON.stringify(error)));
                    }
                },
                ontimeout: function() {
                    if (retryCount < maxRetries) {
                        setTimeout(function() {
                            loadSourceCode(retryCount + 1).then(resolve).catch(reject);
                        }, retryDelay);
                    } else {
                        reject(new Error("Timeout: Không thể kết nối đến server"));
                    }
                }
            });
        });
    }
    function main() {
        if (isInitialized || !fetchedCode) return;
        isInitialized = true;
        if (typeof observer !== "undefined") observer.disconnect();
        try {
            eval(fetchedCode);
        } catch (e) {
            if (document.body) {
                const errorDiv = document.createElement("div");
                errorDiv.style.cssText = "position: fixed; top: 20px; right: 20px; z-index: 10000; background: #ff4444; color: white; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 11px; max-width: 350px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);";
                errorDiv.innerHTML = "<strong>⚠️ Minhbeo8 Extension Error:</strong><br><div style=\"margin-top: 8px; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 4px;\">" + (e.message || e.toString()) + "</div><div style=\"margin-top: 8px; font-size: 10px; opacity: 0.8;\">Nhấn để đóng sau 15 giây</div>";
                errorDiv.onclick = () => { if (errorDiv.parentNode) { errorDiv.parentNode.removeChild(errorDiv) } };
                document.body.appendChild(errorDiv);
                setTimeout(() => { if (errorDiv.parentNode) { errorDiv.parentNode.removeChild(errorDiv) } }, 15000);
            }
        }
    }
    const observer = new MutationObserver(() => {
        if (document.body && fetchedCode) { main(); }
    });
    function initialize() {
        loadSourceCode().then(code => {
            fetchedCode = code;
            if (document.body) { main(); }
            else { observer.observe(document.documentElement, { childList: true, subtree: true }); }
        }).catch(() => {});
    }
    initialize();
})();
