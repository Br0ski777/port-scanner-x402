import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "port-scanner",
  slug: "port-scanner",
  description: "Scan TCP ports on any host -- check open/closed status, response time. 16 common ports by default.",
  version: "1.0.0",
  routes: [
    {
      method: "POST",
      path: "/api/scan",
      price: "$0.003",
      description: "Scan common ports on a host to check which are open",
      toolName: "network_scan_ports",
      toolDescription: `Use this when you need to check which TCP ports are open on a host. Returns port status and response times in JSON.

Returns: 1. host scanned 2. ports array with port number, status (open/closed/filtered), responseTime in ms 3. openCount and totalScanned 4. scanDuration in ms.

Example output: {"host":"example.com","ports":[{"port":80,"status":"open","responseTime":45},{"port":443,"status":"open","responseTime":52},{"port":22,"status":"closed","responseTime":null}],"openCount":2,"totalScanned":16,"scanDuration":1200}

Use this FOR server reconnaissance, verifying firewall rules, checking service availability, and infrastructure auditing.

Do NOT use for DNS resolution -- use network_lookup_dns instead. Do NOT use for SSL certificate checks -- use security_check_ssl instead. Do NOT use for HTTP header analysis -- use network_analyze_headers instead.`,
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
