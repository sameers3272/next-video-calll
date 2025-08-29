import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import connectToDatabase from "./mongodb"
import User from "@/models/User"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          await connectToDatabase()
          
          const existingUser = await User.findOne({ email: user.email })
          
          if (!existingUser) {
            await User.create({
              googleId: account.providerAccountId,
              email: user.email,
              name: user.name,
              profilePicture: user.image || '',
              isOnline: true,
              lastSeen: new Date(),
            })
          } else {
            await User.findByIdAndUpdate(existingUser._id, {
              isOnline: true,
              lastSeen: new Date(),
            })
          }
          
          return true
        } catch (error) {
          console.error("Error saving user:", error)
          return false
        }
      }
      return true
    },
    async jwt({ token, account, user }) {
      if (account && user) {
        await connectToDatabase()
        const dbUser = await User.findOne({ email: user.email })
        if (dbUser) {
          token.userId = dbUser._id.toString()
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
})