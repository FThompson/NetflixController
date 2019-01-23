let enableButton = document.getElementById('enable')
enableButton.onclick = function() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.executeScript(
            tabs[0].id,
            { code: 'alert("Not implemented.")' }
        );
    });
}