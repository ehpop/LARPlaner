"use client";

import {ChangeEvent, FormEvent, useState} from "react";
import {Button, Card, Input, Link, Spinner} from "@nextui-org/react";
import {useRouter} from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            await new Promise((resolve) => setTimeout(resolve, 1000));

            router.push("/");
        } catch (error) {
            setError("Invalid credentials, please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[800] bg-default-100 dark:bg-stone-950 p-4">
            <Card className="max-w-md w-full p-6 space-y-3" shadow="lg">
                <p className="text-center text-3xl">Login</p>

                {error && (
                    <Card className="mt-4 mb-6 border-1">
                        <p color="error">{error}</p>
                    </Card>
                )}

                <form className="space-y-3" onSubmit={handleSubmit}>
                    <Input
                        fullWidth
                        required
                        label="Email"
                        placeholder="Enter your email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <Input
                        fullWidth
                        required
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <Button
                        className="w-full"
                        color="primary"
                        disabled={loading}
                        size="lg"
                        type="submit"
                    >
                        Login
                    </Button>
                    {loading && (
                        <div className="flex justify-center">
                            <Spinner color="primary" label="Logging..."/>
                        </div>
                    )}
                </form>

                <div className="flex justify-between items-center">
                    <Link href={"/signup"} underline="focus">
                        Don&apos;t have an account? Sign up
                    </Link>
                    <Link href={"/forgot-password"} underline="focus">
                        Forgot password?
                    </Link>
                </div>
            </Card>
        </div>
    );
}
