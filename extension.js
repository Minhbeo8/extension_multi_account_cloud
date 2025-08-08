// ==UserScript==
// @name         Multi-Tab Account Manager (UX & Feature Update)
// @namespace    http://tampermonkey.net/
// @version      7.6.0
// @description  thêm vài thứ
// @author       Minhbeo8(hominz)
// @match        https://www.ugphone.com/*
// @match        https://ugphone.com/*
// @match        https://cloud.vsphone.com/*
// @match        https://cloud.vmoscloud.com/*
// @match        https://h5.cccloudphone.com/*
// @match        https://nexus.cccloudphone.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @grant        GM_openInTab
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const PerformanceUtils = {
        debounce(func, wait) { let timeout; return function executedFunction(...args) { const later = () => { clearTimeout(timeout); func(...args); }; clearTimeout(timeout); timeout = setTimeout(later, wait); }; },
        throttle(func, limit) { let inThrottle; return function() { const args = arguments; const context = this; if (!inThrottle) { func.apply(context, args); inThrottle = true; setTimeout(() => inThrottle = false, limit); } } },
    };

    const PERFORMANCE_CONFIG = {
        UPDATE_INTERVAL: 15000,
        CLEANUP_INTERVAL: 60000,
        STORAGE_WRITE_DELAY: 1500,
        SEARCH_DEBOUNCE: 250,
    };

    const GUI = {
        css: `
            :root { /* Dark Theme (Default) */
                --panel-bg: rgba(28, 28, 30, 0.85); --panel-border: rgba(255, 255, 255, 0.15); --item-bg: rgba(255, 255, 255, 0.05); --item-border: rgba(255, 255, 255, 0.1); --item-hover-bg: rgba(255, 255, 255, 0.1); --text-color: #f0f0f0; --text-secondary: rgba(240, 240, 240, 0.65); --primary-color: #3b82f6; --danger-color: #ef4444; --warning-color: #f59e0b; --warning-color-rgb: 245, 158, 11; --item-hover-border: var(--primary-color); --toggle-btn-bg: var(--primary-color); --panel-gradient-1: hsla(217, 91%, 60%, 0.1); --panel-gradient-2: hsla(217, 91%, 60%, 0.05); --ripple-color: rgba(255, 255, 255, 0.6); --favorite-color: #FFD700;
            }
            body.theme-nordic-light {
                --panel-bg: rgba(236, 239, 244, 0.85); --panel-border: rgba(216, 222, 233, 0.7); --item-bg: rgba(229, 233, 240, 0.9); --item-border: rgba(216, 222, 233, 0.5); --item-hover-bg: rgba(216, 222, 233, 1); --text-color: #2E3440; --text-secondary: #4C566A; --primary-color: #5E81AC; --danger-color: #BF616A; --warning-color: #EBCB8B; --warning-color-rgb: 235, 203, 139; --item-hover-border: var(--primary-color); --toggle-btn-bg: var(--primary-color); --panel-gradient-1: hsla(215, 33%, 65%, 0.1); --panel-gradient-2: hsla(215, 33%, 65%, 0.05); --ripple-color: rgba(0, 0, 0, 0.2); --favorite-color: #D08770;
            }
            #tabManagerOverlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 2147483646; backdrop-filter: blur(2px); opacity: 0; transition: opacity 0.3s; }
            #tabManager { position: fixed; top: 20px; right: 20px; background-color: var(--panel-bg); background-image: radial-gradient(at 2% 4%, var(--panel-gradient-1) 0px, transparent 50%), radial-gradient(at 98% 94%, var(--panel-gradient-2) 0px, transparent 50%); backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%); color: var(--text-color); padding: 20px; border-radius: 18px; border: 1px solid var(--panel-border); box-shadow: 0 8px 32px rgba(0,0,0,0.37); z-index: 2147483647; font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 14px; min-width: 350px; max-width: 95vw; max-height: 90vh; overflow-y: auto; transform: scale(0.95) translateZ(0); opacity: 0; visibility: hidden; transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease-out, background-color 0.3s, border-color 0.3s; will-change: transform, opacity; contain: layout style paint; }
            #tabManager.visible { visibility: visible; transform: scale(1) translateZ(0); opacity: 1; }
            #toggleBtn { background: var(--toggle-btn-bg); position: fixed; color: white; border: none; width: 56px; height: 56px; border-radius: 50%; z-index: 2147483647; font-size: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); user-select: none; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: grab; touch-action: none; display: flex !important; align-items: center; justify-content: center; will-change: transform; transform: translateZ(0); }
            #toggleBtn:hover { transform: scale(1.1) rotate(10deg); box-shadow: 0 6px 25px rgba(0,0,0,0.4); }
            .close-btn { position: absolute; top: 5px; right: 8px; font-size: 28px; font-weight: 300; color: var(--text-secondary); background: none; border: none; cursor: pointer; padding: 5px; line-height: 1; transition: all 0.2s; -webkit-tap-highlight-color: transparent; }
            .close-btn:hover { color: var(--text-color); transform: scale(1.2) rotate(90deg); }
            .important-note { background: rgba(var(--warning-color-rgb), 0.15); border-left: 3px solid var(--warning-color); padding: 12px; margin-bottom: 15px; border-radius: 8px; font-size: 13px; line-height: 1.5; color: var(--text-color); }
            .action-group, .account-selector { background: var(--item-bg); border-radius: 12px; padding: 15px; margin-bottom: 15px; border: 1px solid var(--item-border); transition: background-color 0.3s, border-color 0.3s; }
            .action-group h3, .account-selector h3 { margin-top: 0; margin-bottom: 15px; font-size: 15px; text-align: center; border-bottom: 1px solid var(--item-border); padding-bottom: 10px; font-weight: 500; }
            .account-item { background: var(--item-bg); border-radius: 10px; padding: 12px 15px; margin: 8px 0; cursor: pointer; transition: all .25s ease; border: 1px solid var(--item-border); border-left: 3px solid transparent; display:flex; justify-content:space-between; align-items:center; will-change: transform, background-color, border-left-color; }
            .account-item:hover { background: var(--item-hover-bg); border-left-color: var(--item-hover-border); transform: translateX(5px); }
            .account-item-details { display: flex; flex-direction: column; flex-grow: 1; margin: 0 10px; }
            .account-item-name { display:flex; align-items:center; font-weight: bold; }
            .account-item-subtext { font-size: 11px; opacity: 0.8; margin-top: 4px; }
            .account-item-note { font-size: 12px; font-style: italic; color: var(--text-secondary); margin-top: 5px; padding-top: 5px; border-top: 1px dashed rgba(128,128,128,0.2); }
            .account-item-actions { display: flex; align-items: center; gap: 8px; }
            .account-icon-btn { cursor:pointer; opacity:0.5; transition: all 0.2s; font-size: 16px; }
            .account-icon-btn:hover { opacity: 1; transform: scale(1.2); }
            .favorite-btn.favorited { color: var(--favorite-color); opacity: 1; }
            .account-item.active { background: rgba(76, 175, 80, 0.2) !important; border-left-color: #4CAF50; }
            .btn { background: var(--item-bg); color: var(--text-color); border: 1px solid var(--item-border); padding: 10px 15px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all .2s ease; width: 100%; box-sizing: border-box; }
            .btn:hover { background: var(--item-hover-bg); border-color: var(--primary-color); transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
            .btn:active { transform: translateY(0); box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
            .btn.btn-primary { background-color: var(--primary-color); border-color: var(--primary-color); color: white; }
            .btn.btn-danger { background-color: var(--danger-color); border-color: var(--danger-color); color: white; }
            .btn.btn-warning { background-color: var(--warning-color); border-color: var(--warning-color); color: #2E3440; }
            #saveAccountInput, #searchAccountInput { background: rgba(0,0,0,0.2); border: 1px solid var(--item-border); border-radius: 8px; padding: 10px; color: var(--text-color); width: 100%; box-sizing: border-box; margin-bottom: 10px; transition: background-color 0.3s, border-color 0.3s; }
            body.theme-nordic-light #saveAccountInput, body.theme-nordic-light #searchAccountInput { background: #fff; }
            #saveAccountInput:disabled { background: rgba(0,0,0,0.1); cursor: not-allowed; }
            body.theme-nordic-light #saveAccountInput:disabled { background: rgba(0,0,0,0.05); }
            .button-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .btn, .account-item, .close-btn { position: relative; overflow: hidden; -webkit-tap-highlight-color: transparent; }
            .ripple { position: absolute; border-radius: 50%; background: var(--ripple-color); transform: scale(0); animation: ripple-effect 0.6s linear; pointer-events: none; }
            @keyframes ripple-effect { to { transform: scale(4); opacity: 0; } }
            #customModalOverlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 2147483648; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; pointer-events: none; }
            #customModalOverlay.visible { opacity: 1; pointer-events: all; }
            #customModal { background: var(--panel-bg); backdrop-filter: blur(10px); padding: 25px; border-radius: 12px; width: 90%; max-width: 380px; border: 1px solid var(--panel-border); transform: scale(0.95); transition: transform 0.2s, background-color 0.3s, border-color 0.3s; box-shadow: 0 10px 40px rgba(0,0,0,0.4); }
            #customModalOverlay.visible #customModal { transform: scale(1); }
            #customModal-title { font-size: 18px; font-weight: 500; margin: 0 0 10px 0; text-align: center; color: var(--text-color); }
            #customModal-message { font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin: 0 0 20px 0; text-align: center; }
            #customModal-input { width: 100%; background: var(--item-bg); border: 1px solid var(--item-border); border-radius: 8px; padding: 12px; color: var(--text-color); box-sizing: border-box; margin-bottom: 20px; }
            #customModal-buttons { display: flex; gap: 10px; justify-content: flex-end; }
            #exportModalOverlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 2147483648; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; pointer-events: none; }
            #exportModalOverlay.visible { opacity: 1; pointer-events: all; }
            #exportModal { background: var(--panel-bg); backdrop-filter: blur(10px); padding: 20px; border-radius: 12px; width: 90%; max-width: 400px; border: 1px solid var(--panel-border); transform: scale(0.95); transition: transform 0.2s, background-color 0.3s, border-color 0.3s; }
            #exportModalOverlay.visible #exportModal { transform: scale(1); }
            #exportModal h3 { margin-top: 0; text-align: center; font-weight: 500; color: var(--text-color); }
            #exportDataArea { width: 100%; height: 150px; background: var(--item-bg); border: 1px solid var(--item-border); border-radius: 8px; color: var(--text-color); padding: 10px; font-family: monospace; resize: vertical; margin: 15px 0; box-sizing: border-box; }
            #themeSwitchBtn { position: absolute; bottom: 15px; left: 20px; background: none; border: none; font-size: 22px; cursor: pointer; color: var(--text-color); opacity: 0.6; transition: all 0.2s; padding: 5px; }
            #themeSwitchBtn:hover { opacity: 1; transform: scale(1.2) rotate(15deg); }
        `,
        getHTML: function(data) { const { statusHTML, getText } = data; return ` <button class="close-btn" id="closeManagerBtn" title="Close">×</button> <h2>🗂️ ${getText('managerTitle')}</h2> <div class="important-note">${getText('importantNote')}</div> <div class="action-group"> <h3>${getText('currentTabTitle')}</h3> <div style="margin-bottom: 15px; text-align: center; font-size: 14px;">${statusHTML}</div> <input type="text" id="saveAccountInput" placeholder="${getText('newAccountNamePlaceholder')}"> <button class="btn btn-primary" id="saveAccountBtn">${getText('saveBtn')}</button> </div> <div class="account-selector"> <h3>${getText('selectAccountTitle')}</h3> <input type="text" id="searchAccountInput" placeholder="${getText('searchPlaceholder')}"> <div id="accountList"></div> <button class="btn btn-danger" id="clearAllAccountsBtn" style="margin-top: 15px;">${getText('deleteAllBtn')}</button> </div> <div class="action-group"> <h3>${getText('tabActions')}</h3> <div class="button-grid"> <button class="btn" id="openCleanTabBtn">${getText('openCleanTabBtn')}</button> <button class="btn" id="openTabWithAccountBtn">${getText('openWithAccountBtn')}</button> </div> </div> <div class="action-group"> <h3>${getText('dataManagement')}</h3> <div class="button-grid"> <button class="btn" id="exportBtn">${getText('exportBtn')}</button> <button class="btn" id="importBtn">${getText('importBtn')}</button> </div> <button class="btn btn-warning" id="clearTabBtn" style="margin-top: 10px;">${getText('resetTabBtn')}</button> </div> <div style="text-align:center;font-size:10px;opacity:0.7;margin-top:12px; padding-bottom: 20px;"> <a href="https://discord.gg/GJdRjPqH" target="_blank" style="color:var(--text-secondary);text-decoration:none;opacity:0.85;">${getText('madeBy')}</a> </div> <button id="themeSwitchBtn" title="Switch Theme">☀️</button> `; },
        getExportModalHTML: function(data) { const { jsonString, getText } = data; return ` <div id="exportModal"> <h3>${getText('exportModalTitle')}</h3> <textarea id="exportDataArea" readonly>${jsonString}</textarea> <div class="button-grid"> <button id="copyBtn" class="btn btn-primary">${getText('copyToClipboardBtn')}</button> <button id="downloadBtn" class="btn">${getText('downloadFileBtn')}</button> </div> </div> `; }
    };

    const SCRIPT_NAME = 'Multi-Tab Account Manager';
    const LOGIN_PATHS = { 'www.ugphone.com': '/toc-portal/#/login', 'ugphone.com': '/toc-portal/#/login', 'cloud.vmoscloud.com': '/#/', 'h5.cccloudphone.com': '/minified:xc', 'nexus.cccloudphone.com': '/minified:xc' };
    const HOSTNAME_SESSION_KEYS = { 'cloud.vsphone.com': ['token', 'userId', 'uuid', 'RTC_DEVICE_ID'], 'cloud.vmoscloud.com': ['token', 'userId', 'uuid', 'RTC_DEVICE_ID'], 'www.ugphone.com': ['ugBrowserId', 'UGPHONE-ID', 'UGPHONE-Token', 'UGPHONE-MQTT', 'hadAgreePolicy'], 'ugphone.com': ['ugBrowserId', 'UGPHONE-ID', 'UGPHONE-Token', 'UGPHONE-MQTT', 'hadAgreePolicy'], 'h5.cccloudphone.com': ['token', 'userInfo'] };
    const TRANSLATIONS = {
        en: { managerTitle: "Account Manager", dragHint: "Drag to move, click to open", importantNote: "<b>Note:</b> Remember to <u>save the current account</u> before opening or switching to a new tab. Otherwise, all login data might be lost.", currentTabTitle: "Current Session", resetTabBtn: "Reset Tab", selectAccountTitle: "Saved Accounts", noAccounts: "No accounts found. Save your first one!", savedAt: "Saved:", inUse: "Active", deleteBtn: "Delete", deleteAllBtn: "Delete All Accounts", madeBy: "Made by Minhbeo8", alertAccountSaved: 'Account "%s" saved!', alertAccountSwitched: 'Switched to "%s". Reloading...', confirmResetTab: "Reset current tab? All local data will be wiped.", alertTabReset: "Tab has been reset! Reloading...", confirmDeleteAccount: 'Delete account "%s"?', alertAccountDeleted: '"%s" has been deleted.', confirmDeleteAll: "Delete ALL saved accounts for this site?", alertAllDeleted: "All accounts deleted.", newAccountNamePlaceholder: "Enter new account name...", saveBtn: "Save", currentStatus: "Using account: <strong>%s</strong>", currentStatusNone: "Status: <strong>Not Selected</strong> (%s)", tabTypeRegular: "Regular", tabTypeClean: "Clean", tabActions: "Tab Actions", openCleanTabBtn: "Open Clean Tab", openWithAccountBtn: "Open with Account", dataManagement: "Advanced Data", exportBtn: "Export Session", importBtn: "Import Session", promptImport: "Paste your session data here. This will apply the session and reload the page.", confirmImport: "This will apply the session data and reload the page. Continue?", alertImportSuccess: "Session imported! Reloading...", alertImportError: "Import failed. Invalid data format.", alertExportNothing: "Current session is empty. Log in first to export.", exportModalTitle: "Export Session Data", copyToClipboardBtn: "Copy to Clipboard", downloadFileBtn: "Download as File", copiedFeedback: "Copied!", searchPlaceholder: "Search accounts...", updateBtn: "Update", alertAccountUpdated: 'Account "%s" updated!', promptRename: 'Enter a new name for "%s":', titleRename: "Rename Account", alertRenameSuccess: "Rename successful!", favoriteBtnTitle: "Mark as favorite", unfavoriteBtnTitle: "Remove from favorites", notesBtnTitle: "Edit note", promptNotes: 'Enter notes for "%s":', titleNotes: "Account Note" },
        vi: { managerTitle: "Quản lý tài khoản", dragHint: "Kéo để di chuyển, nhấn để mở", importantNote: "<b>Lưu ý:</b> Hãy nhớ <u>lưu tài khoản hiện tại</u> lại trước khi mở hoặc chuyển sang tab mới. Nếu không, mọi dữ liệu đăng nhập sẽ bị mất.", currentTabTitle: "Phiên hiện tại", resetTabBtn: "Đặt lại Tab", selectAccountTitle: "Tài khoản đã lưu", noAccounts: "Không có tài khoản nào. Hãy lưu tài khoản đầu tiên!", savedAt: "Lưu:", inUse: "Đang dùng", deleteBtn: "Xóa", deleteAllBtn: "Xóa tất cả tài khoản", madeBy: "Làm bởi Minhbeo8", alertAccountSaved: 'Đã lưu tài khoản "%s"!', alertAccountSwitched: 'Đã chuyển sang "%s". Đang tải lại...', confirmResetTab: "Đặt lại tab hiện tại? Mọi dữ liệu cục bộ sẽ bị xóa.", alertTabReset: "Tab đã được đặt lại! Đang tải lại...", confirmDeleteAccount: 'Xóa tài khoản "%s"?', alertAccountDeleted: 'Đã xóa "%s".', confirmDeleteAll: "Xóa TẤT CẢ tài khoản đã lưu cho trang này?", alertAllDeleted: "Đã xóa tất cả tài khoản.", newAccountNamePlaceholder: "Nhập tên tài khoản mới...", saveBtn: "Lưu", currentStatus: "Đang dùng tài khoản: <strong>%s</strong>", currentStatusNone: "Trạng thái: <strong>Chưa chọn</strong> (%s)", tabTypeRegular: "Thường", tabTypeClean: "Sạch", tabActions: "Hành động Tab", openCleanTabBtn: "Mở Tab sạch", openWithAccountBtn: "Mở với tài khoản", dataManagement: "Dữ liệu nâng cao", exportBtn: "Xuất Phiên", importBtn: "Nhập Phiên", promptImport: "Dán dữ liệu phiên của bạn vào đây. Thao tác này sẽ áp dụng phiên và tải lại trang.", confirmImport: "Thao tác này sẽ áp dụng dữ liệu phiên và tải lại trang. Tiếp tục?", alertImportSuccess: "Nhập phiên thành công! Đang tải lại...", alertImportError: "Nhập thất bại. Định dạng dữ liệu không hợp lệ.", alertExportNothing: "Phiên hiện tại trống. Hãy đăng nhập để xuất.", exportModalTitle: "Xuất Dữ liệu Phiên", copyToClipboardBtn: "Sao chép", downloadFileBtn: "Tải File", copiedFeedback: "Đã chép!", searchPlaceholder: "Tìm kiếm tài khoản...", updateBtn: "Cập nhật", alertAccountUpdated: 'Đã cập nhật tài khoản "%s"!', promptRename: 'Nhập tên mới cho "%s":', titleRename: "Đổi tên", alertRenameSuccess: "Đổi tên thành công!", favoriteBtnTitle: "Đánh dấu yêu thích", unfavoriteBtnTitle: "Bỏ đánh dấu yêu thích", notesBtnTitle: "Sửa ghi chú", promptNotes: 'Nhập ghi chú cho "%s":', titleNotes: "Ghi chú Tài khoản" }
    };

    class MultiTabAccountManager {
        constructor() {
            this.gui = GUI;
            this.themes = ['dark', 'nordic-light'];
            this.currentTheme = GM_getValue('manager_theme', 'dark');
            this.isToggling = false; this.setupLanguage(); this.hostname = window.location.hostname; this.storageKey = `saved_accounts_${this.hostname}`; this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768; this.tabId = this._getTabId(); this.accounts = GM_getValue(this.storageKey, {}); this.tabSessions = GM_getValue('tab_sessions', {}); this.currentAccount = null;
            this.activityUpdateInterval = null; this.cleanupInterval = null;
            this._debouncedSaveSessions = PerformanceUtils.debounce(() => { GM_setValue('tab_sessions', this.tabSessions); this._log('Batched session data saved.'); }, PERFORMANCE_CONFIG.STORAGE_WRITE_DELAY);
            if (this.isMobile) document.body.classList.add('tm-mobile-view');
            this.init();
        }

        init() {
            GM_addStyle(this.gui.css); this.createUI(); this.applyTheme(this.currentTheme); this.checkAndSetupCleanTab(); this.checkNewTabAccount(); this.registerTab(); this.loadTabAccount(); this.setupDragging(); this.cleanupClosedTabs(); this.optimizeForCCCloudPhone(); this.addEventListeners(); setTimeout(() => this.ensureButtonIsVisible(), 1000);
            this.activityUpdateInterval = setInterval(() => this.updateTabActivity(), PERFORMANCE_CONFIG.UPDATE_INTERVAL);
            this.cleanupInterval = setInterval(() => this.cleanupClosedTabs(), PERFORMANCE_CONFIG.CLEANUP_INTERVAL);
        }

        _showModal(type, options) { return new Promise((resolve) => { let existingModal = document.getElementById('customModalOverlay'); if (existingModal) existingModal.remove(); const overlay = document.createElement('div'); overlay.id = 'customModalOverlay'; let buttonsHTML = ''; if (type === 'alert') { buttonsHTML = `<button id="modal-ok" class="btn btn-primary">OK</button>`; } else if (type === 'confirm') { buttonsHTML = `<button id="modal-cancel" class="btn">${options.cancelText || 'Cancel'}</button><button id="modal-ok" class="btn btn-primary">${options.okText || 'OK'}</button>`; } else if (type === 'prompt') { buttonsHTML = `<button id="modal-cancel" class="btn">${options.cancelText || 'Cancel'}</button><button id="modal-ok" class="btn btn-primary">${options.okText || 'OK'}</button>`; } overlay.innerHTML = ` <div id="customModal"> <h3 id="customModal-title">${options.title || SCRIPT_NAME}</h3> <p id="customModal-message">${options.message}</p> ${type === 'prompt' ? `<textarea id="customModal-input" placeholder="${options.placeholder || ''}" rows="3" style="width:100%;resize:vertical;">${options.defaultValue || ''}</textarea>` : ''} <div id="customModal-buttons">${buttonsHTML}</div> </div> `; document.body.appendChild(overlay); setTimeout(() => overlay.classList.add('visible'), 10); const input = document.getElementById('customModal-input'); if (input) { input.focus(); input.select(); } const cleanup = (value) => { overlay.classList.remove('visible'); setTimeout(() => overlay.remove(), 200); resolve(value); }; document.getElementById('modal-ok').onclick = () => cleanup(type === 'prompt' ? input.value : true); if (document.getElementById('modal-cancel')) { document.getElementById('modal-cancel').onclick = () => cleanup(type === 'prompt' ? null : false); } overlay.addEventListener('click', (e) => { if (e.target === overlay) cleanup(type === 'prompt' ? null : false); }); }); }
        _customAlert(message, title) { return this._showModal('alert', { message, title }); }
        _customConfirm(message, title) { return this._showModal('confirm', { message, title }); }
        _customPrompt(message, title, defaultValue) { return this._showModal('prompt', { message, title, defaultValue }); }
        
        async saveCurrentAccount() {
            if (this.currentAccount && this.accounts[this.currentAccount]) {
                const account = this.accounts[this.currentAccount];
                account.localStorage = this.getCurrentLocalStorage(); account.cookies = this.getCurrentCookies(); account.updated = Date.now();
                GM_setValue(this.storageKey, this.accounts); await this._customAlert(this._getText("alertAccountUpdated").replace("%s", account.name)); this.populateAndAttachPanelEvents(); return;
            }
            const accountName = document.getElementById('saveAccountInput').value; if (!accountName || !accountName.trim()) { await this._customAlert(this._getText('newAccountNamePlaceholder')); return; }
            const trimmedName = accountName.trim(); const accountId = `acc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`; const accountData = { id: accountId, name: trimmedName, localStorage: this.getCurrentLocalStorage(), cookies: this.getCurrentCookies(), created: Date.now(), isFavorite: false, notes: '' };
            this.accounts[accountId] = accountData; GM_setValue(this.storageKey, this.accounts); this.currentAccount = accountId; sessionStorage.removeItem("isCleanTab"); this.registerTab(); await this._customAlert(this._getText("alertAccountSaved").replace("%s", trimmedName)); this.populateAndAttachPanelEvents();
        }

        async selectAccount(accountId) { if (!this.accounts[accountId]) return; const account = this.accounts[accountId]; this.clearCurrentData(); this._customAlert(this._getText("alertAccountSwitched").replace("%s", account.name)); setTimeout(() => { this.applyAccount(account); this.currentAccount = accountId; sessionStorage.removeItem("isCleanTab"); this.registerTab(); location.reload(); }, 500); }
        async clearCurrentTab() { if (await this._customConfirm(this._getText("confirmResetTab"))) { this.clearCurrentData(); this.currentAccount = null; sessionStorage.setItem("isCleanTab", true); this.registerTab(); await this._customAlert(this._getText("alertTabReset")); location.reload(); } }
        async deleteAccount(accountId) { const account = this.accounts[accountId]; if (await this._customConfirm(this._getText("confirmDeleteAccount").replace("%s", account.name))) { delete this.accounts[accountId]; GM_setValue(this.storageKey, this.accounts); if (this.currentAccount === accountId) { this.currentAccount = null; this.registerTab(); } this.populateAndAttachPanelEvents(); this._customAlert(this._getText("alertAccountDeleted").replace("%s", account.name)); } }
        async clearAllAccounts() { if (await this._customConfirm(this._getText("confirmDeleteAll"))) { this.accounts = {}; GM_setValue(this.storageKey, {}); this.currentAccount = null; this.registerTab(); this.populateAndAttachPanelEvents(); this._customAlert(this._getText("alertAllDeleted")); } }
        
        async renameAccount(accountId) {
            const account = this.accounts[accountId]; if (!account) return;
            const newName = await this._customPrompt(this._getText('promptRename').replace('%s', account.name), this._getText('titleRename'), account.name);
            if (newName && newName.trim() && newName.trim() !== account.name) {
                this.accounts[accountId].name = newName.trim(); GM_setValue(this.storageKey, this.accounts); this.updateAccountList(document.getElementById('searchAccountInput')?.value || '');
            }
        }

        async toggleFavorite(accountId) {
            const account = this.accounts[accountId]; if (!account) return;
            account.isFavorite = !account.isFavorite; GM_setValue(this.storageKey, this.accounts); this.updateAccountList(document.getElementById('searchAccountInput')?.value || '');
        }

        async editNote(accountId) {
            const account = this.accounts[accountId]; if (!account) return;
            const newNote = await this._customPrompt(this._getText('promptNotes').replace('%s', account.name), this._getText('titleNotes'), account.notes || '');
            if (newNote !== null) { // Allow empty string to clear note
                this.accounts[accountId].notes = newNote.trim(); GM_setValue(this.storageKey, this.accounts); this.updateAccountList(document.getElementById('searchAccountInput')?.value || '');
            }
        }

        async openNewTabWithAccount() { const accountIds = Object.keys(this.accounts); if (accountIds.length === 0) { return this._customAlert(this._getText("noAccounts")); } const promptText = accountIds.map((id, index) => `${index + 1}. ${this.accounts[id].name}`).join("\n"); const selectedIndex = await this._customPrompt(promptText, `Select an account (1-${accountIds.length})`); const index = parseInt(selectedIndex) - 1; if (index >= 0 && index < accountIds.length) { const nextTabData = { accountId: accountIds[index], hostname: this.hostname }; GM_setValue("next_tab_account_data", nextTabData); this._openInTab(this.getLoginUrl()); } }
        async importSurgicalSession() { const dataString = await this._customPrompt(this._getText('promptImport'), this._getText('importBtn')); if (!dataString) return; try { const data = JSON.parse(dataString); if (Object.keys(data).length === 0) throw new Error("Data is empty."); if (await this._customConfirm(this._getText('confirmImport'))) { Object.keys(data).forEach(key => localStorage.setItem(key, data[key])); this.currentAccount = null; this.registerTab(); await this._customAlert(this._getText('alertImportSuccess')); location.reload(); } } catch (error) { console.error("Import failed:", error); await this._customAlert(this._getText('alertImportError')); } }
        exportSurgicalSession() { const data = this.getSurgicalSession(); if (Object.keys(data).length === 0) { return this._customAlert(this._getText('alertExportNothing')); } this.showExportModal(JSON.stringify(data, null, 2)); }
        
        applyTheme(themeName) { const body = document.body; const themeBtn = document.getElementById('themeSwitchBtn'); body.classList.remove('theme-dark', 'theme-nordic-light'); if (themeName !== 'dark') { body.classList.add(`theme-${themeName}`); } if (themeBtn) { if (themeName === 'nordic-light') { themeBtn.innerHTML = '🌙'; themeBtn.title = 'Switch to Dark Mode'; } else { themeBtn.innerHTML = '☀️'; themeBtn.title = 'Switch to Nordic Light Mode'; } } }
        cycleTheme() { this.currentTheme = this.currentTheme === 'dark' ? 'nordic-light' : 'dark'; GM_setValue('manager_theme', this.currentTheme); this.applyTheme(this.currentTheme); }
        showExportModal(jsonString) { let modalOverlay = document.getElementById('exportModalOverlay'); if (modalOverlay) modalOverlay.remove(); modalOverlay = document.createElement('div'); modalOverlay.id = 'exportModalOverlay'; modalOverlay.innerHTML = this.gui.getExportModalHTML({ jsonString, getText: this._getText.bind(this) }); document.body.appendChild(modalOverlay); const closeModal = () => modalOverlay.classList.remove('visible'); modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); }); const copyBtn = document.getElementById('copyBtn'); copyBtn.addEventListener('click', () => { navigator.clipboard.writeText(jsonString).then(() => { const originalText = copyBtn.textContent; copyBtn.textContent = this._getText('copiedFeedback'); copyBtn.style.backgroundColor = '#28a745'; setTimeout(() => { copyBtn.textContent = originalText; copyBtn.style.backgroundColor = ''; }, 2000); }); }); document.getElementById('downloadBtn').addEventListener('click', () => { const blob = new Blob([jsonString], {type: "application/json"}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `session_${this.hostname}_${Date.now()}.json`; a.click(); URL.revokeObjectURL(url); }); setTimeout(() => modalOverlay.classList.add('visible'), 10); }

        populateAndAttachPanelEvents() {
            const panel = document.getElementById('tabManager');
            const statusHTML = (this.currentAccount && this.accounts[this.currentAccount]) ? this._getText('currentStatus').replace('%s', this.accounts[this.currentAccount].name) : this._getText('currentStatusNone').replace('%s', (sessionStorage.getItem('isCleanTab') === 'true' ? this._getText('tabTypeClean') : this._getText('tabTypeRegular')));
            panel.innerHTML = this.gui.getHTML({ statusHTML, getText: this._getText.bind(this) });
            this.applyTheme(this.currentTheme); this.updateAccountList();
            const saveBtn = panel.querySelector('#saveAccountBtn'); const saveInput = panel.querySelector('#saveAccountInput');
            if (this.currentAccount && this.accounts[this.currentAccount]) {
                saveBtn.textContent = this._getText('updateBtn'); saveBtn.classList.remove('btn-primary'); saveBtn.classList.add('btn-warning'); saveInput.value = this.accounts[this.currentAccount].name; saveInput.disabled = true;
            }
            const searchInput = panel.querySelector('#searchAccountInput');
            searchInput.addEventListener('input', PerformanceUtils.debounce((e) => { this.updateAccountList(e.target.value); }, PERFORMANCE_CONFIG.SEARCH_DEBOUNCE));
            panel.addEventListener('click', (e) => this._handlePanelClick(e));
            panel.querySelector('#accountList').addEventListener('click', (e) => this._handleAccountListClick(e));
        }

        _handlePanelClick(e) { const target = e.target.closest('.btn, .close-btn, #themeSwitchBtn'); if (!target) return; this.applyRippleEffect(e); switch (target.id) { case 'saveAccountBtn': this.saveCurrentAccount(); break; case 'clearAllAccountsBtn': this.clearAllAccounts(); break; case 'openCleanTabBtn': this.openNewCleanTab(); break; case 'openTabWithAccountBtn': this.openNewTabWithAccount(); break; case 'clearTabBtn': this.clearCurrentTab(); break; case 'exportBtn': this.exportSurgicalSession(); break; case 'importBtn': this.importSurgicalSession(); break; case 'closeManagerBtn': this.toggleMenu(); break; case 'themeSwitchBtn': this.cycleTheme(); break; } }
        _handleAccountListClick(e) {
            const target = e.target;
            const favoriteBtn = target.closest('.favorite-btn');
            if (favoriteBtn) { e.stopPropagation(); this.toggleFavorite(favoriteBtn.dataset.accountId); return; }
            const renameBtn = target.closest('.rename-btn');
            if (renameBtn) { e.stopPropagation(); this.renameAccount(renameBtn.dataset.accountId); return; }
            const noteBtn = target.closest('.note-btn');
            if (noteBtn) { e.stopPropagation(); this.editNote(noteBtn.dataset.accountId); return; }
            const deleteBtn = target.closest('.btn-delete-account');
            if (deleteBtn) { e.stopPropagation(); this.deleteAccount(deleteBtn.dataset.accountId); return; }
            const accountItem = target.closest('.account-item');
            if (accountItem) { this.applyRippleEffect(e); this.selectAccount(accountItem.dataset.accountId); }
        }

        getSurgicalSession() { const sessionData = {}; const keysForHost = HOSTNAME_SESSION_KEYS[this.hostname] || []; if (keysForHost.length === 0) { this._log(`Warning: No session keys defined for host "${this.hostname}".`); } keysForHost.forEach(key => { const value = localStorage.getItem(key); if (value !== null) { sessionData[key] = value; } }); return sessionData; }
        applyRippleEffect(event) { const el = event.currentTarget.closest('.btn, .account-item, .close-btn, #toggleBtn, #themeSwitchBtn'); if (!el) return; const circle = document.createElement("span"); const diameter = Math.max(el.clientWidth, el.clientHeight); const radius = diameter / 2; const rect = el.getBoundingClientRect(); circle.style.width = circle.style.height = `${diameter}px`; circle.style.left = `${event.clientX - rect.left - radius}px`; circle.style.top = `${event.clientY - rect.top - radius}px`; circle.classList.add("ripple"); const existingRipple = el.getElementsByClassName("ripple")[0]; if (existingRipple) existingRipple.remove(); el.appendChild(circle); }
        addEventListeners() { window.addEventListener('beforeunload', () => { const sessions = GM_getValue('tab_sessions', {}); delete sessions[this.tabId]; GM_setValue('tab_sessions', sessions); this.cleanup(); }); }
        cleanup() { this._log("Cleaning up intervals..."); if (this.activityUpdateInterval) clearInterval(this.activityUpdateInterval); if (this.cleanupInterval) clearInterval(this.cleanupInterval); }

        _log(message) { console.log(`[${SCRIPT_NAME}] ${message}`); }
        _getText(key) { return TRANSLATIONS[this.currentLang][key] || TRANSLATIONS['en'][key] || `[${key}]`; }
        _getTabId() { let tabId = sessionStorage.getItem('multiTabId'); if (!tabId) { tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`; sessionStorage.setItem('multiTabId', tabId); } return tabId; }
        _openInTab(url) { if (typeof GM_openInTab === 'function') { GM_openInTab(url, { active: true, insert: true, setParent: false }); } else { window.open(url, '_blank'); } }
        createUI() { const overlay = document.createElement('div'); overlay.id = 'tabManagerOverlay'; document.body.appendChild(overlay); const defaultPos = { top: 20, left: window.innerWidth - 80 }; const savedPos = GM_getValue('toggle_button_position', defaultPos); const toggleBtn = document.createElement('button'); toggleBtn.id = 'toggleBtn'; toggleBtn.innerHTML = '🗂️'; toggleBtn.title = this._getText('toggleButtonTitle'); toggleBtn.style.top = `${savedPos.top}px`; toggleBtn.style.left = `${savedPos.left}px`; document.body.appendChild(toggleBtn); const panel = document.createElement('div'); panel.id = 'tabManager'; document.body.appendChild(panel); this.attachUIEvents(); }
        attachUIEvents() { document.getElementById('toggleBtn').addEventListener('click', (e) => { this.applyRippleEffect(e); this.toggleMenu(); }); document.getElementById('tabManagerOverlay').addEventListener('click', () => this.toggleMenu()); }
        toggleMenu() { if (this.isToggling) return; this.isToggling = true; const panel = document.getElementById('tabManager'); const overlay = document.getElementById('tabManagerOverlay'); if (!panel) { this.isToggling = false; return; } const isVisible = panel.classList.contains('visible'); if (isVisible) { panel.classList.remove('visible'); overlay.style.opacity = '0'; setTimeout(() => { overlay.style.display = 'none'; }, 300); } else { this.populateAndAttachPanelEvents(); overlay.style.display = 'block'; setTimeout(() => { overlay.style.opacity = '1'; panel.classList.add('visible'); }, 10); } setTimeout(() => { this.isToggling = false; }, 300); }
        
        updateAccountList(filter = '') {
            const container = document.getElementById('accountList'); if (!container) return;
            const lowerCaseFilter = filter.toLowerCase().trim();
            let accountIds = Object.keys(this.accounts).filter(id => this.accounts[id].name.toLowerCase().includes(lowerCaseFilter));
            
            
            accountIds.sort((a, b) => {
                const accA = this.accounts[a];
                const accB = this.accounts[b];
                const favA = accA.isFavorite ? 1 : 0;
                const favB = accB.isFavorite ? 1 : 0;
                if (favB !== favA) return favB - favA;
                return (accB.updated || accB.created) - (accA.updated || accA.created);
            });

            if (accountIds.length === 0) { container.innerHTML = `<div style="text-align: center; opacity: 0.7; padding: 10px 0;">${this._getText('noAccounts')}</div>`; return; }
            requestAnimationFrame(() => {
                container.innerHTML = accountIds.map(accountId => {
                    const account = this.accounts[accountId];
                    const isActive = this.currentAccount === accountId;
                    const dateInfo = account.updated ? `Updated: ${new Date(account.updated).toLocaleString()}` : `${this._getText("savedAt")} ${new Date(account.created).toLocaleString()}`;
                    
                    return `
                        <div class="account-item ${isActive ? "active" : ""}" data-account-id="${accountId}">
                            <span class="account-icon-btn favorite-btn ${account.isFavorite ? 'favorited' : ''}" data-account-id="${accountId}" title="${account.isFavorite ? this._getText('unfavoriteBtnTitle') : this._getText('favoriteBtnTitle')}">${account.isFavorite ? '⭐' : '☆'}</span>
                            <div class="account-item-details">
                                <div class="account-item-name">
                                    <span>${account.name}</span>
                                </div>
                                <div class="account-item-subtext">${dateInfo}</div>
                                ${account.notes ? `<div class="account-item-note">${account.notes}</div>` : ''}
                            </div>
                            <div class="account-item-actions">
                                <span class="account-icon-btn rename-btn" data-account-id="${accountId}" title="${this._getText('titleRename')}">✏️</span>
                                <span class="account-icon-btn note-btn" data-account-id="${accountId}" title="${this._getText('notesBtnTitle')}">📝</span>
                                <button class="btn btn-danger btn-delete-account" data-account-id="${accountId}" style="padding: 5px 8px; font-size: 11px; width: auto; min-width: 50px; margin-left: 5px;">${this._getText("deleteBtn")}</button>
                                ${isActive ? `<span style="color: #4CAF50; font-size:11px; font-weight: bold; margin-left: 5px;">${this._getText("inUse")}</span>` : ""}
                            </div>
                        </div>`;
                }).join('');
            });
        }

        setupLanguage() { const userLang = navigator.language.split('-')[0]; this.currentLang = TRANSLATIONS[userLang] ? userLang : 'en'; }
        getLoginUrl() { return LOGIN_PATHS[this.hostname] ? window.location.origin + LOGIN_PATHS[this.hostname] : window.location.origin + '/'; }
        openNewCleanTab() { GM_setValue("clean_next_tab", true); this._openInTab(this.getLoginUrl());}
        setupDragging() { const toggleBtn = document.getElementById('toggleBtn'); if (!toggleBtn) return; let isDragging = false, hasMoved = false, lastPointerDownTime = 0, offsetX, offsetY; const startDrag = (e) => { if (e.type === 'mousedown') e.preventDefault(); hasMoved = false; isDragging = true; toggleBtn.classList.add('dragging'); document.body.style.userSelect = 'none'; lastPointerDownTime = Date.now(); const rect = toggleBtn.getBoundingClientRect(); const pointerX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX; const pointerY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY; offsetX = pointerX - rect.left; offsetY = pointerY - rect.top; toggleBtn.style.transition = 'none'; }; const doDrag = (e) => { if (!isDragging) return; if (e.type === 'touchmove') e.preventDefault(); const pointerX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX; const pointerY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY; if (!hasMoved && (Math.abs(pointerX - (toggleBtn.offsetLeft + offsetX)) > 5 || Math.abs(pointerY - (toggleBtn.offsetTop + offsetY)) > 5)) { hasMoved = true; } let newLeft = pointerX - offsetX; let newTop = pointerY - offsetY; newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - toggleBtn.offsetWidth)); newTop = Math.max(0, Math.min(newTop, window.innerHeight - toggleBtn.offsetHeight)); toggleBtn.style.left = `${newLeft}px`; toggleBtn.style.top = `${newTop}px`; }; const endDrag = (e) => { if (!isDragging) return; isDragging = false; toggleBtn.classList.remove('dragging'); document.body.style.userSelect = ''; toggleBtn.style.transition = ''; if (hasMoved) { GM_setValue('toggle_button_position', { top: parseInt(toggleBtn.style.top, 10), left: parseInt(toggleBtn.style.left, 10) }); } else { if (e.target === toggleBtn && Date.now() - lastPointerDownTime < 300) { this.toggleMenu(); } } }; toggleBtn.addEventListener('mousedown', startDrag); document.addEventListener('mousemove', doDrag); document.addEventListener('mouseup', endDrag); toggleBtn.addEventListener('touchstart', startDrag, { passive: false }); document.addEventListener('touchmove', doDrag, { passive: false }); document.addEventListener('touchend', endDrag); }
        checkAndSetupCleanTab() { if (GM_getValue("clean_next_tab", false)) { GM_deleteValue("clean_next_tab"); this.forceCleanTab(); sessionStorage.setItem("isCleanTab", true); } }
        forceCleanTab() { const keysToRemove = []; for (let i = 0; i < localStorage.length; i++) { const key = localStorage.key(i); if (key && !key.startsWith("GM_") && !key.includes("tampermonkey") && key !== "multiTabId" && !key.includes("greasemonkey")) { keysToRemove.push(key); } } keysToRemove.forEach(key => localStorage.removeItem(key)); this.clearAllCookies(); const sessionKeysToRemove = []; for (let i = 0; i < sessionStorage.length; i++) { const key = sessionStorage.key(i); if (key && key !== "multiTabId" && key !== "isCleanTab") { sessionKeysToRemove.push(key); } } sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key)); }
        clearAllCookies() { const getCookieDomains = () => { const domains = ["", this.hostname, "." + this.hostname]; const parts = this.hostname.split("."); if (parts.length > 1) { const baseDomain = "." + parts.slice(-2).join("."); if (!domains.includes(baseDomain)) { domains.push(baseDomain); } } return [...new Set(domains)]; }; const cookies = document.cookie.split(";"); cookies.forEach(cookie => { const eqPos = cookie.indexOf("="); const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim(); if (name) { const domains = getCookieDomains(); const paths = ["/", "/toc-portal/", "/toc-portal", "/minified:xc"]; domains.forEach(domain => { paths.forEach(path => { document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}`; }); }); } }); }
        
        registerTab() { this.tabSessions[this.tabId] = { id: this.tabId, url: window.location.href, title: document.title, lastActivity: Date.now(), account: this.currentAccount, created: this.tabSessions[this.tabId]?.created || Date.now(), isClean: sessionStorage.getItem("isCleanTab") === "true" }; this._debouncedSaveSessions(); }
        updateTabActivity() { if (this.tabSessions[this.tabId]) { this.tabSessions[this.tabId].lastActivity = Date.now(); this.tabSessions[this.tabId].account = this.currentAccount; this._debouncedSaveSessions(); } else { this.registerTab(); } }
        cleanupClosedTabs() { const now = Date.now(); let changed = false; const sessions = GM_getValue('tab_sessions', {}); Object.keys(sessions).forEach(tabId => { if (tabId !== this.tabId && now - sessions[tabId].lastActivity > 30000) { delete sessions[tabId]; changed = true; } }); if (changed) { GM_setValue("tab_sessions", sessions); this.tabSessions = sessions; this._log("Cleaned up stale tab sessions."); } }
        loadTabAccount() { const tabInfo = this.tabSessions[this.tabId]; if (tabInfo && tabInfo.account && this.accounts[tabInfo.account] && !tabInfo.isClean) { this.currentAccount = tabInfo.account; } }
        applyAccount(account) { const getBaseDomain = () => { const parts = this.hostname.split("."); return parts.length > 1 ? "." + parts.slice(-2).join(".") : "." + this.hostname; }; const baseDomain = getBaseDomain(); Object.entries(account.localStorage).forEach(([key, value]) => { try { if (key !== "multiTabId") { localStorage.setItem(key, value); } } catch (e) { this._log(`Could not set localStorage key: ${key}`); } }); Object.entries(account.cookies).forEach(([name, value]) => { document.cookie = `${name}=${value}; path=/; domain=${baseDomain}; max-age=86400`; }); }
        clearCurrentData() { this.forceCleanTab(); }
        getCurrentLocalStorage() { const data = {}; for (let i = 0; i < localStorage.length; i++) { const key = localStorage.key(i); if (key && !key.startsWith("GM_") && !key.includes("tampermonkey") && key !== "multiTabId") { data[key] = localStorage.getItem(key); } } return data; }
        getCurrentCookies() { const cookies = {}; document.cookie.split(";").forEach(cookie => { const parts = cookie.trim().split("="); const name = parts.shift(); const value = parts.join("="); if (name && value) { cookies[name] = value; } }); return cookies; }
        checkNewTabAccount() { const nextTabData = GM_getValue("next_tab_account_data", null); if (nextTabData && nextTabData.hostname === this.hostname) { const storageKeyForNextTab = `saved_accounts_${nextTabData.hostname}`; const accountsForNextTab = GM_getValue(storageKeyForNextTab, {}); if (accountsForNextTab[nextTabData.accountId]) { GM_deleteValue("next_tab_account_data"); this.selectAccount(nextTabData.accountId); } } else if (nextTabData) { GM_deleteValue("next_tab_account_data"); } }
        ensureButtonIsVisible() { const toggleBtn = document.getElementById('toggleBtn'); if (!toggleBtn) return; const rect = toggleBtn.getBoundingClientRect(); const winWidth = window.innerWidth; const winHeight = window.innerHeight; let finalX = rect.left, finalY = rect.top, needsCorrection = false; if (rect.width === 0 || rect.height === 0 || rect.top > winHeight || rect.left > winWidth) { finalX = winWidth - 60; finalY = winHeight / 2; needsCorrection = true; } else { if (finalX < 0) { finalX = 10; needsCorrection = true; } if (finalY < 0) { finalY = 10; needsCorrection = true; } if (finalX + rect.width > winWidth) { finalX = winWidth - rect.width - 10; needsCorrection = true; } if (finalY + rect.height > winHeight) { finalY = winHeight - rect.height - 10; needsCorrection = true; } } if(needsCorrection) { this._log("Correcting button position."); toggleBtn.style.left = `${finalX}px`; toggleBtn.style.top = `${finalY}px`; GM_setValue('toggle_button_position', { top: finalY, left: finalX }); } }
        optimizeForCCCloudPhone() { if (this.isMobile && (this.hostname.includes("cccloudphone.com"))) { const viewport = document.querySelector('meta[name="viewport"]'); if (viewport) { viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'); } else { const newViewport = document.createElement('meta'); newViewport.name = 'viewport'; newViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'; document.head.appendChild(newViewport); } } }
    }

    function init() {
        if (document.body) { new MultiTabAccountManager(); }
        else { window.addEventListener('DOMContentLoaded', () => new MultiTabAccountManager(), { once: true }); }
    }

    init();
})();
