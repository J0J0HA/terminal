const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

/**
 * gTerminal JavaScript API for Clipboard
 */
class GTerminalClipboard {
    /** 
     * @constructor
    */
    constructor() {
        /**
         * Variable storing the last copied value
         */
        this.last_copy = "";
    }

    /**
     * Copy the given text
     * @param {string} text Text to copy
     */
    copy(text) {
        this.last_copy = text;
        let textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    /**
     * Copy the text stored in {@link GTerminalClipboard#last_copy}
     */
    recopy() {
        this.copy(this.last_copy);
    }
}

/** gTerminal JavaScript API for WebController */
class GTerminalWebController {
    /**
     * Go to a different page
     * @param {string} href HREF to Resource
     */
    goto(href) {
        window.location.href = href;
    }

    /**
     * Open a different page in a new tab
     * @param {string} url URL of Resource
     */
    newTab(url) {
        window.open(url, "_blank");
    }

    /**
     * Open a different page in a new window
     * @param {string} url URL of Resource
     */
    newWindow(url) {
        window.open(url);
    }
}

/** gTerminal JavaScript API for Title */
class GTerminalTitle {
    /**
     * Change the title text (ignoring sandbox)
     * @param {string} title new title text
     */
    _set(title) {
        document.querySelector("title").innerText = title;
    }

    /**
     * Change the title
     * @param {string} title new title
     */
    set(title) {
        document.querySelector("#title").innerText = title;
    }

    /**
     * Reset the title
     */
    reset() {
        document.querySelector("#title").innerText = "";
    }

    /**
     * Animate the cursor in the title
     */
    _titleCursor() {
        document.querySelector("#title-cursor").innerText = " ▌";
        setTimeout(() => {
            document.querySelector("#title-cursor").innerText = "   ";
        }, 300)
    }

    /**
     * Start repetitive animation of the cursor in the title; runs {@link GTerminalTitle#_titleCursor} every 500ms
     * @returns Interval ID
     */
    _startTitleCursor() {
        return setInterval(() => {
            this._titleCursor
        }, 500)
    }

    /**
     * Change the title to the text content of the title simulator
     */
    _titleSandbox() {
        this._set(document.querySelector("#title-simulator").innerText);
    }

    /**
     * Start repetitive copy of title simulator into title; runs {@link GTerminalTitle#_titleSandbox} every 50ms
     * @returns Interval ID
     */
    _startTitleSandbox() {
        return setInterval(() => {
            this._titleSandbox
        }, 50)
    }
}


/**
 * gTerminal JavaScript API for IO
 */
class GTerminalIO {
    /** 
     * @param {GTerminal} parent Parent GTerminal object
    */
    constructor(parent) {
        /** Parent {@link GTerminal} object */
        this.parent = parent;
    }

    /** Default font design */
    OUT = {
        bg: "black",
        fg: "lime"
    }

    /** Warning font design */
    WARN = {
        bg: "yellow",
        fg: "black",
        sel: {
            bg: "yellow",
            fg: "darkgrey"
        }
    }

    /** Error font design */
    ERROR = {
        bg: "black",
        fg: "red"
    }

    /**
     * Apply the desing object to an element
     * @param {HTMLElement} element Element to apply styles to
     * @param {object} design object containing font colors
     */
    _applyStyle(element, design) {
        if (design.bg) element.style.setProperty("--bg", design.bg);
        if (design.fg) element.style.setProperty("--fg", design.fg);
        if (design.sel) {
            if (design.sel.bg) element.style.setProperty("--sel-bg", design.sel.bg);
            if (design.sel.fg) element.style.setProperty("--sel-fg", design.sel.fg);
        }
    }

