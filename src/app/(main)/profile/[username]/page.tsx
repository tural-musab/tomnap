interface PageProps {
  params: { username: string }
}

export default function ProfilePage({ params }: PageProps) {
  return (
    <main>
      <h1>Profile: {params.username}</h1>
    </main>
  )
}
