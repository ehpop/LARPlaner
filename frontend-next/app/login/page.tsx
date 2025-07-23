"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Button, Card, Input, Link, Spinner } from "@heroui/react";
import Image from "next/image";
import { FormattedMessage, useIntl } from "react-intl";
import { useRouter } from "next/navigation";

import { useAuth } from "@/providers/firebase-provider";
import {
  emailAuthProvider,
  githubAuthProvider,
  googleAuthProvider,
} from "@/config/firebase";
import LoadingOverlay from "@/components/common/loading-overlay";
import { getErrorMessage } from "@/utils/error";

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const intl = useIntl();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleLogIn } = useAuth();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await handleLogIn(emailAuthProvider, email, password);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.user) {
      router.push("/");
    }
  }, [auth.user]);

  return (
    <LoadingOverlay
      isLoading={auth.loading}
      label={intl.formatMessage({
        defaultMessage: "Loading...",
        id: "login.loading",
      })}
    >
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="max-w-md w-full p-8 space-y-5 shadow-lg rounded-lg bg-white dark:bg-gray-800">
          <p className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            <FormattedMessage defaultMessage="Login" id="login.title" />
          </p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              fullWidth
              required
              label={intl.formatMessage({
                id: "login.email",
                defaultMessage: "Email",
              })}
              placeholder={intl.formatMessage({
                id: "login.emailPlaceholder",
                defaultMessage: "Enter your email",
              })}
              type="email"
              value={email}
              onChange={handleEmailChange}
            />
            <Input
              fullWidth
              required
              label={intl.formatMessage({
                id: "login.password",
                defaultMessage: "Password",
              })}
              placeholder={intl.formatMessage({
                id: "login.passwordPlaceholder",
                defaultMessage: "Enter your password",
              })}
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
            {error && (
              <div className="text-danger p-3 rounded-md text-center">
                {error}
              </div>
            )}
            <Button
              className="w-full"
              color="primary"
              disabled={loading}
              size="lg"
              type="submit"
              onPress={() => handleLogIn(emailAuthProvider)}
            >
              {loading ? (
                <Spinner color="default" />
              ) : (
                <FormattedMessage defaultMessage="Login" id="login.login" />
              )}
            </Button>
          </form>

          <Button
            className="w-full mt-4 bg-white border border-gray-300 text-gray-900 rounded-lg py-2 px-4 flex items-center justify-center space-x-3 shadow hover:bg-gray-50 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
            onPress={() => handleLogIn(googleAuthProvider)}
          >
            <Image
              alt="Google Logo"
              height={20}
              src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
              width={20}
            />
            <span>
              <FormattedMessage
                defaultMessage="Sign in with Google"
                id="login.google"
              />
            </span>
          </Button>
          <Button
            className="w-full mt-4 bg-white border border-gray-300 text-gray-900 rounded-lg py-2 px-4 flex items-center justify-center space-x-3 shadow hover:bg-gray-50 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
            onPress={() => handleLogIn(githubAuthProvider)}
          >
            <Image
              alt="Github Logo"
              height={20}
              src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
              width={20}
            />
            <span>
              <FormattedMessage
                defaultMessage="Sign in with Github"
                id="login.github"
              />
            </span>
          </Button>

          <div className="flex justify-between items-center mt-4 text-sm text-gray-600 dark:text-gray-400">
            <Link href={"/login/signup"} size="sm" underline="focus">
              <FormattedMessage defaultMessage="Sign up" id="login.signup" />
            </Link>
            <Link href={"/login/reset"} size="sm" underline="focus">
              <FormattedMessage
                defaultMessage="Forgot Password?"
                id="login.forgotPassword"
              />
            </Link>
          </div>
        </Card>
      </div>
    </LoadingOverlay>
  );
}
