import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId:
      clientSecret: 
      authorization: {
        params: {
          scope: "openid profile email https://www.googleapis.com/auth/drive",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