    /** Clear the console */
    clear() {
        document.querySelector("#console").innerText = "";
    }
    /** Print text to the console
     * @param {string} text The text to print to the console
     * @param {object} design object containing font colors
    */
    print(text, design = this.OUT) {
        const line = document.createElement("span");
        line.classList.add("line");
        this._applyStyle(line, design)
        line.innerText = text;
        document.querySelector("#console").appendChild(line);
    }
    /** Print text to the console, and add a trailing newline
     * @param {string} text The text to print to the console
     * @param {object} design object containing font colors
    */
    println(text, design = this.OUT) {
        this.print(text + "\n", design);
    }
    /** Request input
     * @param {string} prompt The prompt to print to the console
     * @param {object} prompt_design object containing font colors for the prompt
     * @param {object} input_design object containing font colors for the input
    */
    input(prompt = "> ", prompt_design = this.OUT, input_design = this.OUT) { // &nbsp;
        this.print(prompt, prompt_design)
        const input = document.createElement("span");
        input.classList.add("input");
        input.classList.add("active");
        this._applyStyle(input, input_design)
        input.contentEditable = true;
        document.querySelector("#console").appendChild(input);
        return new Promise((resolve, reject) => {
            const keydown = (event) => {
                if (event.key == "Enter" || event.key == "Escape") {
                    input.removeEventListener("keydown", keydown);
                    input.removeEventListener("keyup", keyup);
                    this.parent.io.println("");
                    localStorage.setItem("lastCommand", input.innerText);
                    event.preventDefault();
                    input.classList.remove("active");
                    input.contentEditable = false;
                    this.parent.title.reset();
                }
                if (event.key == "Enter") {
                    resolve(input.innerText);
                }
                else if (event.key == "Escape") {
                    document.querySelector("#console").innerText = "";
                    reject("Escape");
                    this.parent._loop();
                }
                else if (event.key == "ArrowUp") {
                    input.innerText = localStorage.getItem("lastCommand");
                }
                else if (event.key == "ArrowDown") {
                    input.innerText = "";
                }
            };
            const keyup = (event) => {
                this.parent.title.set(input.innerText);
            };
            input.addEventListener("keydown", keydown)
            input.addEventListener("keyup", keyup)
        })
    }
}

/**
 * gTerminal JavaScript API for Utils
 */
class GTerminalUtils {
    /**
     * load and run a JS file
     * @param {string} url URL of File to load
     * @returns {@type Promise}
     */
    loadFile(url) {
        return new Promise((resolve, reject) => {
            const script_tag = document.createElement("script");
            script_tag.src = url;
            script_tag.onload = resolve;
            script_tag.onerror = reject;
            document.head.appendChild(script_tag);
        })
    }

    /**
     * Wait for the given amount of ms
     * @param {Intenger} ms Amount of ms to wait
     * @returns {@type Promise}
     */
    sleep(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, ms);
        })
    }
}

/**
 * gTerminal Module Type
 */
class Module {
    /**
     * Represents a Module
     * @constructor
     * @param {GTerminal} parent Parent {@link GTerminal} object
     * @param {string} id Module ID
     * @param {string} name Module Name
     * @param {string} description Module Description
     */
    constructor(parent, id, name, description) {
        this.parent = parent;
        this.name = name;
        this.description = description;
        this.commands = {};
        this.id = id;
    }

    /**
     * Register a command
     * @param {string} cmd Command to register
     * @param {*} description Command description
     * @param {function} handler Handler for command
     */
    registerCommand(cmd, description, handler) {
        this.commands[cmd] = {
            handler: handler,
            description: description
        };
        this.parent.commands.all[cmd] = this.commands[cmd]
    }

    /**
     * Register an alias
     * @param {string} cmd Alias to register
     * @param {string} target Command to register the alias for
     */
    registerAlias(cmd, target) {
        this.commands[cmd] = this.commands[target];
        this.parent.commands.all[cmd] = this.commands[cmd];
    }

}

/**
 * gTerminal JavaScript API for Modules
 */
class GTerminalModules {
    /**
     * @constructor
     * @param {GTerminal} parent Parent {@link GTerminal} object
     */
    constructor(parent) {
        /**
         * Parent {@link GTerminal} object
         */
        this.parent = parent;
        /**
         * Object containing {@link Module}s linked by ID
         */
        this.modules = {};
    }

    /**
     * Register a module
     * @param {string} id ID of module to be registered
     * @param {string} name Name of module to be registered
     * @param {description} description Description of module to be registered
     * @returns {@type Module}
     */
    register(id, name, description) {
        this.modules[id] = new Module(this.parent, id, name, description);
        return this.get(id);
    }
    get(id) {
        return this.modules[id];
    }
}

/**
 * gTerminal JavaScript API for Commands
 */
class GTerminalCommands {
    /**
     * @constructor
     */
    constructor() {
        this._y = ""
        this.all = {}
    }

