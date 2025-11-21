import { searchAPI } from '../lib/api/search'

global.fetch = jest.fn()

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('API Functions', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('searchAPI.search', () => {
    it('should make API call with correct parameters', async () => {
      const mockResponse = {
        success: true,
        data: {
          results: [],
          totalCount: 0,
          page: 1,
          totalPages: 0,
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await searchAPI.search({ query: 'test query' })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/search'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            query: 'test query',
            region: '',
            status: '',
          }),
        })
      )

      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('API Error'))

      const result = await searchAPI.search({ query: 'test query' })
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })
})
