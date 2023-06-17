function handleMessage(req, sender, response) {
    let port = browser.runtime.connect({name: "port-intercept" });
    port.postMessage(req);
}

browser.runtime.onMessage.addListener(handleMessage);