import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import superjson from "superjson";

import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from "@shared/const";

import App from "./App";
import { getLoginUrl } from "./const";

import "./index.css";

// -----------------------------
// Service Worker (PWA)
// -----------------------------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js") // compatível com base: "./"
      .then((registration) => {
        console.log("Service Worker registrado com sucesso:", registration);
      })
      .catch((error) => {
        console.log("Erro ao registrar Service Worker:", error);
      });
  });
}

// -----------------------------
// React Query
// -----------------------------
const queryClient = new QueryClient();

// -----------------------------
// TRPC error handling
// -----------------------------
const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;

  if (error.message === UNAUTHED_ERR_MSG) {
    window.location.href = getLoginUrl();
  }
};

// -----------------------------
// TRPC Client
// -----------------------------
const trpcClient = trpc.createClient({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: "/trpc",
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});

// -----------------------------
// Render App
// -----------------------------
const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container #root não encontrado");
}

const root = createRoot(container);

root.render(
  <trpc.Provider
    client={trpcClient}
    queryClient={queryClient}
    onError={redirectToLoginIfUnauthorized}
  >
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
