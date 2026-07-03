import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import pkg from "./package.json";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    base: env.VITE_BASE_PATH || "/",
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
    },
    plugins: [react()],
    server: {
      watch: {
        // Windows locks PNGs under public/, and native fs.watch throws EBUSY on them.
        // Polling avoids the native watcher entirely, and we still ignore the static
        // asset folders so edits there never trigger a reload.
        usePolling: true,
        interval: 300,
        ignored: ["**/public/**"],
      },
    },
  };
});
