function main() {
    function handleDispatch(eventType, eventData) {
        document.body.dispatchEvent(new CustomEvent("from_server", {
            detail: {
                "event_type": eventType,
                "event_data": eventData
            }
        }));
    }

    function handleSend(msg) {
        document.body.dispatchEvent(new CustomEvent("to_server", {
            detail: {
                "data": JSON.parse(msg)
            }
        }));
    }

    let r; webpackChunkdiscord_app.push([[Symbol()], {}, x => r=x]);
    webpackChunkdiscord_app.pop();
    if (!r) return;
    let cache = Object.values(r.c);
    let socket;

    for (let m of cache) {
        try {
            if (!m.exports || m.exports === window) continue;
            for (let ex in m.exports) {
                if (m.exports?.[ex]?.setResumeUrl) {
                    socket = m.exports[ex];
                    break;
                }
            }
        } catch {}
    }

    window.discordSocket = socket;

    let o_handleDispatch = socket._handleDispatch;
    socket._handleDispatch = function(e, t, n) {
        handleDispatch(t, e);
        return o_handleDispatch.apply(this, arguments);
    }

    function checkOverrideSend() {
        if (socket._sendOverridden) return;
        socket._sendOverridden = true;
        let oSend = socket.webSocket.send;
        if (!oSend) return;
        socket.webSocket.send = function(msg) {
            handleSend(msg);
            return oSend.apply(this, arguments);
        }
    }

    let o_doFastConnectIdentify = socket._doFastConnectIdentify;
    socket._doFastConnectIdentify = function() {
        checkOverrideSend();
        return o_doFastConnectIdentify.apply(this, arguments);
    }
    let o_doResumeOrIdentify = socket._doResumeOrIdentify;
    socket._doResumeOrIdentify = function() {
        checkOverrideSend();
        return o_doResumeOrIdentify.apply(this, arguments);
    }
}

let script = document.createElement("script");
script.type = "text/javascript";
script.text = `(${main})();`;
let head = document.getElementsByTagName("head")[0];
head.insertBefore(script, head.firstChild);

document.body.addEventListener("from_server", (event) => {
    browser.runtime.sendMessage({
        "type": "from_server",
        "data": event.detail
    });
});

document.body.addEventListener("to_server", (event) => {
    browser.runtime.sendMessage({
        "type": "to_server",
        "data": event.detail
    });
});

browser.runtime.sendMessage({
    "type": "loaded",
    "data": {}
});
