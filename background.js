let adBlockEnabled = true;

chrome.storage.sync.get(
  { adBlockEnabled: true },
  (settings) => {
    adBlockEnabled = settings.adBlockEnabled;
  }
);

chrome.runtime.onInstalled.addListener(async () => {
  try {
    const rules = await chrome.declarativeNetRequest.getDynamicRules();
    const ruleIds = rules.map(rule => rule.id);
    if (ruleIds.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ruleIds
      });
    }

    chrome.storage.sync.get(
      { adBlockEnabled: true },
      async (settings) => {
        adBlockEnabled = settings.adBlockEnabled;
        if (adBlockEnabled) {
          await chrome.declarativeNetRequest.updateEnabledRulesets({
            enableRulesetIds: ['adguard_rules']
          });
        }
      }
    );
  } catch (error) {
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleAds') {
    adBlockEnabled = request.data.enabled;

    chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: adBlockEnabled ? ['adguard_rules'] : [],
      disableRulesetIds: adBlockEnabled ? [] : ['adguard_rules']
    }).then(() => {
      sendResponse({ success: true });
    }).catch((error) => {
      sendResponse({ success: false, error: error.message });
    });

    return true;
  }

  return false;
});
