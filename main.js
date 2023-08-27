const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

const gterminal = {
    api_version: "1.3",
    clipboard: {
        copy: (text) => {
            gterminal.clipboard.last_copy = text;
            let textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        },
        recopy: () => {
            gterminal.clipboard.copy(gterminal.clipboard.last_copy);
        },
        last_copy: ""
    },
    web: {
        goto: (href) => {
            window.location.href = href;
        },
        newTab: (url) => {
            window.open(url, "_blank");
        },
        newWindow: (url) => {
            window.open(url);
        }
    },
    title: {
        set: (title) => {
            document.querySelector("title").innerText = title;
        },
        setContent: (title) => {
            document.querySelector("#title").innerText = title;
        },
        reset: () => {
            document.querySelector("#title").innerText = "";
        },
        _: {
            titleCursor: () => {
                document.querySelector("#title-cursor").innerText = " ▌";
                setTimeout(() => {
                    document.querySelector("#title-cursor").innerText = "   ";
                }, 300)
            },
            startTitleCursor: () => {
                return setInterval(gterminal.title._.titleCursor, 500)
            },
            titleSandbox: () => {
                gterminal.title.set(document.querySelector("#title-simulator").innerText);
            },
            startTitleSandbox: () => {
                return setInterval(gterminal.title._.titleSandbox, 50)
            }
        }
    },
    modules: {
        register: (id, name, description) => {
            gterminal.modules.all[id] = {
                name,
                description,
                commands: {},
                id,
                registerCommand: (cmd, description, handler) => {
                    gterminal.modules.all[id].commands[cmd] = {
                        handler: handler,
                        description: description
                    };
                    gterminal.commands.all[cmd] = gterminal.modules.all[id].commands[cmd]
                },
                registerAlias: (cmd, target) => {
                    gterminal.modules.all[id].commands[cmd] = gterminal.modules.all[id].commands[target];
                    gterminal.commands.all[cmd] = gterminal.modules.all[id].commands[cmd];
                }
            }
            return gterminal.modules.get(id);
        },
        get: (id) => {
            return gterminal.modules.all[id];
        },
        all: {}
    },
    utils: {
        loadFile: (url) => {
            return new Promise((resolve, reject) => {
                const script_tag = document.createElement("script");
                script_tag.src = url;
                script_tag.onload = resolve;
                script_tag.onerror = reject;
                document.head.appendChild(script_tag);
            })
        },
        sleep: (ms) => {
            return new Promise((resolve, reject) => {
                setTimeout(resolve, ms);
            })
        }
    },
    io: {
        clear: () => {
            document.querySelector("#console").innerText = "";
        },
        print: (text) => {
            document.querySelector("#console").innerText += text;
        },
        println: (text) => {
            gterminal.io.print(text + "\n");
        },
        input: (prompt) => {
            document.querySelector("#console").innerHTML += prompt || ">&nbsp;"
            const input = document.createElement("span");
            input.classList.add("input");
            input.classList.add("active");
            input.contentEditable = true;
            document.querySelector("#console").appendChild(input);
            return new Promise((resolve, reject) => {
                const keydown = (event) => {
                    if (event.key == "Enter" || event.key == "Escape") {
                        input.removeEventListener("keydown", keydown);
                        input.removeEventListener("keyup", keyup);
                        document.querySelector("#console").innerHTML += "<br>";
                        localStorage.setItem("lastCommand", input.innerText);
                        event.preventDefault();
                        input.classList.remove("active");
                        input.contentEditable = false;
                        gterminal.title.reset();
                    }
                    if (event.key == "Enter") {
                        resolve(input.innerText);
                    }
                    else if (event.key == "Escape") {
                        document.querySelector("#console").innerText = "";
                        reject("Escape");
                        gterminal._.loop();
                    }
                    else if (event.key == "ArrowUp") {
                        input.innerText = localStorage.getItem("lastCommand");
                    }
                    else if (event.key == "ArrowDown") {
                        input.innerText = "";
                    }
                };
                const keyup = (event) => {
                    document.querySelector("#title").innerText = input.innerText;
                };
                input.addEventListener("keydown", keydown)
                input.addEventListener("keyup", keyup)
            })
        }
    },
    commands: {
        exec: async (command) => {
            if (command.startsWith("https://") || command.startsWith("http://")) {
                command = `open ${command}`;
            }
            let base_command = command.split(" ")[0];
            if (Object.keys(gterminal.commands.all).indexOf(base_command) == -1) {
                command = "command_not_found " + command;
                base_command = "command_not_found";
            }
            await gterminal.commands.all[base_command].handler(command, command.substring(base_command.length + 1));
        },
        _: {
            y: ""
        },
        setY: (command) => {
            gterminal.commands._.y = command;
        },
        getY: () => {
            return gterminal.commands._.y;
        },
        all: {}
    },
    _: {
        setTriggers: () => {
            document.querySelector("body").addEventListener("click", () => {
                const input = document.querySelector(".input.active");
                input.focus();
                input.scrollIntoView();
            });

            document.querySelector("body").addEventListener("keydown", (event) => {
                const input = document.querySelector(".input.active");
                if (input.innerText == "") {
                    input.focus();
                }
            });
        },
        loop: async () => {
            if (params.cmd) {
                out(`> ${params.cmd}`)
                await gterminal.commands.exec(params.cmd)
            }
            while (true) {
                let command = await gterminal.io.input();
                await gterminal.commands.exec(command);
            }
        }
    },
    setup: async () => {
        gterminal.io.println("Starting 'Title Sandbox'...");
        gterminal.title._.startTitleSandbox();
        gterminal.io.println("Starting 'Title Cursor'...");
        gterminal.title._.startTitleCursor();
        gterminal.io.println("Starting 'Title Animation'...");
        gterminal.title.reset();
        gterminal.io.println("Setting Event Listeners...");
        gterminal._.setTriggers();
        gterminal.io.println("Loading Commands...");
        gterminal.utils.loadFile("modules.js");
        gterminal.io.println("Starting REPL...");
        gterminal.io.clear();
        await gterminal._.loop();
        gterminal.io.println("If you see this, something has gone clearly wrong.");
    },
    init: () => {
        document.addEventListener("DOMContentLoaded", gterminal.setup);
    }
}

gterminal.init();
