import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user }) {
      if (process.env.LOGIN_EMAIL == user.email) return true;
      else return false;
    },
  },
});
