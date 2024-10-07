"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Button, Card, Input, Link, Spinner } from "@nextui-org/react";
import { sendPasswordResetEmail } from "@firebase/auth";
import { FormattedMessage, useIntl } from "react-intl";

import { auth } from "@/config/firebase";

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const intl = useIntl();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage(
        intl.formatMessage({
          id: "passwordReset.success",
          defaultMessage: "Password reset email sent!",
        }),
      );
    } catch (error) {
      setErrorMessage(
        intl.formatMessage({
          id: "passwordReset.error",
          defaultMessage: "Failed to send password reset email.",
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
          <FormattedMessage
            defaultMessage="Reset Password"
            id="passwordReset.title"
          />
        </p>
        {successMessage && (
          <div className="bg-green-100 text-green-600 p-3 rounded-md text-center">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-100 text-red-600 p-3 rounded-md text-center">
            {errorMessage}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            fullWidth
            required
            label={intl.formatMessage({
              id: "passwordReset.emailLabel",
              defaultMessage: "Email",
            })}
            placeholder={intl.formatMessage({
              id: "passwordReset.emailPlaceholder",
              defaultMessage: "Enter your email",
            })}
            type="email"
            value={email}
            onChange={handleEmailChange}
          />
          <Button
            className="w-full"
            color="primary"
            disabled={loading}
            size="lg"
            type="submit"
          >
            {loading ? (
              <Spinner color="primary" label="Sending..." />
            ) : (
              <FormattedMessage
                defaultMessage="Send Reset Email"
                id="passwordReset.submitButton"
              />
            )}
          </Button>
        </form>
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600 dark:text-gray-400">
          <Link href={"/login"} size="sm" underline="focus">
            <FormattedMessage defaultMessage="Log in" id="reset.login" />
          </Link>
        </div>
      </Card>
    </div>
  );
}
