let dataDisplay = document.getElementById("out");

const OPCODE_MAP = {
    "0": "DISPATCH",
    "1": "HEARTBEAT",
    "2": "IDENTIFY",
    "3": "PRESENCE_UPDATE",
    "4": "VOICE_STATE_UPDATE",
    "5": "VOICE_SERVER_PING",
    "6": "RESUME",
    "7": "RECONNECT",
    "8": "REQUEST_GUILD_MEMBERS",
    "9": "INVALID_SESSION",
    "10": "HELLO",
    "11": "HEARTBEAT_ACK",
    "13": "CALL_CONNECT",
    "14": "GUILD_SUBSCRIPTIONS",
    "15": "LOBBY_CONNECT",
    "16": "LOBBY_DISCONNECT",
    "17": "LOBBY_VOICE_STATES_UPDATE",
    "18": "STREAM_CREATE",
    "19": "STREAM_DELETE",
    "20": "STREAM_WATCH",
    "21": "STREAM_PING",
    "22": "STREAM_SET_PAUSED",
    "24": "REQUEST_GUILD_APPLICATION_COMMANDS",
    "25": "EMBEDDED_ACTIVITY_LAUNCH",
    "26": "EMBEDDED_ACTIVITY_CLOSE",
    "27": "EMBEDDED_ACTIVITY_UPDATE",
    "28": "REQUEST_FORUM_UNREADS",
    "29": "REMOTE_COMMAND",
    "30": "GET_DELETED_ENTITY_IDS_NOT_MATCHING_HASH",
    "31": "REQUEST_SOUNDBOARD_SOUNDS",
    "32": "SPEED_TEST_CREATE",
    "33": "SPEED_TEST_DELETE",
    "34": "REQUEST_LAST_MESSAGES",
    "35": "SEARCH_RECENT_MEMBERS",
};

function handleLoaded() {
    dataDisplay.innerHTML = "";
}

function handleSocketFromServer(msg) {
    let div = document.createElement("div");
    let el = document.createElement("pre");
    let eventType = msg.event_type;
    let eventData = msg.event_data;
    let js = $(el).jsonViewer(eventData, eventType, { collapsed: true });
    div.innerHTML = "<span id='arrow' style='color:#aa0000;'>↓</span>";
    div.appendChild(el);
    dataDisplay.appendChild(div);
}

function handleSocketToServer(data) {
    let div = document.createElement("div");
    let el = document.createElement("pre");
    let msg = data.data;
    let opCode = msg["op"];
    let opName = OPCODE_MAP[opCode.toString()];
    if (!opName) opName = `Unknown op ${opCode}`
    let js = $(el).jsonViewer(msg, opName, { collapsed: true });
    div.innerHTML = "<span id='arrow' style='color:#00ff00;'>↑</span>";
    div.appendChild(el);
    dataDisplay.appendChild(div);
}

function handleConnect(port) {
    port.onMessage.addListener((m) => {
        let portMsgType = m.type;
        let portMsgData = m.data;
        console.log(portMsgType);
        if (portMsgType === "loaded") {
            handleLoaded();
        } else if (portMsgType === "from_server") {
            handleSocketFromServer(portMsgData);
        } else if (portMsgType === "to_server") {
            console.log(m);
            handleSocketToServer(portMsgData);
        }
    })
}

browser.runtime.onConnect.addListener(handleConnect);
