import { useEffect, useState } from 'react'

interface Video {
  id: string
  title: string
}

export function useInfiniteVideos() {
  const [videos, setVideos] = useState<Video[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    async function fetchPage() {
      setLoading(true)
      // placeholder fetch
      const newItems: Video[] = []
      if (active) {
        setVideos((prev) => [...prev, ...newItems])
        setHasMore(false)
        setLoading(false)
      }
    }
    fetchPage()
    return () => {
      active = false
    }
  }, [page])

  function loadMore() {
    if (!loading && hasMore) setPage((p) => p + 1)
  }

  return { videos, hasMore, loading, loadMore }
}
