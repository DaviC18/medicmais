import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { dentistJsonLdScript } from "./src/data/jsonld.ts";

const JSONLD_MARKER = "<!-- clinica:jsonld -->";
// Fonte do h1 (LCP): Fraunces, subset latin. O nome final é hasheado pelo Vite.
const LCP_FONT = /(^|\/)fraunces-latin-opsz-normal-[\w-]+\.woff2$/;

/**
 * index.html a partir de src/data/clinica.ts (pedido do 04 no HANDOFF, DECISIONS D19):
 * - troca o marcador JSONLD_MARKER pelo JSON-LD `Dentist` (dev e build);
 * - no build, injeta <link rel="preload"> do woff2 hasheado da Fraunces latin.
 * Falha o build se o marcador ou a fonte sumirem, para não publicar sem eles em silêncio.
 */
function clinicaHtml(): Plugin {
  return {
    name: "medicmais:clinica-html",
    transformIndexHtml: {
      handler(html, ctx) {
        if (!html.includes(JSONLD_MARKER)) {
          throw new Error(`[clinica-html] marcador ${JSONLD_MARKER} não encontrado no index.html`);
        }
        const out = html.replace(JSONLD_MARKER, dentistJsonLdScript());
        if (!ctx.bundle) return out; // dev: a fonte é servida sem hash; sem preload

        const font = Object.keys(ctx.bundle).find((file) => LCP_FONT.test(file));
        if (!font) {
          throw new Error("[clinica-html] woff2 fraunces-latin-opsz-normal não encontrado no bundle");
        }
        return {
          html: out,
          tags: [
            {
              tag: "link",
              attrs: {
                rel: "preload",
                as: "font",
                type: "font/woff2",
                href: `/${font}`,
                crossorigin: "",
              },
              injectTo: "head-prepend",
            },
          ],
        };
      },
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), clinicaHtml()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        // Vendors estáveis em chunks próprios (03-motion, DECISIONS D23): cache longo
        // entre deploys que só mudam o app e nenhum chunk acima de 500 kB.
        // Ficam FORA dos grupos (chunks sob demanda): features do Motion (D22) e
        // ScrollTrigger/Observer (D23). Um grupo que os capturasse os puxaria de volta
        // para o JS inicial.
        codeSplitting: {
          groups: [
            { name: "react", test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/, priority: 20 },
            {
              name: "gsap",
              test: (id) =>
                /node_modules[\\/](gsap|@gsap[\\/]react)[\\/]/.test(id) &&
                !/[\\/](ScrollTrigger|Observer)\.js$/.test(id),
              priority: 10,
            },
          ],
        },
      },
    },
  },
});
