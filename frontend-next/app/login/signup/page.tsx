"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Button, Card, Input, Link, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  User,
} from "@firebase/auth";
import { FormattedMessage, useIntl } from "react-intl";

import { auth } from "@/config/firebase";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intl = useIntl();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setPassword(e.target.value);
  };

  const handlePasswordConfirmChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setPasswordConfirm(e.target.value);
  };

  const handleDisplayNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setDisplayName(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== passwordConfirm) {
      setError(
        intl.formatMessage({
          id: "signup.passwordMismatch",
          defaultMessage: "Passwords do not match",
        }),
      );
      setLoading(false);

      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user: User = userCredential.user;

      await updateProfile(user, {
        displayName: displayName,
      });

      // handleLogIn(emailAuthProvider, email, password);
      router.push("/profile");
    } catch (error) {
      setError(
        intl.formatMessage({
          id: "signup.error",
          defaultMessage: "Error during sign-up process",
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="max-w-md w-full p-8 space-y-5 shadow-lg rounded-lg bg-white dark:bg-gray-800">
        <p className="text-center text-3xl font-bold text-gray-900 dark:text-white">
          <FormattedMessage defaultMessage="Sign Up" id="signup.title" />
        </p>
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-md text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            fullWidth
            required
            label={intl.formatMessage({
              id: "signup.displayName",
              defaultMessage: "Display Name",
            })}
            placeholder={intl.formatMessage({
              id: "signup.displayNamePlaceholder",
              defaultMessage: "Enter your display name",
            })}
            value={displayName}
            onChange={handleDisplayNameChange}
          />
          <Input
            fullWidth
            required
            label={intl.formatMessage({
              id: "signup.emailLabel",
              defaultMessage: "Email",
            })}
            placeholder={intl.formatMessage({
              id: "signup.emailPlaceholder",
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
              id: "signup.passwordLabel",
              defaultMessage: "Password",
            })}
            placeholder={intl.formatMessage({
              id: "signup.passwordPlaceholder",
              defaultMessage: "Enter your password",
            })}
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <Input
            fullWidth
            required
            label={intl.formatMessage({
              id: "signup.passwordConfirmLabel",
              defaultMessage: "Confirm Password",
            })}
            placeholder={intl.formatMessage({
              id: "signup.passwordConfirmPlaceholder",
              defaultMessage: "Confirm your password",
            })}
            type="password"
            value={passwordConfirm}
            onChange={handlePasswordConfirmChange}
          />
          <Button
            className="w-full"
            color="primary"
            isDisabled={loading}
            size="lg"
            type="submit"
          >
            <FormattedMessage
              defaultMessage="Sign Up"
              id="signup.submitButton"
            />
          </Button>
          <div className="w-full flex justify-center">
            {loading && <Spinner color="primary" label="Signing up..." />}
          </div>
        </form>
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600 dark:text-gray-400">
          <Link href={"/login"} size="sm" underline="focus">
            <FormattedMessage defaultMessage="Log in" id="signup.login" />
          </Link>
        </div>
      </Card>
    </div>
  );
}
