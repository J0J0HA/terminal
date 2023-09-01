/**
 * @file modules.js
 * @description Default modules
 * @requires main.js
 */

/**
 * @type {InstalledModule}
 * @private
 */

gterminal.modules.repos["_"] = new Repo(gterminal, "_", "_", {
    "main": {
        "name": "Main",
        "description": "Default commands",
        "script": "#",
        "commands": {
            "this": {
                "description": "Open this project on github"
            },
            "y": {
                "description": "Run the y command"
            },
            "copy": {
                "description": "Retry to copy the last copied value or copy the given value if present"
            },
            "apidocs": {
                "description": "Open the JavaScript docs"
            },
            "docs": {
                "description": "Open the wiki"
            },
            "open": {
                "description": "Open the URL provided"
            },
            "help": {
                "description": "Show all commands or description of a specific command"
            },
            "do": {
                "description": "Run the given command"
            },
            "sleep": {
                "description": "Wait the given amount of ms"
            }
        }
    },
    "modules": {
        "name": "Module Manager",
        "description": "Module management commands",
        "script": "#",
        "commands": {
            "modules": {
                "description": "Module management command"
            }
        }
    }
})

const main = gterminal.modules.register(
    "_:main"
)

/**
 * @type {InstalledModule}
 * @private
 */
const modules = gterminal.modules.register(
    "_:modules"
)

console.log(main, modules);

modules.registerCommand("modules", async (full, rest) => {
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

main.registerCommand("this", async (full, rest) => {
    gterminal.web.goto("https://github.com/gterminal-project/");
    gterminal.io.println("Please wait...");
})

main.registerCommand("docs", async (full, rest) => {
    gterminal.web.goto("https://github.com/gterminal-project/.github/wiki/Basics");
    gterminal.io.println("Please wait...");
})

main.registerCommand("apidocs", async (full, rest) => {
    gterminal.web.goto("docs");
    gterminal.io.println("Please wait...");
})

main.registerCommand("y", async (full, rest) => {
    gterminal.commands.exec(y_command + rest);
})

main.registerCommand("copy", async (full, rest) => {
    if (rest) {
        gterminal.clipboard.copy(rest);
    } else {
        gterminal.clipboard.recopy();
    }
    gterminal.io.println(`Copied to clipboard: ${gterminal.clipboard.last_copy}`);
})

main.registerCommand("do", async (full, rest) => {
    gterminal.commands.exec(rest);
})

main.registerCommand("help", async (full, rest) => {
    if (rest) {
        gterminal.io.println(gterminal.commands.exec)
    } else {
        gterminal.io.println("The following commands are availible:");
        let commands = [];
        for (let module of Object.values(gterminal.modules.modules)) {
            for (let command of Object.values(module.commands)) {
                gterminal.io.println(`- ${command.id} (${command.description}) [${command.module.id}]`);
            }
        }
    }
})

main.registerCommand("open", async (full, rest) => {
    gterminal.web.goto(rest);
    gterminal.io.println("Please wait...");
})

main.registerCommand("sleep", async (full, rest) => {
    await gterminal.utils.sleep(parseInt(rest));
})

