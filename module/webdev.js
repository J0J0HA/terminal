const webdev = registerModule(
    "webdev",
    "WebDev Tools",
    "Tools for web developers"
)

webdev.registerCommand("pen", "Start a new codepen", async (full, rest) => {
    window.modifyHref(`https://pen.new/`);
    out("Please wait...");
})

webdev.registerCommand("keycode", "Open keycode explorer", async (full, rest) => {
    window.modifyHref(`https://keycode.info/`);
    out("Please wait...");
})
