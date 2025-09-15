'use server'
import { isDesktopRequest } from '@/lib/is-desktop-request'

export async function desktopOnlyAction(formData: FormData): Promise<{ ok: true }> {
  if (!isDesktopRequest()) {
    throw new Error('Bu işlem yalnızca masaüstünde yapılabilir.')
  }
  return { ok: true }
}
