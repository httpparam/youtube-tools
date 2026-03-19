(function() {
  'use strict';

  let logoEnabled = true;
  let adBlockEnabled = true;
  let pipEnabled = true;
  let adBlockInterval = null;
  let logoObserver = null;
  let originalFetch = null;
  let originalXHR = null;
  let fetchHooked = false;
  let xhrHooked = false;

  const youtubePremiumLogoSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 846 174" height="80px" width="391px" style="pointer-events: none;">
   <g transform="translate(0,0.36)">
     <g>
       <g>
         <path style="fill:#ff0000" d="M 242.88,27.11 A 31.07,31.07 0 0 0 220.95,5.18 C 201.6,0 124,0 124,0 124,0 46.46,0 27.11,5.18 A 31.07,31.07 0 0 0 5.18,27.11 C 0,46.46 0,86.82 0,86.82 c 0,0 0,40.36 5.18,59.71 a 31.07,31.07 0 0 0 21.93,21.93 c 19.35,5.18 96.92,5.18 96.92,5.18 0,0 77.57,0 96.92,-5.18 a 31.07,31.07 0 0 0 21.93,-21.93 c 5.18,-19.35 5.18,-59.71 5.18,-59.71 0,0 0,-40.36 -5.18,-59.71 z" />
         <path style="fill:#ffffff" d="M 99.22,124.03 163.67,86.82 99.22,49.61 Z" />
         <path d="m 358.29,55.1 v 6 c 0,30 -13.3,47.53 -42.39,47.53 h -4.43 v 52.5 H 287.71 V 12.36 H 318 c 27.7,0 40.29,11.71 40.29,42.74 z m -25,2.13 c 0,-21.64 -3.9,-26.78 -17.38,-26.78 h -4.43 v 60.48 h 4.08 c 12.77,0 17.74,-9.22 17.74,-29.26 z m 81.22,-6.56 -1.24,28.2 c -10.11,-2.13 -18.45,-0.53 -22.17,6 v 76.26 H 367.52 V 52.44 h 18.8 L 388.45,76 h 0.89 c 2.48,-17.2 10.46,-25.89 20.75,-25.89 a 22.84,22.84 0 0 1 4.42,0.56 z M 441.64,115 v 5.5 c 0,19.16 1.06,25.72 9.22,25.72 7.8,0 9.58,-6 9.75,-18.44 l 21.1,1.24 c 1.6,23.41 -10.64,33.87 -31.39,33.87 -25.18,0 -32.63,-16.49 -32.63,-46.46 v -19 c 0,-31.57 8.34,-47 33.34,-47 25.18,0 31.57,13.12 31.57,45.93 V 115 Z m 0,-22.35 v 7.8 h 17.91 V 92.7 c 0,-20 -1.42,-25.72 -9,-25.72 -7.58,0 -8.91,5.86 -8.91,25.72 z M 604.45,79 v 82.11 H 580 V 80.82 c 0,-8.87 -2.31,-13.3 -7.63,-13.3 -4.26,0 -8.16,2.48 -10.82,7.09 a 35.59,35.59 0 0 1 0.18,4.43 v 82.11 H 537.24 V 80.82 c 0,-8.87 -2.31,-13.3 -7.63,-13.3 -4.26,0 -8,2.48 -10.64,6.92 v 86.72 H 494.5 V 52.44 h 19.33 L 516,66.28 h 0.35 c 5.5,-10.46 14.37,-16.14 24.83,-16.14 10.29,0 16.14,5.14 18.8,14.37 5.68,-9.4 14.19,-14.37 23.94,-14.37 14.86,0 20.53,10.64 20.53,28.86 z m 12.24,-54.4 c 0,-11.71 4.26,-15.07 13.3,-15.07 9.22,0 13.3,3.9 13.3,15.07 0,12.06 -4.08,15.08 -13.3,15.08 -9.04,-0.01 -13.3,-3.02 -13.3,-15.08 z m 1.42,27.84 h 23.41 v 108.72 h -23.41 z m 103.39,0 v 108.72 h -19.15 l -2.13,-13.3 h -0.53 c -5.5,10.64 -13.48,15.07 -23.41,15.07 -14.54,0 -21.11,-9.22 -21.11,-29.26 V 52.44 h 24.47 v 79.81 c 0,9.58 2,13.48 6.92,13.48 A 12.09,12.09 0 0 0 697,138.81 V 52.44 Z M 845.64,79 v 82.11 H 821.17 V 80.82 c 0,-8.87 -2.31,-13.3 -7.63,-13.3 -4.26,0 -8.16,2.48 -10.82,7.09 A 35.59,35.59 0 0 1 802.9,79 v 82.11 H 778.43 V 80.82 c 0,-8.87 -2.31,-13.3 -7.63,-13.3 -4.26,0 -8,2.48 -10.64,6.92 v 86.72 H 735.69 V 52.44 H 755 l 2.13,13.83 h 0.35 c 5.5,-10.46 14.37,-16.14 24.83,-16.14 10.29,0 16.14,5.14 18.8,14.37 5.68,-9.4 14.19,-14.37 23.94,-14.37 14.95,0.01 20.59,10.65 20.59,28.87 z" />
       </g>
     </g>
   </g>
 </svg>`;

  const adBlockCSS = `
    .ytp-ad-player-overlay,
    .ytp-ad-overlay-slot,
    .ytp-ad-preview-text,
    .ytp-ad-image,
    .ytp-ad-skip-button,
    .ytp-ad-skip-button-modern,
    .videoAdUiSkipButton,
    .ytp-skip-ad-button,
    .ytp-ad-badge,
    .ad-badge,
    .ad-showing,
    .ad-interrupting,
    .ytp-ad-player-overlay-instream-info,
    .ytp-ad-module,
    ytd-promoted-video-renderer,
    ytd-in-feed-ad-layout-renderer,
    ytd-display-ad-renderer,
    .ytd-display-ad-renderer,
    ytd-ad-slot-renderer,
    ytd-ad-shelf-renderer,
    ytd-banner-promo-renderer,
    ytd-page-break-ad-layout-renderer,
    ytd-companion-ad-renderer,
    [aria-label*="Sponsored"],
    [aria-label*="Advertisement"],
    [aria-label*="Ad i"],
    [role="text"][aria-label*="Ad"],
    ytd-merch-shelf-renderer,
    ytd-comment-sponsored-renderer,
    .ytp-paid-content-overlay,
    #player-ads,
    .ytp-ad-player,
    #advert {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
      width: 0 !important;
      pointer-events: none !important;
    }
  `;

  const pipButtonCSS = `
    .yt-pip-btn {
      position: absolute;
      bottom: 60px;
      right: 12px;
      width: 40px;
      height: 40px;
      background: rgba(33, 33, 33, 0.9);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s, transform 0.2s, background 0.2s;
      z-index: 1000;
    }

    .ytp-right-controls:hover .yt-pip-btn,
    .ytp-right-controls .yt-pip-btn:hover {
      opacity: 1;
    }

    .yt-pip-btn:hover {
      background: rgba(50, 50, 50, 0.95);
      transform: scale(1.1);
    }

    .yt-pip-btn svg {
      width: 20px;
      height: 20px;
      fill: #fff;
    }
  `;

  let pipButtonAdded = false;

  function loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(
        { logoEnabled: true, adBlockEnabled: true, pipEnabled: true },
        (settings) => {
          logoEnabled = settings.logoEnabled;
          adBlockEnabled = settings.adBlockEnabled;
          pipEnabled = settings.pipEnabled;
          resolve(settings);
        }
      );
    });
  }

  function replaceLogo() {
    if (!logoEnabled) return;

    try {
      const logoSelectors = [
        '#logo-icon',
        'ytd-logo#logo a',
        '#logo',
        'ytd-topbar-logo-renderer',
        'yt-icon#logo-icon yt-icon-shape'
      ];

      logoSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          const svg = element.querySelector('svg');
          if (svg && !element.dataset.premiumLogoReplaced) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(youtubePremiumLogoSVG, 'image/svg+xml');
            const newSvg = doc.documentElement;

            newSvg.style.width = 'auto';
            newSvg.style.height = '24px';
            newSvg.style.maxWidth = '90px';

            element.dataset.premiumLogoReplaced = 'true';
            svg.parentNode.replaceChild(newSvg, svg);
          }
        });
      });
    } catch (error) {
    }
  }

  function initLogoReplacer() {
    if (logoObserver) {
      logoObserver.disconnect();
    }

    if (!logoEnabled) return;

    if (document.body) {
      replaceLogo();

      logoObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
            replaceLogo();
          }
        });
      });

      logoObserver.observe(document.body, {
        childList: true,
        subtree: false
      });
    }
  }

  function injectAdBlockCSS() {
    if (!adBlockEnabled) return;
    const style = document.createElement('style');
    style.textContent = adBlockCSS;
    style.id = 'yt-adblock-style';
    (document.head || document.documentElement).appendChild(style);
  }

  function removeAdBlockCSS() {
    const style = document.getElementById('yt-adblock-style');
    if (style) {
      style.remove();
    }
  }

  function removeAdElements() {
    if (!adBlockEnabled) return;
    const adSelectors = [
      '.ytp-ad-player-overlay',
      '.ytp-ad-overlay-slot',
      '.ytp-ad-preview-text',
      '.ytp-ad-image',
      '.ytp-ad-skip-button',
      '.ytp-ad-skip-button-modern',
      '.ytp-ad-badge',
      '.ad-badge',
      '.ytp-ad-player-overlay-instream-info',
      '.ytp-ad-module',
      '.ytp-paid-content-overlay',
      '#player-ads',
      '.ytp-ad-player',
      '#advert',
      'ytd-promoted-video-renderer',
      'ytd-in-feed-ad-layout-renderer',
      'ytd-display-ad-renderer',
      '.ytd-display-ad-renderer',
      'ytd-ad-slot-renderer',
      'ytd-ad-shelf-renderer',
      'ytd-banner-promo-renderer',
      'ytd-page-break-ad-layout-renderer',
      'ytd-companion-ad-renderer',
      'ytd-merch-shelf-renderer',
      'ytd-comment-sponsored-renderer',
      '[aria-label*="Sponsored"]',
      '[aria-label*="Advertisement"]',
      '[aria-label*="Ad "]'
    ];

    adSelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (selector.includes('aria-label')) {
            const container = el.closest('ytd-grid-video-renderer, ytd-video-renderer, ytd-rich-item-renderer, ytd-compact-video-renderer, ytd-rich-grid-media');
            if (container) {
              container.remove();
            }
          }
          el.remove();
        });
      } catch (e) {
      }
    });
  }

  function blockVideoAds() {
    if (!adBlockEnabled) return;
    const video = document.querySelector('video.html5-main-video');
    if (!video) return;
    const isAd = document.querySelector('.ytp-ad-player-overlay, .ytp-ad-preview-text') ||
                 video.classList.contains('ad-showing') ||
                 video.parentElement.classList.contains('ad-showing');

    if (isAd) {
      video.muted = true;
      video.playbackRate = 16;
      const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern');
      if (skipBtn) {
        skipBtn.click();
      }
    }
  }

  function hookAdRequests() {
    if (!originalFetch) {
      originalFetch = window.fetch;
    }
    if (!originalXHR) {
      originalXHR = window.XMLHttpRequest.prototype.open;
    }

    if (!fetchHooked) {
      window.fetch = function(...args) {
        const url = args[0];
        if (adBlockEnabled && typeof url === 'string') {
          if (url.includes('doubleclick.net') ||
              url.includes('googleadservices.com') ||
              url.includes('googlesyndication.com') ||
              url.includes('/ads/')) {
            return Promise.reject('Blocked ad request');
          }
        }
        return originalFetch.apply(this, args);
      };
      fetchHooked = true;
    }

    if (!xhrHooked) {
      window.XMLHttpRequest.prototype.open = function(method, url) {
        if (adBlockEnabled && typeof url === 'string') {
          if (url.includes('doubleclick.net') ||
              url.includes('googleadservices.com') ||
              url.includes('googlesyndication.com') ||
              url.includes('/ads/')) {
            throw new Error('Blocked ad request');
          }
        }
        return originalXHR.apply(this, arguments);
      };
      xhrHooked = true;
    }
  }

  function runAdblocker() {
    removeAdElements();
    blockVideoAds();
  }

  function initAdblocker() {
    if (adBlockInterval) {
      clearInterval(adBlockInterval);
    }

    hookAdRequests();

    removeAdBlockCSS();
    if (adBlockEnabled) {
      injectAdBlockCSS();
    }

    runAdblocker();
    if (adBlockEnabled) {
      adBlockInterval = setInterval(runAdblocker, 50);
    }

    const adObserver = new MutationObserver(() => {
      runAdblocker();
    });

    if (document.body) {
      adObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    const video = document.querySelector('video.html5-main-video');
    if (video) {
      const videoObserver = new MutationObserver(() => {
        blockVideoAds();
      });
      videoObserver.observe(video.parentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
    }
  }

  function addPIPButton() {
    if (!pipEnabled || pipButtonAdded) return;

    const injectPIPStyles = () => {
      if (!document.getElementById('yt-pip-styles')) {
        const style = document.createElement('style');
        style.id = 'yt-pip-styles';
        style.textContent = pipButtonCSS;
        document.head.appendChild(style);
      }
    };

    const createPIPButton = () => {
      const controlsContainer = document.querySelector('.ytp-right-controls');
      if (!controlsContainer || pipButtonAdded) return;

      const pipBtn = document.createElement('button');
      pipBtn.className = 'ytp-button yt-pip-btn';
      pipBtn.title = 'Picture-in-Picture';
      pipBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 3H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2M9 3h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/></svg>`;
      pipBtn.addEventListener('click', openPIP);
      controlsContainer.insertBefore(pipBtn, controlsContainer.firstChild);
      pipButtonAdded = true;
    };

    injectPIPStyles();
    createPIPButton();

    const observer = new MutationObserver(() => {
      if (!document.querySelector('.yt-pip-btn') && pipEnabled) {
        pipButtonAdded = false;
        createPIPButton();
      }
    });

    const player = document.querySelector('#movie_player');
    if (player) {
      observer.observe(player, { childList: true, subtree: true });
    }
  }

  function removePIPButton() {
    const pipBtn = document.querySelector('.yt-pip-btn');
    if (pipBtn) {
      pipBtn.remove();
      pipButtonAdded = false;
    }
  }

  function openPIP() {
    const video = document.querySelector('video.html5-main-video');
    if (video && document.pictureInPictureEnabled) {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      } else {
        video.requestPictureInPicture().catch(err => {
        });
      }
    }
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
      case 'toggleLogo':
        logoEnabled = request.data.enabled;
        initLogoReplacer();
        sendResponse({ success: true });
        break;

      case 'toggleAds':
        adBlockEnabled = request.data.enabled;
        initAdblocker();
        sendResponse({ success: true });
        break;

      case 'togglePip':
        pipEnabled = request.data.enabled;
        if (pipEnabled) {
          addPIPButton();
        } else {
          removePIPButton();
        }
        sendResponse({ success: true });
        break;

      case 'openPip':
        openPIP();
        sendResponse({ success: true });
        break;
    }
    return true;
  });

  async function init() {
    await loadSettings();

    if (document.body) {
      initLogoReplacer();
      initAdblocker();
      addPIPButton();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
