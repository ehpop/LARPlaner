"use client";

import { sendEmailVerification, updateProfile, UserInfo } from "@firebase/auth";
import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import Image from "next/image";
import { FC, useContext, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { FirebaseContext } from "@/context/firebase-context";

const ProfilePage: FC = () => {
  const { user, isAdmin } = useContext(FirebaseContext);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newUserPhoto, setNewUserPhoto] = useState<string>("");
  const [lastLoadedPhoto, setLastLoadedPhoto] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const intl = useIntl();

  const updateProfilePhoto = (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <FormattedMessage
                defaultMessage="Update Profile Photo"
                id="profile.updatePhoto"
              />
            </ModalHeader>
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
                  label={intl.formatMessage({
                    id: "profile.photoUrl",
                    defaultMessage: "Photo URL",
                  })}
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
                  onPress={() => {
                    setLastLoadedPhoto(newUserPhoto);
                  }}
                >
                  <FormattedMessage
                    defaultMessage="Load Image"
                    id="profile.loadImage"
                  />
                </Button>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                <FormattedMessage defaultMessage="Close" id="profile.close" />
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
                <FormattedMessage
                  defaultMessage="Update Profile Photo"
                  id="profile.update"
                />
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );

  const handleUpdateProfile = () => {
    if (!user) return;

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
    return (
      <div className="flex w-full h-full justify-center align-middle">
        <Spinner
          label={intl.formatMessage({
            defaultMessage: "Loading...",
            id: "profile.loading",
          })}
        />
      </div>
    );
  }

  return user ? (
    <div className="w-full flex flex-row justify-center">
      <div className="w-11/12 lg:w-3/4 flex flex-col justify-center items-center space-y-4 p-4 dark:bg-zinc-950 rounded-lg shadow-md">
        <p className="text-lg font-bold">
          <FormattedMessage
            defaultMessage="Display Name"
            id="profile.displayName"
          />
          : {user.displayName || "N/A"}
        </p>

        <p className="text-md">
          <FormattedMessage defaultMessage="Email" id="profile.email" />:{" "}
          {user.email || "N/A"} (
          <FormattedMessage
            defaultMessage="is verified"
            id="profile.isVerified"
          />
          : {user.emailVerified ? "Yes" : "No"})
        </p>

        <p className="text-md">
          <FormattedMessage
            defaultMessage="Phone Number"
            id="profile.phoneNumber"
          />
          : {user.phoneNumber || "N/A"}
        </p>

        <p className="text-md font-semibold">
          <FormattedMessage
            defaultMessage="Admin Status"
            id="profile.adminStatus"
          />
          : {isAdmin ? "Yes" : "No"}
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
          <p className="text-md font-semibold">
            <FormattedMessage
              defaultMessage="Connected Providers"
              id="profile.connectedProviders"
            />
            :
          </p>
          {user.providerData.length > 0 ? (
            <ul className="list-disc list-inside">
              {user.providerData.map((provider: UserInfo) => (
                <li key={provider.providerId}>
                  {provider.providerId === "google.com"
                    ? intl.formatMessage({
                        id: "profile.page.google",
                        defaultMessage: "Google",
                      })
                    : provider.providerId === "github.com"
                      ? intl.formatMessage({
                          id: "profile.page.github",
                          defaultMessage: "GitHub",
                        })
                      : provider.providerId}
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <FormattedMessage
                defaultMessage="No providers linked."
                id="profile.noProviders"
              />
            </p>
          )}
        </div>

        <div className="md:w-1/2 w-3/4 flex flex-col">
          <Button
            className="mt-4"
            color="primary"
            isDisabled={user.emailVerified}
            onPress={() => {
              sendEmailVerification(user)
                .then(() => {})
                .catch((_error) => {});
            }}
          >
            <FormattedMessage
              defaultMessage="Verify Email"
              id="profile.verifyEmail"
            />
          </Button>

          <Button
            className="mt-4"
            color="danger"
            onPress={() => {
              user
                ?.delete()
                .then(() => {})
                .catch((_error) => {});
            }}
          >
            <FormattedMessage
              defaultMessage="Delete account"
              id="profile.deleteAccount"
            />
          </Button>

          <Button className="mt-4" color="success" onPress={onOpen}>
            <FormattedMessage
              defaultMessage="Update Profile Photo"
              id="profile.updatePhoto"
            />
          </Button>
          {updateProfilePhoto}
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full flex flex-col justify-center items-center min-h-screen">
      <p>
        <FormattedMessage
          defaultMessage="No user information available. Please log in."
          id="profile.noUser"
        />
      </p>
    </div>
  );
};

export default ProfilePage;
