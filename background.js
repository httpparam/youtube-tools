// Background service worker for YouTube Premium Experience
// Registers AdGuard-style blocking rules using declarativeNetRequest API

// Initialize the extension
chrome.runtime.onInstalled.addListener(async () => {
  console.log('[YT Premium Experience] Installing AdGuard blocking rules...');

  try {
    // Register the declarativeNetRequest rules
    const rules = await chrome.declarativeNetRequest.getDynamicRules();
    const ruleIds = rules.map(rule => rule.id);

    // Remove any existing dynamic rules
    if (ruleIds.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ruleIds
      });
    }

    // Get static rules from rules.json and enable them
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: ['adguard_rules']
    });

    console.log('[YT Premium Experience] AdGuard rules registered successfully!');
    console.log('[YT Premium Experience] Active blocking rules: 30+ ad server patterns');
  } catch (error) {
    console.error('[YT Premium Experience] Error registering rules:', error);
  }
});

// Log when rules are successfully applied
chrome.declarativeNetRequest.onRuleMatchedDebug?.addListener((details) => {
  console.log('[YT Premium Experience] Blocked request:', details.request.url);
});

console.log('[YT Premium Experience] Background service worker loaded');
