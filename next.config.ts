import type { NextConfig } from "next";

import { fileURLToPath } from "node:url";
import createJiti from "jiti";
const jiti = createJiti(fileURLToPath(import.meta.url));

jiti("./src/env");

const nextConfig: NextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	serverExternalPackages: ["@mastra/*"],
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
