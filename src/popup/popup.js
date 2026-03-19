const defaultSettings = {
  logoEnabled: true,
  adBlockEnabled: true,
  pipEnabled: true,
  shortsAutoScrollEnabled: true
};

function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(defaultSettings, (settings) => {
      resolve(settings);
    });
  });
}

function saveSettings(settings) {
  return new Promise((resolve) => {
    chrome.storage.sync.set(settings, () => {
      resolve();
    });
  });
}

function sendMessageToTab(action, data) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url && tabs[0].url.includes('youtube.com')) {
        chrome.tabs.sendMessage(tabs[0].id, { action, data }, (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        });
      } else {
        reject(new Error('Not on YouTube'));
      }
    });
  });
}

async function init() {
  const settings = await loadSettings();

  document.getElementById('toggle-logo').checked = settings.logoEnabled;
  document.getElementById('toggle-ads').checked = settings.adBlockEnabled;
  document.getElementById('toggle-pip').checked = settings.pipEnabled;
  document.getElementById('toggle-shorts-scroll').checked = settings.shortsAutoScrollEnabled;

  document.getElementById('toggle-logo').addEventListener('change', async (e) => {
    const logoEnabled = e.target.checked;
    await saveSettings({ ...settings, logoEnabled });
    try {
      await sendMessageToTab('toggleLogo', { enabled: logoEnabled });
    } catch (err) {
    }
  });

  document.getElementById('toggle-ads').addEventListener('change', async (e) => {
    const adBlockEnabled = e.target.checked;
    await saveSettings({ ...settings, adBlockEnabled });

    chrome.runtime.sendMessage({ action: 'toggleAds', data: { enabled: adBlockEnabled } });

    try {
      await sendMessageToTab('toggleAds', { enabled: adBlockEnabled });
    } catch (err) {
    }
  });

  document.getElementById('toggle-pip').addEventListener('change', async (e) => {
    const pipEnabled = e.target.checked;
    await saveSettings({ ...settings, pipEnabled });
    try {
      await sendMessageToTab('togglePip', { enabled: pipEnabled });
    } catch (err) {
    }
  });

  document.getElementById('toggle-shorts-scroll').addEventListener('change', async (e) => {
    const shortsAutoScrollEnabled = e.target.checked;
    await saveSettings({ ...settings, shortsAutoScrollEnabled });
    try {
      await sendMessageToTab('toggleShortsAutoScroll', { enabled: shortsAutoScrollEnabled });
    } catch (err) {
    }
  });

  const pipBtn = document.getElementById('pip-btn');
  pipBtn.addEventListener('click', async () => {
    pipBtn.disabled = true;
    pipBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="8"/>
      </svg>
      <span>Opening...</span>
    `;

    try {
      await sendMessageToTab('openPip');
      setTimeout(() => {
        window.close();
      }, 400);
    } catch (err) {
      pipBtn.disabled = false;
      pipBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="4" width="16" height="12" rx="2"/>
          <rect x="12" y="10" width="10" height="10" rx="2"/>
        </svg>
        <span>Not on YouTube</span>
      `;
      setTimeout(() => {
        pipBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="4" width="16" height="12" rx="2"/>
            <rect x="12" y="10" width="10" height="10" rx="2"/>
          </svg>
          <span>Open PIP</span>
        `;
      }, 1500);
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
