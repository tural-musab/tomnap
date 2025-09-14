import React from 'react'
import { describe, it, expect } from 'vitest'
// @ts-expect-error injected by vitest.setup
const { customRender: render } = globalThis as unknown as { customRender: typeof import('@testing-library/react').render }
import FeedPage from '../page'

describe('FeedPage', () => {
  it('renders VideoFeed', () => {
    const { container } = render(<FeedPage />)
    expect(container).toBeTruthy()
  })
})


