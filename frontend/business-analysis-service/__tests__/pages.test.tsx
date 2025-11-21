import { render, screen } from '@testing-library/react'
import { useRouter, usePathname } from 'next/navigation'
import HomePage from '../app/page'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}))

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>

describe('HomePage', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    } as ReturnType<typeof useRouter>)
    
    mockUsePathname.mockReturnValue('/')
  })

  it('renders hero section', () => {
    render(<HomePage />)
    expect(screen.getByText(/проверка контрагентов/i)).toBeInTheDocument()
  })

  it('renders search form', () => {
    render(<HomePage />)
    expect(screen.getByPlaceholderText(/название, адрес, фио, учредителям, огрн и инн/i)).toBeInTheDocument()
  })

  it('renders stats section', () => {
    render(<HomePage />)
    expect(screen.getByText(/компаний/i)).toBeInTheDocument()
  })
})
