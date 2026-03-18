chrome.runtime.onInstalled.addListener(async () => {
  console.log('[YT Premium Experience] Installing AdGuard blocking rules...');

  try {
    const rules = await chrome.declarativeNetRequest.getDynamicRules();
    const ruleIds = rules.map(rule => rule.id);
    if (ruleIds.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ruleIds
      });
    }
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: ['adguard_rules']
    });

    console.log('[YT Premium Experience] AdGuard rules registered successfully!');
  } catch (error) {
    console.error('[YT Premium Experience] Error registering rules:', error);
  }
});
chrome.declarativeNetRequest.onRuleMatchedDebug?.addListener((details) => {
  console.log('[YT Premium Experience] Blocked request:', details.request.url);
});
