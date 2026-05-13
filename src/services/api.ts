import { Test, TestResult, User, LeaderboardEntry } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const token = localStorage.getItem('authToken')

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Test endpoints
  async getTests(category?: string, grade?: number): Promise<Test[]> {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (grade) params.append('grade', grade.toString())

    return this.request<Test[]>(`/tests?${params}`)
  }

  async getTest(id: string): Promise<Test> {
    return this.request<Test>(`/tests/${id}`)
  }

  async submitTestResult(result: Omit<TestResult, 'id' | 'userId' | 'startedAt' | 'completedAt'>): Promise<TestResult> {
    return this.request<TestResult>('/test-results', {
      method: 'POST',
      body: JSON.stringify(result),
    })
  }

  async getTestResults(userId: string): Promise<TestResult[]> {
    return this.request<TestResult[]>(`/users/${userId}/test-results`)
  }

  // User endpoints
  async getUserProfile(userId: string): Promise<User> {
    return this.request<User>(`/users/${userId}`)
  }

  async updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
    return this.request<User>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  // Leaderboard endpoints
  async getLeaderboard(category?: string, limit = 50): Promise<LeaderboardEntry[]> {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    params.append('limit', limit.toString())

    return this.request<LeaderboardEntry[]>(`/leaderboard?${params}`)
  }

  // Authentication endpoints
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    return this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(userData: {
    name: string
    email: string
    password: string
    grade?: number
  }): Promise<{ user: User; token: string }> {
    return this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async logout(): Promise<void> {
    await this.request<void>('/auth/logout', { method: 'POST' })
    localStorage.removeItem('authToken')
  }
}

export const apiService = new ApiService()

// Mock data for development
export const mockApiService = {
  async getTests(): Promise<Test[]> {
    // Return mock tests
    return []
  },

  async getTest(_id: string): Promise<Test | null> {
    // Return mock test by ID
    return null
  },

  async submitTestResult(result: any): Promise<TestResult> {
    // Mock submission
    return { ...result, id: Math.random().toString(36) } as TestResult
  },

  async getUserProfile(_userId: string): Promise<User | null> {
    // Return mock user profile
    return null
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    // Return mock leaderboard
    return []
  }
}

