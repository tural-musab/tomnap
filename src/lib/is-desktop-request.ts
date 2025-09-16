import { cookies } from 'next/headers'

export async function isDesktopRequest(minWidth: number = 768): Promise<boolean> {
  const cookieStore = await cookies()
  const vw = Number(cookieStore.get('vw')?.value ?? '0')
  return vw >= minWidth
}
