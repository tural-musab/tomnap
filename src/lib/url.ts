export async function getRequestOrigin(): Promise<string> {
  // 1) Explicit override
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  const { headers } = await import('next/headers')
  const h = await headers()
  const forwardedProto = h.get('x-forwarded-proto')
  const forwardedHost = h.get('x-forwarded-host')
  const host = forwardedHost ?? h.get('host') ?? ''
  const referer = h.get('referer')

  // Prefer Referer when present (captures the real browser origin behind local proxies)
  if (referer) {
    try {
      const u = new URL(referer)
      return `${u.protocol}//${u.host}`
    } catch {
      // ignore
    }
  }

  // Infer protocol when proxy does not add x-forwarded-proto
  const inferredProto = forwardedProto ?? (host.endsWith(':3001') ? 'https' : 'http')

  if (host) {
    return `${inferredProto}://${host}`
  }

  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
}
