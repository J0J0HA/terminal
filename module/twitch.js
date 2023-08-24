const twitch = registerModule(
    "twitch",
    "Twitch",
    "Search People and Categorys on Twitch"
)

twitch.registerCommand("tw", "Open Twitch or search on it", async (full, rest) => {
    if (rest) {
        window.location.href = `https://www.twitch.tv/search?term=${encodeURIComponent(rest)}`;
    } else {
        window.location.href = "https://www.twitch.tv/"
    }
    out("Please wait...");
})

twitch.registerCommand("twac", "Show a twitch profile", async (full, rest) => {
    if (rest) {
        window.location.href = `https://www.twitch.tv/${encodeURIComponent(rest)}`;
        out("Please wait...");
    } else {
        out("You need to specify a name.");
    }
})

const TWCAT_SHORT = {
    "mc": "minecraft",
    "dev": "software-and-game-development",
    "pydev": "software-and-game-development?tl=python",
    "jsdev": "software-and-game-development?tl=JavaScript"
}

twitch.registerCommand("twcat", "Show a twitch category", async (full, rest) => {
    if (rest) {
        window.location.href = `https://www.twitch.tv/directory/category/${TWCAT_SHORT[rest] || rest}`;
    } else {
        window.location.href = "https://www.twitch.tv/directory/category/"
    }
    out("Please wait...");
})

twitch.registerCommand("twcat-all", "List availible twitch categories", async (full, rest) => {
    out("The following categories are availible:");
    for (let category of Object.keys(TWCAT_SHORT)) {
        out(`- ${category}`);
    }
})