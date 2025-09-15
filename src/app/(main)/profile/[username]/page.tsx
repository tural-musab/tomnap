interface ProfilePageProps {
  // During Vercel build, generated PageProps may be a Promise-like.
  // Use a loose type to satisfy both local and build-time types.
  params: { username?: string } | Promise<{ username?: string }>
}

export default async function ProfilePage(props: ProfilePageProps) {
  const p = props.params instanceof Promise ? await props.params : props.params
  return (
    <main>
      <h1>Profile: {p.username}</h1>
    </main>
  )
}
