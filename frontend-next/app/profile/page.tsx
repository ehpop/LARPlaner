"use client";

import { FC, useContext, useEffect, useState } from "react";
import Image from "next/image";
import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { sendEmailVerification, updateProfile, UserInfo } from "@firebase/auth";

import { FirebaseContext } from "@/context/firebase-context";

const ProfilePage: FC = () => {
  const { user, isAdmin } = useContext(FirebaseContext);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newUserPhoto, setNewUserPhoto] = useState<string>("");
  const [lastLoadedPhoto, setLastLoadedPhoto] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  const updateProfilePhoto = (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Update Profile Photo</ModalHeader>
            <ModalBody>
              <div className="w-full flex justify-center">
                <Avatar
                  showFallback
                  className="w-20 h-20"
                  size="lg"
                  src={lastLoadedPhoto}
                />
              </div>
              <div className="w-full flex space-x-3 justify-between">
                <Input
                  className="w-3/4"
                  label="Photo URL"
                  placeholder="https://example.com/photo.jpg"
                  variant="underlined"
                  onChange={(e) => {
                    setNewUserPhoto(e.target.value);
                  }}
                />
                <Button
                  className="mt-4"
                  color="primary"
                  isDisabled={
                    newUserPhoto === "" || newUserPhoto === lastLoadedPhoto
                  }
                  onClick={() => {
                    setLastLoadedPhoto(newUserPhoto);
                  }}
                >
                  Load Image
                </Button>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="success"
                isDisabled={lastLoadedPhoto === ""}
                onPress={() => {
                  handleUpdateProfile();
                  onOpenChange();
                  location.reload();
                }}
              >
                Update Profile Photo
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );

  const handleUpdateProfile = () => {
    if (!user) {
      return;
    }

    updateProfile(user, {
      photoURL: newUserPhoto,
    })
      .then(() => {})
      .catch((_error) => {});
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return user ? (
    <div className="w-full flex flex-row justify-center">
      <div className="w-1/2 flex flex-col justify-center items-center space-y-4 p-4 dark:bg-stone-950 rounded-lg shadow-md">
        <p className="text-lg font-bold">
          Display Name: {user.displayName || "N/A"}
        </p>

        <p className="text-md">
          Email: {user.email || "N/A"} (is verified:{" "}
          {user.emailVerified ? "Yes" : "No"})
        </p>

        <p className="text-md">Phone Number: {user.phoneNumber || "N/A"}</p>

        <p className="text-md font-semibold">
          Admin Status: {isAdmin ? "Yes" : "No"}
        </p>

        {user.photoURL && (
          <Image
            alt={`user-${user.displayName}-photo`}
            className="rounded-full"
            height={100}
            src={user.photoURL}
            width={100}
          />
        )}

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
          <Button
            className="mt-4"
            color="primary"
            isDisabled={user.emailVerified}
            onClick={() => {
              sendEmailVerification(user)
                .then(() => {})
                .catch((_error) => {});
            }}
          >
            Verify Email
          </Button>

          <Button
            className="mt-4"
            color="danger"
            onClick={() => {
              user
                ?.delete()
                .then(() => {})
                .catch((_error) => {});
            }}
          >
            Delete account
          </Button>

          <Button className="mt-4" color="success" onClick={onOpen}>
            Update Profile Photo
          </Button>
          {updateProfilePhoto}
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
