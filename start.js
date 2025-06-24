import { writeFileSync, appendFileSync } from "fs";
import { launch } from './scrapArticles.js';
import http from "http";

// Fonction pour logger dans un fichier
function logToFile(message) {
    const timestamp = new Date().toISOString();
    appendFileSync("server.log", `[${timestamp}] ${message}\n`);
}

// Serveur HTTP Node.js natif
const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === "GET" && url.pathname === "/") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("OK");
        return;
    }

    if (req.method === "POST" && url.pathname === "/webhook") {
        let body = "";
        req.on("data", chunk => { body += chunk; });
        req.on("end", async () => {
            try {
                const json = JSON.parse(body);
                const receivedMsg = `📩 Webhook reçu : ${JSON.stringify(json)}`;
                console.log(receivedMsg);
                logToFile(receivedMsg);
                await launch(json); // Appel de ta fonction
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("✅ Reçu !");
            } catch (err) {
                logToFile("❌ Erreur parsing JSON : " + err.message);
                res.writeHead(400, { "Content-Type": "text/plain" });
                res.end("❌ Mauvais JSON");
            }
        });
        return;
    }

    const notFoundMsg = "❌ Not Found";
    logToFile(notFoundMsg);
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end(notFoundMsg);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    const msg = `🚀 Serveur en écoute sur http://localhost:${PORT}`;
    console.log(msg);
    logToFile(msg);
});