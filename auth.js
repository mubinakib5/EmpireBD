import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { sanityClient } from "./lib/sanity.js"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await sanityClient.fetch(
            `*[_type == "user" && email == $email][0]`,
            { email: credentials.email }
          )

          if (user && user.password === credentials.password) {
            return {
              id: user._id,
              email: user.email,
              name: user.name,
            }
          }
          return null
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  }
})

export const { GET, POST } = handlers
