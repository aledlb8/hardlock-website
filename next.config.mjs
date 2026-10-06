import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

// A static site: `npm run build` writes plain HTML to `out/`, which can be
// hosted anywhere (GitHub Pages, Netlify, or a folder next to the game).
/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default withMDX(config);
