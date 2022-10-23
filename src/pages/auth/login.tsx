import { Button } from "@mantine/core";
import { NextPage } from "next";
import { signIn } from "next-auth/react";

const Login: NextPage = () => {
  return (
    <Button onClick={() => signIn("google")}>Sign in with Google</Button>
  );
};

export default Login;
