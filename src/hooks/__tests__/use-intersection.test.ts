import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useIntersection } from '../use-intersection'

describe('useIntersection Hook', () => {
  let mockObserver: any
  let mockObserve: any
  let mockUnobserve: any
  let mockDisconnect: any

  beforeEach(() => {
    mockObserve = vi.fn()
    mockUnobserve = vi.fn()
    mockDisconnect = vi.fn()
    
    mockObserver = {
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
    }

    global.IntersectionObserver = vi.fn().mockImplementation((callback) => {
      mockObserver.callback = callback
      return mockObserver
    })
  })

  it('creates IntersectionObserver with correct options', () => {
    const ref = { current: document.createElement('div') }
    const options = {
      threshold: 0.5,
      rootMargin: '10px',
    }

    renderHook(() => useIntersection(ref, options))

    expect(global.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      options
    )
  })

  it('observes element when ref has current', () => {
    const element = document.createElement('div')
    const ref = { current: element }

    renderHook(() => useIntersection(ref))

    expect(mockObserve).toHaveBeenCalledWith(element)
  })

  it('does not observe when ref.current is null', () => {
    const ref = { current: null }

    renderHook(() => useIntersection(ref))

    expect(mockObserve).not.toHaveBeenCalled()
  })

  it('returns intersection entry when intersecting', () => {
    const element = document.createElement('div')
    const ref = { current: element }

    const { result } = renderHook(() => useIntersection(ref))

    // Simulate intersection
    const entry = {
      target: element,
      isIntersecting: true,
      intersectionRatio: 0.8,
    }

    act(() => {
      mockObserver.callback([entry])
    })

    expect(result.current).toEqual(entry)
  })

  it('returns null when not intersecting', () => {
    const element = document.createElement('div')
    const ref = { current: element }

    const { result } = renderHook(() => useIntersection(ref))

    // Simulate no intersection
    const entry = {
      target: element,
      isIntersecting: false,
      intersectionRatio: 0,
    }

    act(() => {
      mockObserver.callback([entry])
    })

    expect(result.current).toEqual(entry)
  })

  it('disconnects observer on cleanup', () => {
    const element = document.createElement('div')
    const ref = { current: element }

    const { unmount } = renderHook(() => useIntersection(ref))

    unmount()

    expect(mockDisconnect).toHaveBeenCalled()
  })

  it('handles ref change correctly', () => {
    const element1 = document.createElement('div')
    const element2 = document.createElement('div')
    let ref = { current: element1 }

    const { rerender } = renderHook(() => useIntersection(ref))

    expect(mockObserve).toHaveBeenCalledWith(element1)

    // Change ref
    ref = { current: element2 }
    rerender()

    expect(mockUnobserve).toHaveBeenCalledWith(element1)
    expect(mockObserve).toHaveBeenCalledWith(element2)
  })
})