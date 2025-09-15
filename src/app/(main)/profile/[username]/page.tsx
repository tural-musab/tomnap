import type { ReactElement } from 'react'
type AnyPromise = Promise<unknown>

export default async function ProfilePage({
  params,
}: {
  params?: AnyPromise
}): Promise<ReactElement> {
  const p = (params ? await params : undefined) as { username?: string } | undefined
  return (
    <main>
      <h1>Profile: {p?.username}</h1>
    </main>
  )
}
