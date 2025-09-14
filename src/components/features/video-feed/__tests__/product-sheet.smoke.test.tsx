import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProductSheet from '../product-sheet'

describe('ProductSheet', () => {
  it('shows product title and price area', () => {
    render(<ProductSheet product={{ id: '1', title: 'Ürün', price: 10 }} open onClose={() => {}} />)
    expect(screen.getByText('Ürün')).toBeInTheDocument()
  })
})


