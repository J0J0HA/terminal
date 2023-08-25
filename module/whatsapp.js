const whatsapp = registerModule(
    "whatsapp",
    "WhatsApp",
    "Open WhatsApp Web with a simple command"
)

whatsapp.registerCommand("whatsapp", "Open WhatsApp Web", async (full, rest) => {
    window.modifyHref("https://web.whatsapp.com/");
    out("Please wait...");
})

whatsapp.registerCommand("wa", "Alias: whatsapp", alias("whatsapp"))