    /** execute the given command
     * @param {string} command Command to execute
     * @returns {@type Promise}
    */
    async exec(command) {
        if (command.startsWith("https://") || command.startsWith("http://")) {
            command = `open ${command}`;
        }
        let base_command = command.split(" ")[0];
        if (Object.keys(this.all).indexOf(base_command) == -1) {
            command = "command_not_found " + command;
            base_command = "command_not_found";
        }
        await this.all[base_command].handler(command, command.substring(base_command.length + 1));
    }

    /**
     * Set the Y command
     * @param {string} command Command to set as Y command
     */
    setY(command) {
        this._y = command;
    }

    /**
     * Get the Y command
     * @returns Y command
     */
    getY() {
        return this._y;
    }

    /**
     * Run the Y command
     * @returns {@type Promise}
     */
    runY() {
        return this.exec(this.getY());
    }
}

/**
 * gTerminal JavaScript API for Config
 */
class GTerminalConfig {
    /**
     * @constructor
     * @param {GTerminal} parent Parent {@link GTerminal} object
     */
    constructor(parent) {
        /** Parent {@link GTerminal} object */
        this.parent = parent;
        /** Config object */
        this.config = {};
    }

    /**
     * Load config from localStorage
     */
    load() {
        const data = localStorage.getItem("config");
        if (data) {
            try {
                this.config = JSON.parse(data);
            } catch (e) {
                this.parent.io.println("Failed to load config: " + e.toString(), gterminal.io.ERROR);
                console.error(e);
                this.config = {};
            }
        } else {
            this.parent.io.println("No config found.", gterminal.io.WARN);
            this.config = {};
        }
    }

    /**
     * Save config to localStorage
     */
    save() {
        localStorage.setItem("config", JSON.stringify(this.config.config));
    }
}

/**
 * gTerminal JavaScript API
 */
class GTerminal {
    /** 
     * @constructor
    */
    constructor() {
        /**
         * API Version
         */
        this.api_version = "1.3";

        /**
         * Access to the {@link GTerminalClipboard} API.
         * @type GTerminalClipboard
         */
        this.clipboard = new GTerminalClipboard();

        /**
         * Access to the {@link GTerminalWebController} API.
         * @type GTerminalWebController
         */
        this.web = new GTerminalWebController();

        /**
         * Access to the {@link GTerminalTitle} API.
         * @type GTerminalTitle
         */
        this.title = new GTerminalTitle();

        /**
         * Access to the {@link GTerminalIO} API.
         * @type GTerminalIO
         */
        this.io = new GTerminalIO(this);

        /**
         * Access to the {@link GTerminalUtils} API.
         * @type GTerminalUtils
         */
        this.utils = new GTerminalUtils();

        /**
         * Access to the {@link GTerminalModules} API.
         * @type GTerminalModules
         */
        this.modules = new GTerminalModules(this);

        /**
         * Access to the {@link GTerminalCommands} API.
         * @type GTerminalCommands
         */
        this.commands = new GTerminalCommands(this);

        /**
         * Access to the {@link GTerminalConfig} API.
         * @type GTerminalConfig
        */
        this.config = new GTerminalConfig(this);
    }

    /**
     * Set the triggers to autofocus input
     */
    _setTriggers() {
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

    /**
     * Start REPL
     */
    async _loop() {
        if (params.cmd) {
            out(`> ${params.cmd}`)
            await this.commands.exec(params.cmd)
        }
        while (true) {
            let command = await this.io.input();
            await this.commands.exec(command);
        }
    }

    /**
     * Set up the gTerminal environment
     */
    async setup() {
        this.io.println("Starting 'Title Sandbox'...");
        this.title._startTitleSandbox();
        this.io.println("Starting 'Title Cursor'...");
        this.title._startTitleCursor();
        this.io.println("Starting 'Title Animation'...");
        this.title.reset();
        this.io.println("Setting Event Listeners...");
        this._setTriggers();
        this.io.println("Loading Commands...");
        this.utils.loadFile("modules.js");
        this.io.println("Starting REPL...");
        this.io.clear();
        await this._loop();
        this.io.println("If you see this, something has gone clearly wrong.");
    }

    /**
     * Init gTerminal
     */
    init() {
        document.addEventListener("DOMContentLoaded", () => {
            this.setup();
        });
    }
}

/** Access to the {@link GTerminal} API */
const gterminal = new GTerminal();
gterminal.init();
