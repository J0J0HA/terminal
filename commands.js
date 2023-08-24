let LAST_COPY = "";
let Y_COMMAND = "";

function copyToClipboard(text) {
    LAST_COPY = text;
    var textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

COMMANDS["help"] = async (full, rest) => {
    out("There is no help.");
}

COMMANDS["all"] = async (full, rest) => {
    out("The following commands are availible:");
    for (let command of Object.keys(COMMANDS)) {
        out(`- ${command}`);
    }
}

COMMANDS["command_not_found"] = async (full, rest) => {
    out(`The command "${rest}" could not be found. Did you mean "u ${rest}"?`);
    Y_COMMAND = "u " + rest
}

COMMANDS["do"] = async (full, rest) => {
    runCommand(rest);
}

COMMANDS["y"] = async (full, rest) => {
    out("WHY?");
    if (rest) {
        Y_COMMAND = rest;
    } else {
        runCommand(Y_COMMAND);
    }
}

COMMANDS["why"] = COMMANDS["y"]

COMMANDS["what"] = async (full, rest) => {
    if (rest) {
        Y_COMMAND = rest;
        out("Will remember...")
    } else {
        out(Y_COMMAND)
    }
}

COMMANDS["copy"] = async (full, rest) => {
    if (rest) {
        copyToClipboard(rest);
    } else {
        copyToClipboard(LAST_COPY);
    }
    out(`Copied to clipboard: ${LAST_COPY}`);
}

COMMANDS["you"] = async (full, rest) => {
    if (rest) {
        window.location.href = `https://you.com/search?q=${encodeURIComponent(rest)}&tbm=youchat&fromExtension=true`;
    } else {
        window.location.href = "https://you.com/"
    }
    out("Please wait...");
}

COMMANDS["u"] = COMMANDS["you"]

COMMANDS["younochat"] = async (full, rest) => {
    if (rest) {
        window.location.href = `https://you.com/search?q=${encodeURIComponent(rest)}&fromExtension=true`;
    } else {
        window.location.href = "https://you.com/"
    }
    out("Please wait...");
}

COMMANDS["unc"] = COMMANDS["younochat"]

COMMANDS["goog"] = async (full, rest) => {
    if (rest) {
        window.location.href = `https://www.google.com/search?client=firefox-b-d&q=${encodeURIComponent(rest)}`;
    } else {
        window.location.href = "https://www.google.com/"
    }
    out("Please wait...");
}

COMMANDS["yt"] = async (full, rest) => {
    if (rest) {
        window.location.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(rest)}`;
    } else {
        window.location.href = "https://www.youtube.com/"
    }
    out("Please wait...");
}

COMMANDS["tw"] = async (full, rest) => {
    if (rest) {
        window.location.href = `https://www.twitch.tv/search?term=${encodeURIComponent(rest)}`;
    } else {
        window.location.href = "https://www.twitch.tv/"
    }
    out("Please wait...");
}

COMMANDS["twac"] = async (full, rest) => {
    if (rest) {
        window.location.href = `https://www.twitch.tv/${encodeURIComponent(rest)}`;
        out("Please wait...");
    } else {
        out("You need to specify a name.");
    }
}

TWCAT_SHORT = {
    "mc": "minecraft",
    "dev": "software-and-game-development",
    "pydev": "software-and-game-development?tl=python",
    "jsdev": "software-and-game-development?tl=JavaScript"
}

COMMANDS["twcat"] = async (full, rest) => {
    if (rest) {
        window.location.href = `https://www.twitch.tv/directory/category/${TWCAT_SHORT[rest] || rest}`;
    } else {
        window.location.href = "https://www.twitch.tv/directory/category/"
    }
    out("Please wait...");
}

COMMANDS["twcat-all"] = async (full, rest) => {
    out("The following categories are availible:");
    for (let category of Object.keys(TWCAT_SHORT)) {
        out(`- ${category}`);
    }
}

COMMANDS["gh"] = async (full, rest) => {
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
}

COMMANDS["gist"] = async (full, rest) => {
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
}

COMMANDS["wa"] = async (full, rest) => {
    window.location.href = "https://web.whatsapp.com/"
    out("Please wait...");
}

COMMANDS["jx"] = async (full, rest) => {
    window.location.href = "https://jojojux.de/"
    out("Please wait...");
}

COMMANDS["bday"] = async (full, rest) => {
    window.location.href = "https://youtu.be/n3qw7lZzbkM"
    out("Please wait...");
}

COMMANDS["reload"] = async (full, rest) => {
    window.location.reload();
    out("Please wait...");
}

COMMANDS["refresh"] = COMMANDS["reload"];
COMMANDS["update"] = COMMANDS["reload"];

COMMANDS["keycode"] = async (full, rest) => {
    window.location.href = `https://keycode.info/`;
    out("Please wait...");
}

COMMANDS["pen"] = async (full, rest) => {
    window.location.href = `https://pen.new/`;
    out("Please wait...");
}

COMMANDS["nggyu"] = async (full, rest) => {
    window.location.href = "https://jojojux.de/info";
}

COMMANDS["sleep"] = (full, rest) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, parseInt(rest));
    })
}

COMMANDS["short"] = async (full, rest) => {
    if (rest) {
        const json = await (await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(rest)}`)).json();
        if (json.errormessage) {
            out("Failed: " + json.errormessage);
        }
        out("The link is: " + json.shorturl);
        copyToClipboard(json.shorturl);
    } else {
        window.location.href = "https://is.gd/";
    }
}

COMMANDS["shortv"] = async (full, rest) => {
    if (rest) {
        const json = await (await fetch(`https://v.gd/create.php?format=json&url=${encodeURIComponent(rest)}`)).json();
        if (json.errormessage) {
            out("Failed: " + json.errormessage);
        }
        out("The link is: " + json.shorturl);
        copyToClipboard(json.shorturl);
    } else {
        window.location.href = "https://v.gd/";
    }
}

COMMANDS["open"] = async (full, rest) => {
    window.location.href = rest;
}

COMMANDS["chatgpt"] = async (full, rest) => {
    if (rest) {
        const srest = rest.split("/");
        if (srest[1]) {
            if (srest[0] == "c") {
                window.location.href = `https://chat.openai.com/c/${srest[1]}`;
            } else if (srest[0] == "share") {
                window.location.href = `https://chat.openai.com/share/${srest[1]}`;
            }
        } else {
            window.location.href = `https://chat.openai.com/c/${srest[0]}`;
        }
    } else {
        window.location.href = "https://chat.openai.com/";
    }
}

COMMANDS["chat"] = async (full, rest) => {
    if (rest) {
        window.location.href = `https://you.com/search?q=Loading...&cid=${rest}&tbm=youchat`;
    } else {
        window.location.href = "https://you.com/chat";
    }
}

COMMANDS["wws"] = async (full, rest) => {
    window.location.href = `https://wwschool.de/`;
}
