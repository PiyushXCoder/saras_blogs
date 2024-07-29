import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
export { useSession } from "next-auth/react";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user }) {
      if (
        user.email &&
        process.env.LOGIN_EMAIL?.split(",").includes(user.email)
      )
        return true;
      else return false;
    },
  },
});
