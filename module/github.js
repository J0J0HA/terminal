const github = registerModule(
    "github",
    "GitHub",
    "GitHub related commands"
)

github.registerCommand("gh", "Open a specific GitHub resource", async (full, rest)=>{
    if (rest) {
        const srest = rest.split("/");
        if (srest[1]) {
            window.location.href = `https://github.com/${encodeURIComponent(srest[0] || "J0J0HA")}/${encodeURIComponent(srest[1])}`;
        } else {
            window.location.href = `https://github.com/${encodeURIComponent(srest[0] || "J0J0HA")}`;
        }
    } else {
        window.location.href = "https://github.com/"
    }
    out("Please wait...");
})

github.registerCommand("gist", "Open a specific gist or account", async (full, rest)=>{
    if (rest) {
        const srest = rest.split("/");
        if (srest[1]) {
            window.location.href = `https://gist.github.com/${encodeURIComponent(srest[0] || "J0J0HA")}/${encodeURIComponent(srest[1])}`;
        } else {
            window.location.href = `https://github.com/${encodeURIComponent(srest[0] || "J0J0HA")}`;
        }
    } else {
        window.location.href = "https://gist.github.com/"
    }
    out("Please wait...");
})
