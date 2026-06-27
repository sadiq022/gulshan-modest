import { createBrowserClient } from '@supabase/ssr'
import dbData from '../db.json'

class MockQueryBuilder {
  private tableName: string
  private filters: Array<{ field: string; val: any }> = []
  private isSingle = false

  constructor(tableName: string) {
    this.tableName = tableName
  }

  select() { return this }
  eq(field: string, val: any) {
    this.filters.push({ field, val })
    return this
  }
  single() {
    this.isSingle = true
    return this
  }
  order() { return this }
  limit() { return this }

  async execute() {
    const db: any = dbData
    const table = db[this.tableName] || []

    let filtered = [...table]
    this.filters.forEach(f => {
      filtered = filtered.filter(item => item[f.field] === f.val)
    })

    if (this.isSingle) {
      if (this.tableName === 'profiles' && filtered.length === 0 && this.filters.some(f => f.field === 'id' && f.val === 'mock-admin-id')) {
        return { data: { role: 'admin' }, error: null }
      }
      return { data: filtered[0] || null, error: null }
    }

    return { data: filtered, count: filtered.length, error: null }
  }

  then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    return this.execute().then(onfulfilled, onrejected)
  }

  catch(onrejected?: (reason: any) => any) {
    return this.execute().catch(onrejected)
  }
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key || url.includes('placeholder') || url === '') {
    // Mock client for local development without Supabase
    return {
      auth: {
        getUser: async () => {
          if (typeof window !== 'undefined' && document.cookie.includes('mock-admin-logged-in=true')) {
            return { data: { user: { id: 'mock-admin-id', email: 'admin@gulshanmodest.com' } }, error: null }
          }
          return { data: { user: null }, error: null }
        },
        getSession: async () => {
          if (typeof window !== 'undefined' && document.cookie.includes('mock-admin-logged-in=true')) {
            return { data: { session: { user: { id: 'mock-admin-id', email: 'admin@gulshanmodest.com' } } }, error: null }
          }
          return { data: { session: null }, error: null }
        },
        signInWithPassword: async ({ email }) => {
          if (email.includes('admin')) {
            if (typeof window !== 'undefined') {
              document.cookie = 'mock-admin-logged-in=true; path=/'
            }
            return { data: { user: { id: 'mock-admin-id', email } }, error: null }
          }
          return { data: null, error: { message: 'Invalid credentials. Use an email containing "admin" to log in (Mock Mode).' } }
        },
        signOut: async () => {
          if (typeof window !== 'undefined') {
            document.cookie = 'mock-admin-logged-in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
          }
          return { error: null }
        },
      },
      from: (table: string) => new MockQueryBuilder(table)
    } as any
  }

  return createBrowserClient(url, key)
}
