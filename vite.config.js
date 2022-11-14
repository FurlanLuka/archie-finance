import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default {
  define: {
    "process.env": process.env,
  },
  plugins: [svgr(), react()],
}

