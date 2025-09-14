import { useEffect, useState, useMemo, useRef, type RefObject } from 'react'

export function useIntersection<T extends Element>(
  targetRef: RefObject<T | null>,
  options?: IntersectionObserverInit
) {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)
  const observer = useRef<IntersectionObserver | null>(null)

  const opts = useMemo<IntersectionObserverInit | undefined>(() => options, [options])

  useEffect(() => {
    const node = targetRef.current
    if (!node) return

    observer.current?.disconnect()
    observer.current = new IntersectionObserver(([ent]) => setEntry(ent), opts)
    observer.current.observe(node)

    return () => {
      observer.current?.disconnect()
    }
  }, [targetRef, opts])

  return entry
}
