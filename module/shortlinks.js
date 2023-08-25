const shortlinks = registerModule(
    "shortlinks",
    "Shortlink Commands",
    "Provides commands to generate shortlinks on is.gd and v.gd"
)

shortlinks.registerCommand("short", "Shorten a link on is.gd", async (full, rest) => {
    if (rest) {
        const json = await (await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(rest)}`)).json();
        if (json.errormessage) {
            out("Failed: " + json.errormessage);
        }
        out("The link is: " + json.shorturl);
        copyToClipboard(json.shorturl);
    } else {
        window.modifyHref("https://is.gd/");
    }
})

shortlinks.registerCommand("shortv", "Shorten a link on v.gd", async (full, rest) => {
    if (rest) {
        const json = await (await fetch(`https://v.gd/create.php?format=json&url=${encodeURIComponent(rest)}`)).json();
        if (json.errormessage) {
            out("Failed: " + json.errormessage);
        }
        out("The link is: " + json.shorturl);
        copyToClipboard(json.shorturl);
    } else {
        window.modifyHref("https://v.gd/");
    }
})
