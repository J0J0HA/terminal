const you = registerModule(
    "you",
    "You.com",
    "You.com related commands"
)

you.registerCommand("you", "Search with youchat", async (full, rest) => {
    if (rest) {
        window.location.href = `https://you.com/search?q=${encodeURIComponent(rest)}&tbm=youchat&fromExtension=true`;
    } else {
        window.location.href = "https://you.com/"
    }
    out("Please wait...");
})

you.registerCommand("u", "Alias: you", alias("you"))

you.registerCommand("you-search", "Search on you", async (full, rest) => {
    if (rest) {
        window.location.href = `https://you.com/search?q=${encodeURIComponent(rest)}&fromExtension=true`;
    } else {
        window.location.href = "https://you.com/"
    }
    out("Please wait...");
})

you.registerCommand("us", "Alias: you-search", alias("you-search"))

you.registerCommand("chat", "Open a specific you-chat session or you-chat", async (full, rest) => {
    if (rest) {
        window.location.href = `https://you.com/search?q=Loading...&cid=${rest}&tbm=youchat`;
    } else {
        window.location.href = "https://you.com/chat";
    }
})

you.registerCommand("command_not_found", "Override command fail recommendation", async (full, rest) => {
    out(`The command "${rest}" could not be found. Did you mean "u ${rest}"?`);
    y_command = "u " + rest
})
