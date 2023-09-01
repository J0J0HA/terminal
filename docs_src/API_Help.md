# API Help

You can find the JavaScript API in the {@link gterminal} constant.  
  
Here you find a list of all APIs available in gTerminal and a link to their documentation:

- `gterminal` -> {@link GTerminal}
- `gterminal.clipboard` -> {@link GTerminalClipboard}
- `gterminal.commands` -> {@link GTerminalCommands}
- `gterminal.config` -> {@link GTerminalConfig}
- `gterminal.io` -> {@link GTerminalIO}
- `gterminal.modules` -> {@link GTerminalModules}
- `gterminal.title` -> {@link GTerminalTitle}
- `gterminal.utils` -> {@link GTerminalUtils}
- `gterminal.web` -> {@link GTerminalWebController}

## Example Repo

```json
{
    "name": "Example Repo",
    "id": "example",
    "modules": {
        "google": {
            "name": "Google",
            "description": "Google related commands",
            "script": "https://server.with/path/to/module.js",
            "commands": {
                "google": {
                    "description": "Search on google",
                    "aliases": [
                        "goog"
                    ]
                }
            }
        }
    }
}
```

## Example Module

```javascript
// register the module
// The main: prefix means it is in the repository with the "example" id.
// google is the id of the module.
const google = gterminal.modules.register(
    "example:google"
)

// register the command "google"
// this requires the command to be defined in the repo.json
google.registerCommand("google", async (full, rest) => {
    if (rest) {
        gterminal.web.goto(`https://www.google.com/search?q=${encodeURIComponent(rest)}`);
    } else {
        gterminal.web.goto("https://www.google.com/")
    }
    gterminal.io.println("Please wait...");
})
```
