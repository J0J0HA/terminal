const google = registerModule(
    "google",
    "Google",
    "Google related commands"
)

google.registerCommand("google", "Search on google", async (full, rest) => {
    if (rest) {
        window.modifyHref(`https://www.google.com/search?q=${encodeURIComponent(rest)}`);
    } else {
        window.modifyHref("https://www.google.com/")
    }
    out("Please wait...");
})

google.registerCommand("goog", "Alias: google", alias("google"))