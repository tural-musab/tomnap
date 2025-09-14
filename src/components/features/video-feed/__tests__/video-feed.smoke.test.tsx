import React from 'react'
import { describe, it, expect } from 'vitest'
// @ts-expect-error injected by vitest.setup
const { customRender: render } = globalThis as unknown as { customRender: typeof import('@testing-library/react').render }
import VideoFeed from '../video-feed'

describe('VideoFeed', () => {
  it('renders without crashing', () => {
    const { container } = render(<VideoFeed />)
    expect(container).toBeTruthy()
  })
})


