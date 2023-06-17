function initializePanel() {
    console.log("initialize");
}

function uninitializePanel() {
    console.log("uninitialize");
}

browser.devtools.panels.create(
    "Gateway Inspector",
    "/icons/anchor.png",
    "/devtools/panel/panel.html"
).then((panel) => {
    panel.onShown.addListener(initializePanel);
    panel.onHidden.addListener(uninitializePanel);
});
