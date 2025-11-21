import { render, screen } from '@testing-library/react'
import SearchForm from '../components/SearchForm'
import Header from '../components/Header'
import Footer from '../components/Footer'

describe('SearchForm', () => {
  it('renders search input', () => {
    render(<SearchForm onSearch={jest.fn()} />)
    expect(screen.getByPlaceholderText(/введите название компании/i)).toBeInTheDocument()
  })

  it('renders search button', () => {
    render(<SearchForm onSearch={jest.fn()} />)
    expect(screen.getByRole('button', { name: /выполнить поиск/i })).toBeInTheDocument()
  })
})

describe('Header', () => {
  it('renders logo', () => {
    render(<Header />)
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Header />)
    const homeLinks = screen.getAllByText(/главная/i)
    expect(homeLinks.length).toBeGreaterThan(0)
    expect(homeLinks[0]).toBeInTheDocument()
    
    const capabilitiesLinks = screen.getAllByText(/возможности/i)
    expect(capabilitiesLinks.length).toBeGreaterThan(0)
    expect(capabilitiesLinks[0]).toBeInTheDocument()
  })
})

describe('Footer', () => {
  it('renders footer content', () => {
    render(<Footer />)
    expect(screen.getByText(/© 2025/i)).toBeInTheDocument()
  })
})
