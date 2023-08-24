let COMMANDS = {};

const sleep = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    })
}

const animateTitle = () => {
    document.querySelector("#title").innerText = "";
    // setTimeout(() => {
    //     document.querySelector("#title").innerText = "t"
    // }, 100)
    // setTimeout(() => {
    //     document.querySelector("#title").innerText = "TE"
    // }, 200)
    // setTimeout(() => {
    //     document.querySelector("#title").innerText = "TeR"
    // }, 300)
    // setTimeout(() => {
    //     document.querySelector("#title").innerText = "TerM"
    // }, 400)
    // setTimeout(() => {
    //     document.querySelector("#title").innerText = "TermI"
    // }, 500)
    // setTimeout(() => {
    //     document.querySelector("#title").innerText = "TermiN"
    // }, 600)
    // setTimeout(() => {
    //     document.querySelector("#title").innerText = "TerminA"
    // }, 700)
    // setTimeout(() => {
    //     document.querySelector("#title").innerText = "TerminaL"
    // }, 800)
    // setTimeout(() => {
    //     document.querySelector("#title").innerText = "Terminal"
    // }, 900)
}

const startTitleCursor = () => {
    setInterval(() => {
        document.querySelector("#title-cursor").innerText = "▐";
        setTimeout(() => {
            document.querySelector("#title-cursor").innerText = "";
        }, 300)
    }, 500)
}

const startTitleSandbox = () => {
    setInterval(() => {
        document.querySelector("title").innerText = document.querySelector("#title-simulator").innerText
    }, 50)
}

const out = (text) => {
    document.querySelector("#console").innerText += text;
    document.querySelector("#console").innerHTML += "<br>";
}

const ask = (prompt) => {
    document.querySelector("#console").innerText += "> "
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
                animateTitle();
            }
            if (event.key == "Enter") {
                resolve(input.innerText);
            }
            else if (event.key == "Escape") {
                document.querySelector("#console").innerText = "";
                reject("Escape");
                loop();
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

const setTriggers = () => {
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
}

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

const runCommand = async (command) => {
    if (command.startsWith("https://") || command.startsWith("http://")) {
        command = `open ${command}`;
    }
    let base_command = command.split(" ")[0];
    if (Object.keys(COMMANDS).indexOf(base_command) == -1) {
        command = "command_not_found " + command;
        base_command = "command_not_found";
    }
    await COMMANDS[base_command](command, command.substring(base_command.length + 1));
}

const loop = async () => {
    if (params.cmd) {
        out(`> ${params.cmd}`)
        await runCommand(params.cmd)
    }
    while (true) {
        let command = await ask();
        await runCommand(command);
    }
}

const setup = async () => {
    out("Starting 'Title Sandbox'...");
    startTitleSandbox();
    await sleep(100);
    out("Starting 'Title Cursor'...");
    await sleep(50);
    startTitleCursor();
    out("Starting 'Title Animation'...");
    await sleep(200);
    animateTitle();
    out("Setting Event Listeners...");
    await sleep(85);
    setTriggers();
    out("Starting REPL...");
    await sleep(250);
    document.querySelector("#console").innerText = "";
    await loop();
    out("If you see this, something has gone clearly wrong.");
}
