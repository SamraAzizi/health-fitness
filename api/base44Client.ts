import { createClient } from "@base44/sdk";

// Initialize Base44 client with your project ID
export const base44 = createClient({
  appId: process.env.NEXT_PUBLIC_BASE44_PROJECT_ID || "695b5d3a646639ee71a6c116",
  serverUrl: process.env.NEXT_PUBLIC_BASE44_SERVER_URL || "https://app.base44.com",
  token: process.env.NEXT_PUBLIC_BASE44_API_KEY || "919bb7352127450eafb9892d19621ef9",
});

export default base44;
