// ==UserScript==
// @name         cs.rin.ru - Auto-Reveal & Clean Unsafe Links
// @namespace    local.rin.reveal
// @version      2.2
// @description  Auto-reveals unsafe links, removes warnings, colors, and borders
// @match        https://cs.rin.ru/forum/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    .link_unsafe_overlay,
    .link_unsafe_overlay2 {
      border: none !important;
      color: inherit !important;
      width: auto !important;
      display: inline !important;
    }
    .link_unsafe {
      display: inline !important;
    }
    .link_unsafe a {
      color: #0066cc !important;
      text-decoration: underline !important;
    }
  `;
  document.head.appendChild(style);

  const processLinks = () => {
    document.querySelectorAll('.link_unsafe_overlay, .link_unsafe_overlay2').forEach(box => {
      const revealBtn = box.querySelector('.link_unsafe_reveal');
      const hiddenLink = box.querySelector('.link_unsafe');
      const warning = box.querySelector('.link_unsafe_note');

      if (!hiddenLink) return;

      // Show the actual link
      hiddenLink.style.display = 'inline';
      
      const allElements = hiddenLink.querySelectorAll('*');
      allElements.forEach(el => {
        el.style.color = '';
        el.style.fontWeight = '';
      });
      hiddenLink.style.color = '';
      hiddenLink.style.fontWeight = '';
      
      if (revealBtn) revealBtn.remove();
      
      if (warning) warning.remove();
      
      const warningSymbol = box.childNodes;
      for (let i = 0; i < warningSymbol.length; i++) {
        if (warningSymbol[i].nodeType === 3 && warningSymbol[i].textContent.includes('⚠')) {
          warningSymbol[i].remove();
        }
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processLinks);
  } else {
    processLinks();
  }

  window.reveal_unsafe = function(e) {
    const parent = e.parentElement;
    const link = parent.querySelector('.link_unsafe');
    if (link) {
      link.style.display = 'inline';
      link.style.color = '';
      link.querySelectorAll('*').forEach(el => {
        el.style.color = '';
        el.style.fontWeight = '';
      });
    }
    e.remove();
    const warning = parent.querySelector('.link_unsafe_note');
    if (warning) warning.remove();
    return false;
  };
})();
