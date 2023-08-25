const openai = registerModule(
    "openai",
    "OpenAI",
    "OpenAI related commands"
)

openai.registerCommand("chatgpt", "Open a specific ChatGPT chat or ChatGPT", async (full, rest) => {
    if (rest) {
        const srest = rest.split("/");
        if (srest[1]) {
            if (srest[0] == "c") {
                window.modifyHref(`https://chat.openai.com/c/${srest[1]}`);
            } else if (srest[0] == "share") {
                window.modifyHref(`https://chat.openai.com/share/${srest[1]}`);
            }
        } else {
            window.modifyHref(`https://chat.openai.com/c/${srest[0]}`);
        }
    } else {
        window.modifyHref("https://chat.openai.com/");
    }
})

