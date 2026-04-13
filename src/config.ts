import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "port-scanner",
  slug: "port-scanner",
  description: "Check if common ports are open on a host using fetch with timeout.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/scan",
      price: "$0.003",
      description: "Scan common ports on a host to check which are open",
      toolName: "network_scan_ports",
      toolDescription: "Use this when you need to check if common ports are open on a host. Scans TCP ports using fetch with timeout. Returns a list of open/closed ports with response times. Do NOT use for DNS resolution — use domain_lookup_intelligence instead. Do NOT use for SSL certificate checks — use security_check_ssl instead.",
      inputSchema: {
        type: "object",
        properties: {
          host: { type: "string", description: "The hostname or IP address to scan" },
          ports: {
            type: "array",
            items: { type: "number" },
            description: "Array of port numbers to scan (default: [21,22,25,53,80,110,143,443,993,995,3306,3389,5432,6379,8080,8443])",
          },
        },
        required: ["host"],
      },
    },
  ],
};
