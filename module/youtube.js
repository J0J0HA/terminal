const youtube = registerModule(
    "youtube",
    "YouTube",
    "YouTube related commands"
)

youtube.registerCommand("youtube", "Search with youchat", async (full, rest) => {
    if (rest) {
        window.modifyHref(`https://www.youtube.com/results?search_query=${encodeURIComponent(rest)}`);
    } else {
        window.location.href = "https://www.youtube.com/"
    }
    out("Please wait...");
})

youtube.registerCommand("yt", "Alias: youtube", alias("youtube"))