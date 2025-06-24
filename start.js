import { writeFileSync, appendFileSync } from "fs";
import { launch } from './scrapArticles.js';

// Démarrage d'un serveur HTTP minimal pour le healthcheck Coolify
import http from 'http';
http.createServer((req, res) => {
    res.writeHead(200);
    res.end('OK');
}).listen(process.env.PORT || 3000);


// Fonction pour logger dans un fichier
function logToFile(message) {
    const timestamp = new Date().toISOString();
    appendFileSync("server.log", `[${timestamp}] ${message}\n`);
}

// Serveur HTTP
const server = Bun.serve({
    port: 3000,
    fetch(req) {
        const url = new URL(req.url);

        if (req.method === "POST" && url.pathname === "/webhook") {
            return req.json().then((body) => {
                const receivedMsg = `📩 Webhook reçu : ${JSON.stringify(body)}`;
                console.log(receivedMsg);
                logToFile(receivedMsg);
                launch(body); // Appel de ta fonction
                return new Response("✅ Reçu !");
            });
        }

        const notFoundMsg = "❌ Not Found";
        logToFile(notFoundMsg);
        return new Response(notFoundMsg, { status: 404 });
    },
});

console.log("🚀 Serveur en écoute sur http://localhost:3000");
logToFile("🚀 Serveur en écoute sur http://localhost:3000");