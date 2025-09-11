import { useEffect, useState } from 'react'

interface UserState {
  id: string
  username: string
}

export function useUser() {
  const [user, setUser] = useState<UserState | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    // placeholder user fetch
    const t = setTimeout(() => {
      setUser(null)
      setLoading(false)
    }, 0)
    return () => clearTimeout(t)
  }, [])

  return { user, loading }
}
