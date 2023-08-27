const main = gterminal.modules.register(
    "main",
    "Main",
    "Default commands"
)

const modulesman = gterminal.modules.register(
    "modules",
    "Module Manager",
    "Manage modules"
)

modulesman.registerCommand("modules", "Manage modules", async (full, rest) => {
    let srest = rest.split(" ");
    if (srest[0] == "tmpinstall") {
        gterminal.utils.loadFile(srest[1]);
        gterminal.io.println("File was added for this session.");
    }
    else if (srest[0] == "install") {
        gterminal.utils.loadFile(srest[1]);
        let module_list = JSON.parse(localStorage.getItem("modules") || "[]");
        module_list.push(srest[1]);
        localStorage.setItem("modules", JSON.stringify(module_list));
        gterminal.io.println("Module was added.");
    }
    else if (srest[0] == "list") {
        let module_list = JSON.parse(localStorage.getItem("modules") || "[]");
        gterminal.io.println("These 3rd-party modules are installed globally:");
        for (let module in module_list) {
            gterminal.io.println(`[${module}] ${module_list[module]}`)
        }
        gterminal.io.println("You can use 'y [index]' to uninstall the corresponding module.");
        gterminal.commands.setY("modules uninstall-index ");
    }
    else if (srest[0] == "uninstall") {
        let module_list = JSON.parse(localStorage.getItem("modules") || "[]");
        const index = array.indexOf(srest[1]);
        if (index !== -1) {
            module_list.splice(index, 1);
            localStorage.setItem("modules", JSON.stringify(module_list));
            gterminal.io.println("Module was removed.");
        } else {
            gterminal.io.println("Module not found.");
        }
    }
    else if (srest[0] == "uninstall-index") {
        let module_list = JSON.parse(localStorage.getItem("modules") || "[]");
        if (module_list.length > parseInt(srest[1])) {
            module_list.splice(parseInt(srest[1]), 1);
            localStorage.setItem("modules", JSON.stringify(module_list));
            gterminal.io.println("Module was removed.");
        } else {
            gterminal.io.println("Module not found.");
        }
    }
})

main.registerCommand("this", "Open this project on github", async (full, rest) => {
    gterminal.web.goto("https://github.com/gterminal-project/");
    gterminal.io.println("Please wait...");
})

main.registerCommand("y", "Execute the y command", async (full, rest) => {
    gterminal.commands.exec(y_command + rest);
})

main.registerCommand("copy", "Run this to copy if copying failed before", async (full, rest) => {
    if (rest) {
        gterminal.clipboard.copy(rest);
    } else {
        gterminal.clipboard.recopy();
    }
    gterminal.io.println(`Copied to clipboard: ${gterminal.clipboard.last_copy}`);
})

main.registerCommand("do", "Execute the following command", async (full, rest) => {
    gterminal.commands.exec(rest);
})

main.registerCommand("help", "Show availible commands or the description of a specific command", async (full, rest) => {
    if (rest) {
        gterminal.io.println(commands[rest].description)
    } else {
        gterminal.io.println("The following commands are availible:");
        for (let [command, details] of Object.entries(commands)) {
            gterminal.io.println(`- ${command} (${details.description})`);
        }
    }
})

main.registerCommand("open", "Open the provided href", async (full, rest) => {
    gterminal.web.goto(rest);
    gterminal.io.println("Please wait...");
})

main.registerCommand("sleep", "Do nothing and relax for the given amount of ms", async (full, rest) => {
    await gterminal.utils.sleep(parseInt(rest));
})

gterminal.utils.loadFile("https://gterminal.is-a.dev/modules/module/github.js");
gterminal.utils.loadFile("https://gterminal.is-a.dev/modules/module/you.js");
gterminal.utils.loadFile("https://gterminal.is-a.dev/modules/module/google.js");
gterminal.utils.loadFile("https://gterminal.is-a.dev/modules/module/openai.js");
gterminal.utils.loadFile("https://gterminal.is-a.dev/modules/module/shortlinks.js");
gterminal.utils.loadFile("https://gterminal.is-a.dev/modules/module/youtube.js");
gterminal.utils.loadFile("https://gterminal.is-a.dev/modules/module/twitch.js");
gterminal.utils.loadFile("https://gterminal.is-a.dev/modules/module/webdev.js");

for (let url of JSON.parse(localStorage.getItem("modules") || "[]")) {
    gterminal.utils.loadFile(url);
}

main.registerCommand("command_not_found", "[INTERNAL] Show notice that a command was not found.", async (full, rest) => {
    gterminal.io.println(`The command "${rest}" could not be found. Did you mean "help"?`);
    gterminal.commands.setY("help");
})
