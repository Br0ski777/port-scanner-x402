# Port Scanner API

[![MCP Server](https://img.shields.io/badge/MCP-server-blue)](https://port-scanner.api.klymax402.com/mcp)
[![x402](https://img.shields.io/badge/payments-x402-6E56CF)](https://x402.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Scan TCP ports on any host -- check open/closed status, response time. 16 common ports by default. Pay-per-call via [x402](https://x402.org) (USDC on Base L2) -- no API key, no signup, no rate-limit wall.

Part of the [klymax402](https://klymax402.com) marketplace -- 100 x402 micropayment APIs for AI agents, one wallet, USDC on Base.

## Quickstart -- MCP

Add to your MCP client config (Claude Desktop, Cursor, ElizaOS, etc.):

```json
{
  "mcpServers": {
    "port-scanner": {
      "url": "https://port-scanner.api.klymax402.com/mcp"
    }
  }
}
```

## Quickstart -- HTTP (x402)

```bash
curl -X POST "https://port-scanner.api.klymax402.com/api/scan" \
  -H "Content-Type: application/json" \
  -d '{"host":"..."}'
# -> 402 Payment Required, with an x402 payment challenge in the response body
```

Any x402-aware client ([`@x402/fetch`](https://www.npmjs.com/package/@x402/fetch), [`x402-agent-tools`](https://www.npmjs.com/package/x402-agent-tools), ATXP) handles the 402 -> sign -> retry cycle automatically.

## Tools

| Tool | Method | Path | Price | Description |
|---|---|---|---|---|
| `network_scan_ports` | POST | `/api/scan` | $0.003 | Scan common ports on a host to check which are open |

### `network_scan_ports`

Use this when you need to check which TCP ports are open on a host. Returns port status and response times in JSON.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `host` | string | yes | The hostname or IP address to scan |
| `ports` | array | no | Array of port numbers to scan (default: [21,22,25,53,80,110,143,443,993,995,3306,3389,5432,6379,8080,8443]) |

Example response:

```json
{"host":"example.com","ports":[{"port":80,"status":"open","responseTime":45},{"port":443,"status":"open","responseTime":52},{"port":22,"status":"closed","responseTime":null}],"openCount":2,"totalScanned":16,"scanDuration":1200}
```

**When to use**: server reconnaissance, verifying firewall rules, checking service availability, and infrastructure auditing.

**Not for**: DNS resolution (use `network_lookup_dns`), SSL certificate checks (use `security_check_ssl`), HTTP header analysis (use `network_analyze_headers`).

## Example agent prompts

- "Check which TCP ports are open on a host"

## Payment

- Protocol: [x402](https://x402.org) -- HTTP-native pay-per-call, no signup, no API key
- Network: Base L2 (`eip155:8453`)
- Asset: USDC
- Facilitator: Coinbase CDP (primary), PayAI (fallback)
- Also reachable via [ATXP](https://atxp.ai) (OAuth-wrapped x402, RFC 9728 protected-resource metadata)

## Part of klymax402

100 x402 micropayment APIs for AI agents -- one wallet, USDC on Base, zero signup.

- Catalog: https://klymax402.com/llms.txt
- Full API reference: https://klymax402.com/llms-full.txt
- Live stats: https://klymax402.com/stats

## License

MIT
