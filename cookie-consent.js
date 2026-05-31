/**
 * Bortone Antincendio - Cookie consent banner.
 * Conforme GDPR / Garante Privacy: pulsanti Accetta/Rifiuta equivalenti, no cookie wall.
 * Usa Google Consent Mode v2: analytics_storage = "denied" finché l'utente non accetta.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "bortone_cc_v1";

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function readChoice() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function writeChoice(v) {
    try { localStorage.setItem(STORAGE_KEY, v); } catch (e) {}
  }

  function updateConsent(granted) {
    gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied"
    });
  }

  function buildBanner() {
    var el = document.createElement("div");
    el.className = "cookie-banner";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-live", "polite");
    el.setAttribute("aria-label", "Informativa cookie");
    el.innerHTML =
      '<span class="cookie-banner__icon" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-4-4 4 4 0 0 1-4-4 5 5 0 0 0-2-2z"/>' +
          '<circle cx="9" cy="10" r="1.1" fill="currentColor" stroke="none"/>' +
          '<circle cx="14.5" cy="14.5" r="1.1" fill="currentColor" stroke="none"/>' +
          '<circle cx="9" cy="15.5" r="0.9" fill="currentColor" stroke="none"/>' +
          '<circle cx="15" cy="9" r="0.9" fill="currentColor" stroke="none"/>' +
        '</svg>' +
      '</span>' +
      '<div class="cookie-banner__content">' +
        '<p class="cookie-banner__title">Rispettiamo la tua privacy</p>' +
        '<p class="cookie-banner__text">' +
          'Usiamo cookie tecnici necessari al sito e, solo con il tuo consenso, ' +
          'cookie di <strong>Google Analytics</strong> in forma anonima per misurare il traffico. ' +
          '<a href="privacy.html" class="cookie-banner__link">Maggiori informazioni</a>.' +
        '</p>' +
      '</div>' +
      '<div class="cookie-banner__actions">' +
        '<button type="button" class="cookie-banner__btn cookie-banner__btn--ghost" data-cc="reject">Rifiuta</button>' +
        '<button type="button" class="cookie-banner__btn cookie-banner__btn--accept" data-cc="accept">Accetta</button>' +
      '</div>';

    el.querySelector('[data-cc="accept"]').addEventListener("click", function () {
      writeChoice("granted");
      updateConsent(true);
      hideBanner(el);
    });
    el.querySelector('[data-cc="reject"]').addEventListener("click", function () {
      writeChoice("denied");
      updateConsent(false);
      hideBanner(el);
    });
    return el;
  }

  function hideBanner(el) {
    el.classList.add("cookie-banner--out");
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 220);
  }

  function showBanner() {
    if (document.querySelector(".cookie-banner")) return;
    var el = buildBanner();
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add("cookie-banner--in"); });
  }

  // API pubblica: permette di riaprire le impostazioni da un link
  // tipo <a href="#" onclick="openCookieSettings();return false;">Gestisci cookie</a>
  window.openCookieSettings = function () {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    updateConsent(false);
    showBanner();
  };

  function init() {
    var choice = readChoice();
    if (choice === "granted") { updateConsent(true);  return; }
    if (choice === "denied")  { updateConsent(false); return; }
    showBanner();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
