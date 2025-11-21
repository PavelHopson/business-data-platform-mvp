import { renderHook, act } from '@testing-library/react'
import { useSearch } from '../hooks/useSearch'

describe('useSearch', () => {
  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useSearch())

    expect(result.current.results).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.hasSearched).toBe(false)
  })

  it('should handle search with loading state', async () => {
    const { result } = renderHook(() => useSearch())

    await act(async () => {
      await result.current.search('test company')
    })

    expect(result.current.loading).toBe(false)
  })

  it('should clear results', () => {
    const { result } = renderHook(() => useSearch())

    act(() => {
      result.current.clearResults()
    })

    expect(result.current.results).toEqual([])
    expect(result.current.hasSearched).toBe(false)
  })
})
