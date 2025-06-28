// ==UserScript==
// @name         Loader - Multi-Account Extension Auto-Installer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Loader script: Tự động chuyển sang file chính trên GitHub để cài đặt/cập nhật extension quản lý đa tài khoản
// @author       Minhbeo8
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // Link .user.js gốc trên raw.githubusercontent (bạn đổi link này nếu đổi tên file hoặc branch!)
    var url = 'https://raw.githubusercontent.com/Minhbeo8/extension_multi_Browser/refs/heads/main/demo';

    // Nếu chưa phải link raw .user.js thì chuyển tiếp cài đặt
    if (!location.href.startsWith(url)) {
        window.location.href = url;
    }
})();
