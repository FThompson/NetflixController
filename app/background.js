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
        ])
    })
})

// inform the content script of any changes to the netflix's url path
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.active && tab.status === 'complete' && changeInfo.status && changeInfo.status === 'complete') {
        let url = new URL(tab.url)
        if (url.hostname.endsWith('.netflix.com') && !url.hostname.startsWith('help.')) {
            chrome.tabs.sendMessage(tabId, {'path': url.pathname})
        }
    }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fullscreen') {
        setFullScreen(sender.tab.id)
    }
})

// uses chrome.debugger to send trusted event, which is needed for setting fullscreen
// via https://stackoverflow.com/a/53488689/1247781
function setFullScreen(tabId) {
    let debuggee = {tabId: tabId}
    chrome.debugger.attach(debuggee, '1.3', () => {
        chrome.debugger.sendCommand(debuggee, 'Input.dispatchKeyEvent', {
            type: 'rawKeyDown',
            nativeVirtualKeyCode: 70,
            windowsVirtualKeyCode: 70,
        }, () => {
            // detach immediately to avoid interrupting user experience with page-being-debugged popup
            chrome.debugger.detach(debuggee)
        })
    })
}