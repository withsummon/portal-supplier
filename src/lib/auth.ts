import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { compare, hash } from 'bcryptjs'
import { db } from '@/db'
import * as schema from '@/db/schema'

const authBaseUrl = process.env.BETTER_AUTH_URL

const authSecret = process.env.BETTER_AUTH_SECRET

export const auth = betterAuth({
  baseURL: authBaseUrl,
  secret: authSecret,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verificationToken: schema.verificationTokens,
    },
  }),
  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password: string) => hash(password, 12),
      verify: async ({ hash: hashedPassword, password }: { hash: string; password: string }) =>
        compare(password, hashedPassword),
    },
  },
  plugins: [nextCookies()],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
})

export type Session = typeof auth.$Infer.Session.session
export type User = typeof auth.$Infer.Session.user
