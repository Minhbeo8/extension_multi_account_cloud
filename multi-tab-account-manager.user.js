// ==UserScript==
// @name         Test Loader Raw
// @namespace    minhbeo8-ugphone
// @version      1.0.1
// @description  Test tải code raw trực tiếp
// @match        https://www.ugphone.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

(function() {
    const sourceUrl = "https://raw.githubusercontent.com/Minhbeo8/extension_multi_Browser/refs/heads/main/extension.js";
    GM_xmlhttpRequest({
        method: "GET",
        url: sourceUrl,
        onload: function(response) {
            if (response.status === 200) {
                console.log("LOAD OK:", response.responseText.length);
                eval(response.responseText);
            } else {
                alert("Không tải được mã nguồn chính: " + response.status);
            }
        },
        onerror: function(e) {
            alert("Có lỗi khi tải mã nguồn chính! " + JSON.stringify(e));
        }
    });
})();
