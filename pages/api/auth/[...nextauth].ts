import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: "public_repo user",
    }),
  ],
  callbacks: {
    async jwt(token, user, account, profile, isNewUser) {
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
        token.username = profile.login;
      }

      return token;
    },

    async session(session, token) {
      session.accessToken = token.accessToken;
      session.user.username = `${token.username}`;

      return session;
    },
  },
});
