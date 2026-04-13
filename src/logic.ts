import type { Hono } from "hono";

const DEFAULT_PORTS = [21, 22, 25, 53, 80, 110, 143, 443, 993, 995, 3306, 3389, 5432, 6379, 8080, 8443];
const TIMEOUT_MS = 3000;

async function checkPort(host: string, port: number): Promise<{ port: number; open: boolean; service: string; responseMs: number }> {
  const services: Record<number, string> = {
    21: "FTP", 22: "SSH", 25: "SMTP", 53: "DNS", 80: "HTTP", 110: "POP3",
    143: "IMAP", 443: "HTTPS", 993: "IMAPS", 995: "POP3S", 3306: "MySQL",
    3389: "RDP", 5432: "PostgreSQL", 6379: "Redis", 8080: "HTTP-Alt", 8443: "HTTPS-Alt",
  };
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const protocol = [443, 993, 995, 8443].includes(port) ? "https" : "http";
    await fetch(`${protocol}://${host}:${port}`, { signal: controller.signal, redirect: "manual" });
    clearTimeout(timer);
    return { port, open: true, service: services[port] || "unknown", responseMs: Date.now() - start };
  } catch (e: any) {
    const elapsed = Date.now() - start;
    // Connection refused = port exists but closed; timeout = filtered
    // Some errors like ECONNREFUSED still mean the host responded
    if (e.name === "AbortError" || elapsed >= TIMEOUT_MS) {
      return { port, open: false, service: services[port] || "unknown", responseMs: elapsed };
    }
    // fetch errors on non-HTTP ports often mean the port IS open (TCP connected but not HTTP)
    if (e.message?.includes("ECONNREFUSED")) {
      return { port, open: false, service: services[port] || "unknown", responseMs: elapsed };
    }
    // Other errors (like protocol errors) often indicate the port is open
    return { port, open: true, service: services[port] || "unknown", responseMs: elapsed };
  }
}

export function registerRoutes(app: Hono) {
  app.post("/api/scan", async (c) => {
    const body = await c.req.json().catch(() => null);
    if (!body?.host) {
      return c.json({ error: "Missing required field: host" }, 400);
    }

    const host: string = body.host.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    const ports: number[] = body.ports || DEFAULT_PORTS;

    if (ports.length > 50) {
      return c.json({ error: "Maximum 50 ports per scan" }, 400);
    }

    const results = await Promise.all(ports.map((port) => checkPort(host, port)));
    const openPorts = results.filter((r) => r.open);

    return c.json({
      host,
      scannedPorts: ports.length,
      openPorts: openPorts.length,
      results,
      timestamp: new Date().toISOString(),
    });
  });
}
