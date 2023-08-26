const main = registerModule(
    "main",
    "Main",
    "Default commands"
)

const modulesman = registerModule(
    "modules",
    "Module Manager",
    "Manage modules"
)

modulesman.registerCommand("modules", "Manage modules", async (full, rest) => {
    let srest = rest.split(" ");
    if (srest[0] == "tmpinstall") {
        loadFile(srest[1]);
        out("File was added for this session.");
    }
    else if (srest[0] == "install") {
        loadFile(srest[1]);
        let module_list = JSON.parse(localStorage.getItem("modules") || "[]");
        module_list.push(srest[1]);
        localStorage.setItem("modules", JSON.stringify(module_list));
        out("Module was added.");
    }
    else if (srest[0] == "list") {
        let module_list = JSON.parse(localStorage.getItem("modules") || "[]");
        out("These 3rd-party modules are installed globally:");
        for (let module in module_list) {
            out(`[${module}] ${module_list[module]}`)
        }
        out("You can use 'y [index]' to uninstall the corresponding module.");
        y_command = "modules uninstall-index ";
    }
    else if (srest[0] == "uninstall") {
        let module_list = JSON.parse(localStorage.getItem("modules") || "[]");
        const index = array.indexOf(srest[1]);
        if (index !== -1) {
            module_list.splice(index, 1);
            localStorage.setItem("modules", JSON.stringify(module_list));
            out("Module was removed.");
        } else {
            out("Module not found.");
        }
    }
    else if (srest[0] == "uninstall-index") {
        let module_list = JSON.parse(localStorage.getItem("modules") || "[]");
        if (module_list.length > parseInt(srest[1])) {
            module_list.splice(parseInt(srest[1]), 1);
            localStorage.setItem("modules", JSON.stringify(module_list));
            out("Module was removed.");
        } else {
            out("Module not found.");
        }
    }
})

main.registerCommand("this", "Open this project on github", async (full, rest) => {
    window.modifyHref("https://github.com/gterminal-project/");
    out("Please wait...");
})

main.registerCommand("y", "Execute the y command", async (full, rest) => {
    runCommand(y_command + rest);
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
    window.modifyHref(rest);
    out("Please wait...");
})

main.registerCommand("sleep", "Do nothing and relax for the given amount of ms", async (full, rest) => {
    await sleep(parseInt(rest));
})

loadFile("https://gterminal.is-a.dev/modules/module/github.js");
loadFile("https://gterminal.is-a.dev/modules/module/you.js");
loadFile("https://gterminal.is-a.dev/modules/module/google.js");
loadFile("https://gterminal.is-a.dev/modules/module/openai.js");
loadFile("https://gterminal.is-a.dev/modules/module/shortlinks.js");
loadFile("https://gterminal.is-a.dev/modules/module/youtube.js");
loadFile("https://gterminal.is-a.dev/modules/module/twitch.js");
loadFile("https://gterminal.is-a.dev/modules/module/webdev.js");

for (let url of JSON.parse(localStorage.getItem("modules") || "[]")) {
    loadFile(url);
}

main.registerCommand("command_not_found", "[INTERNAL] Show notice that a command was not found.", async (full, rest) => {
    out(`The command "${rest}" could not be found. Did you mean "help"?`);
    y_command = "help"
})
