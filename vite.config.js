import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/* Lista sozinha as imagens de public/logos-parceiros: o site importa "virtual:logos-parceiros"
   e recebe os caminhos. Para incluir ou tirar uma empresa, basta pôr ou tirar o arquivo da pasta. */
const PASTA = path.resolve("public/logos-parceiros");
const IMAGEM = /\.(png|jpe?g|webp|svg|gif|avif)$/i;

function logosParceiros() {
  const id = "virtual:logos-parceiros";
  const resolvido = "\0" + id;
  const listar = () => {
    try {
      return fs
        .readdirSync(PASTA)
        .filter((f) => IMAGEM.test(f))
        .sort((a, b) => a.localeCompare(b, "pt", { numeric: true }))
        .map((f) => `/logos-parceiros/${encodeURIComponent(f)}`);
    } catch {
      return [];
    }
  };
  return {
    name: "logos-parceiros",
    resolveId: (origem) => (origem === id ? resolvido : null),
    load: (origem) => (origem === resolvido ? `export default ${JSON.stringify(listar())};` : null),
    configureServer(server) {
      server.watcher.add(PASTA);
      const recarregar = (arquivo) => {
        if (!path.resolve(arquivo).startsWith(PASTA)) return;
        const modulo = server.moduleGraph.getModuleById(resolvido);
        if (modulo) server.moduleGraph.invalidateModule(modulo);
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("add", recarregar).on("unlink", recarregar);
    },
  };
}

export default defineConfig({ plugins: [react(), logosParceiros()] });
