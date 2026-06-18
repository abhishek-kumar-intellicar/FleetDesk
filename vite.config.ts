import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 11015,
    strictPort: true,
    allowedHosts: ["localhost"],
    proxy: {
      "/api": {
        target: "http://dmt2.intellicar.io:11014/api/v1",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});

// import path from "path";
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [
//     tailwindcss(),
//     react({
//       babel: {
//         plugins: [["babel-plugin-react-compiler"]],
//       },
//     }),
//   ],

//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },

//   server: {
//     host: true,
//     // port: 11005,
//     strictPort: true,
//     allowedHosts: [
//       "tata-fota.intellicar.io",
//       "tatatmlcv.intellicar.io",
//       "localhost",
//     ],
//     proxy: {
//       "/api": {
//         target: "https://tatatmlcv.intellicar.io/api/v1",
//         changeOrigin: true,
//         secure: true,
//       },
//     },
//   },
// });
