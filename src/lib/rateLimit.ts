import "server-only";

// Límite de solicitudes muy simple, en memoria, por IP. Suficiente para
// frenar envíos automatizados básicos; no persiste entre despliegues ni
// entre instancias del servidor. Para un límite robusto, usar un servicio
// dedicado (p. ej. Upstash Ratelimit) en el futuro. Compartido por todos
// los formularios del sitio (contacto, configurador) para no duplicar la
// lógica de limitación de envíos.
export function createRateLimiter(maxSubmissions: number, windowMs: number) {
  const submissionsByIp = new Map<string, number[]>();

  return function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const timestamps = (submissionsByIp.get(ip) ?? []).filter((time) => now - time < windowMs);
    timestamps.push(now);
    submissionsByIp.set(ip, timestamps);
    return timestamps.length > maxSubmissions;
  };
}
