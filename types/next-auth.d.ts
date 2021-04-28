import { Session } from "next-auth";

/** Example on how to extend the built-in session types */
declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      username: string;
    };
  }
}
