import { useCallback, useEffect, useState } from 'react'

export function useAsyncData<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const next = await fetcher()
      setData(next)
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }, deps)

  useEffect(() => {
    void refetch()
  }, [refetch])

  return {
    data,
    loading,
    error,
    refetch,
  }
}

