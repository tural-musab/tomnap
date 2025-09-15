import { cookies } from 'next/headers'

export function isDesktopRequest(minWidth: number = 768): boolean {
  const vw = Number(cookies().get('vw')?.value ?? '0')
  return vw >= minWidth
}
