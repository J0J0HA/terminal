/**
 * @file modules.js
 * @description Default modules
 * @requires main.js
 */

/**
 * @type {InstalledModule}
 */
const main = gterminal.modules.register(
    "main",
    "Main",
    "Default commands"
)

/**
 * @type {InstalledModule}
 */
const modules = gterminal.modules.register(
    "modules",
    "Module Manager",
    "Manage modules"
)

modules.registerCommand("modules", "Manage modules", async (full, rest) => {
    let srest = rest.split(" ");
    if (srest[0] == "tmpinstall") {
        gterminal.utils.loadFile(srest[1]);
        gterminal.io.println("File was added for this session.");
    }
    else if (srest[0] == "install") {
        gterminal.modules.loadModule(srest[1]);
        gterminal.config.addToList("installed_modules", srest[1]);
        gterminal.io.println("Module was added.");
    }
    else if (srest[0] == "add-repo") {
        gterminal.modules.loadRepo(srest[1]);
        gterminal.config.addToList("added_repos", srest[1]);
        gterminal.io.println("Repo was added.");
    }
    else if (srest[0] == "remove-repo") {
        gterminal.config.removeFromList("added_repos", srest[1]);
        gterminal.io.println("Repo was removed.");
    }
    else if (srest[0] == "remove") {
        gterminal.config.removeFromList("installed_modules", srest[1]);
        gterminal.io.println("Module was removed.");
    }
    else if (srest[0] == "list") {
        gterminal.io.println("Installed modules:");
        for (let module of Object.values(gterminal.modules.modules)) {
            gterminal.io.println(`- ${module.name} [${module.id}]`);
        } 
        if (gterminal.modules.modules.length == 0) {
            gterminal.io.println("No modules installed.");
        }
        gterminal.io.println("Added repos:");
        for (let repo of Object.values(gterminal.modules.repos)) {
            gterminal.io.println(`- ${repo.name} [${repo.id}]`);
        }
        if (gterminal.modules.repos.length == 0) {
            gterminal.io.println("No repos added.");
        }
    }
    gterminal.config.save();
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

let repo_list = gterminal.config.get("added_repos", [
    "https://gterminal.is-a.dev/modules/repo.json"
]);
gterminal.config.set("added_repos", repo_list);

let module_list = gterminal.config.get("installed_modules", [
    // "main:github",
    // "main:you",
    // "main:google",
    // "main:openai",
    // "main:shortlinks",
    // "main:youtube",
    // "main:twitch",
    // "main:webdev"
]);
gterminal.config.set("installed_modules", module_list);
gterminal.config.save();

(async () => {
    for (let repo in repo_list) {
        await gterminal.modules.loadRepo(repo_list[repo]);
    }

    for (let module in module_list) {
        await gterminal.modules.loadModule(module_list[module]);
    }
    
    main.registerCommand("command_not_found", "[INTERNAL] Show notice that a command was not found.", async (full, rest) => {
        gterminal.io.println(`The command "${rest}" could not be found. Did you mean "help"?`);
        gterminal.commands.setY("help");
    })
})()


