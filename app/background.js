// enable toolbar icon only on *.netflix.com
chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { hostSuffix: '.netflix.com' },
                    })
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }
        ]);
    });
})

// inform the content script of any changes to the netflix's url path
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.active && tab.status === 'complete' && changeInfo.status && changeInfo.status === 'complete') {
        let url = new URL(tab.url)
        if (url.hostname.endsWith('.netflix.com') && !url.hostname.startsWith('help.')) {
            chrome.tabs.sendMessage(tabId, {'path': url.pathname})
        }
    }
});