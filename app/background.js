const storage = LiveStorage;

chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === 'install') {
        storage.load().then(() => setDefaultSettings());
        setDefaultSettings();
    }
    setDeclarativeContent();
});

function setDefaultSettings() {
    for (let option of OPTIONS) {
        storage[option.storageArea][option.name] = option.default;
    }
}

// enable toolbar icon only on *.netflix.com
function setDeclarativeContent() {
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
}

// inform the content script of any changes to the netflix's url path
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.active && tab.status === 'complete' && changeInfo.status && changeInfo.status === 'complete') {
        let url = new URL(tab.url)
        if (url.hostname.endsWith('.netflix.com') && !url.hostname.startsWith('help.')) {
            chrome.tabs.sendMessage(tabId, { message: 'locationChanged', path: url.pathname})
        }
    }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'requestFullscreen') {
        // possible alternate approach I discovered after writing the debugger approach:
        // chrome.windows.getCurrent(window => chrome.windows.update(window.id, {state: 'fullscreen'}))
        // the above seems to crash netflix upon trying to exit fullscreen mode
        setFullScreen(sender.tab.id)
    } else if (request.message === 'mouseOver') {
        mouseOver(sender.tab.id, request.x, request.y);
    } else if (request.message === 'mouseOut') {
        mouseOut(sender.tab.id);
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

function mouseOver(tabId, x, y) {
    let debuggee = { tabId };
    chrome.debugger.attach(debuggee, '1.3', () => {
        let params = { type: 'mouseMoved', x, y };
        chrome.debugger.sendCommand(debuggee, 'Input.dispatchMouseEvent', params, () => {
            chrome.debugger.detach(debuggee);
        });
    });
}

function mouseOut(tabId) {
    mouseOver(tabId, 0, 0);
}