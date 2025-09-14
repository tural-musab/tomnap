import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CartSummary from '../cart-summary'

describe('CartSummary', () => {
  it('renders total area', () => {
    render(<CartSummary />)
    expect(screen.getByText(/Toplam/i)).toBeInTheDocument()
  })
})


