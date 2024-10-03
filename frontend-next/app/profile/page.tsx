"use client";

import { FC, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { linkWithPopup, updateProfile, UserInfo } from "@firebase/auth";

import { FirebaseContext } from "@/context/firebase-context";
import { githubAuthProvider } from "@/config/firebase";

const ProfilePage: FC = () => {
  const { user, isAdmin } = useContext(FirebaseContext);
  const [isClient, setIsClient] = useState(false);

  // Ensure this runs only on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>; // Return a loading state during SSR
  }

  return user ? (
    <div className="w-full flex flex-row justify-center">
      <div
        className="w-1/2 flex flex-col justify-center items-center space-y-4 p-4 dark:bg-stone-950 rounded-lg shadow-md">
        {/* User's Display Name */}
        <p className="text-lg font-bold">
          Display Name: {user.displayName || "N/A"}
        </p>

        {/* User's Email */}
        <p className="text-md">Email: {user.email || "N/A"}</p>

        {/* User's Phone Number */}
        <p className="text-md">Phone Number: {user.phoneNumber || "N/A"}</p>

        {/* Admin Status */}
        <p className="text-md font-semibold">
          Admin Status: {isAdmin ? "Yes" : "No"}
        </p>

        {/* User's Profile Photo */}
        {user.photoURL && (
          <Image
            alt={`user-${user.displayName}-photo`}
            className="rounded-full"
            height={100}
            src={user.photoURL}
            width={100}
          />
        )}

        {/* Auth Providers Information */}
        <div className="mt-4">
          <p className="text-md font-semibold">Connected Providers:</p>
          {user.providerData.length > 0 ? (
            <ul className="list-disc list-inside">
              {user.providerData.map((provider: UserInfo) => (
                <li key={provider.providerId}>
                  {provider.providerId === "google.com"
                    ? "Google"
                    : provider.providerId === "github.com"
                      ? "GitHub"
                      : provider.providerId}
                </li>
              ))}
            </ul>
          ) : (
            <p>No providers linked.</p>
          )}
        </div>

        <div className="w-11/12 flex justify-between">
          {/* Button to Link GitHub */}
          <Button
            className="mt-4"
            color="primary"
            onClick={() => {
              linkWithPopup(user, githubAuthProvider)
                .then((result) => {
                })
                .catch((error) => {
                });
            }}
          >
            Link with GitHub
          </Button>

          {/* Button to delete account */}
          <Button
            className="mt-4"
            color="danger"
            onClick={() => {
              user
                ?.delete()
                .then(() => {
                })
                .catch((error) => {
                });
            }}
          >
            Delete account
          </Button>

          {/* Button to update profile photo */}
          <Button
            className="mt-4"
            color="success"
            onClick={() => {
              updateProfile(user, {
                photoURL:
                  "https://cdn-icons-png.flaticon.com/512/1144/1144760.png"
              })
                .then(() => {
                })
                .catch((error) => {
                });
            }}
          >
            Update Profile Photo
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full flex flex-col justify-center items-center min-h-screen">
      <p>No user information available. Please log in.</p>
    </div>
  );
};

export default ProfilePage;
