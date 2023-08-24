const main = registerModule(
    "main",
    "Main",
    "Default commands"
)

main.registerCommand("this", "Open this project on github", async (full, rest) => {
    window.location.href = "J0J0HA/terminal";
    out("Please wait...");
})

main.registerCommand("y", "Execute the y command", async (full, rest) => {
    if (rest) {
        y_command = rest;
    } else {
        runCommand(y_command);
    }
})

main.registerCommand("copy", "Run this to copy if copying failed before", async (full, rest) => {
    if (rest) {
        copyToClipboard(rest);
    } else {
        copyToClipboard(last_copy);
    }
    out(`Copied to clipboard: ${last_copy}`);
})

main.registerCommand("do", "Execute the following command", async (full, rest) => {
    runCommand(rest);
})

main.registerCommand("help", "Show availible commands or the description of a specific command", async (full, rest) => {
    if (rest) {
        out(commands[rest].description)
    } else {
        out("The following commands are availible:");
        for (let [command, details] of Object.entries(commands)) {
            out(`- ${command} (${details.description})`);
        }
    }
})

main.registerCommand("open", "Open the provided href", async (full, rest) => {
    window.location.href = rest;
    out("Please wait...");
})

main.registerCommand("sleep", "Do nothing and relax for the given amount of ms", async (full, rest) => {
    await sleep(parseInt(rest));
})

loadFile("module/github.js");
loadFile("module/you.js");
loadFile("module/google.js");
loadFile("module/openai.js");
loadFile("module/shortlinks.js");
loadFile("module/youtube.js");
loadFile("module/twitch.js");
loadFile("module/webdev.js");

main.registerCommand("command_not_found", "[INTERNAL] Show notice that a command was not found.", async (full, rest) => {
    out(`The command "${rest}" could not be found. Did you mean "help"?`);
    y_command = "help"
})
