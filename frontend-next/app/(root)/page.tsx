"use client";

import { Link } from "@heroui/link";
import { Icon } from "@iconify/react";
import { FormattedMessage, useIntl } from "react-intl";

const Page = () => {
  const intl = useIntl();

  const coreFeatures = [
    {
      icon: "lucide:book-open",
      title: intl.formatMessage({
        id: "landingPage.features.crafting.title",
        defaultMessage: "Dynamic Scenario Crafting",
      }),
      description: intl.formatMessage({
        id: "landingPage.features.crafting.description",
        defaultMessage:
          "Create intricate scenarios with custom roles, items, and actions. Bring your imagination to life with our flexible scenario builder.",
      }),
    },
    {
      icon: "lucide:calendar",
      title: intl.formatMessage({
        id: "landingPage.features.management.title",
        defaultMessage: "Effortless Event Management",
      }),
      description: intl.formatMessage({
        id: "landingPage.features.management.description",
        defaultMessage:
          "Organize and manage LARP events with ease. Assign roles, track event status, and seamlessly transition from planning to gameplay.",
      }),
    },
    {
      icon: "lucide:zap",
      title: intl.formatMessage({
        id: "landingPage.features.interaction.title",
        defaultMessage: "Real-Time Game Interaction",
      }),
      description: intl.formatMessage({
        id: "landingPage.features.interaction.description",
        defaultMessage:
          "Immerse players in the game world with real-time actions, dynamic item usage, and an evolving game state tracked through tags.",
      }),
    },
  ];

  const gameMasterBenefits = [
    {
      id: "landingPage.audience.gameMasters.point1",
      defaultMessage: "Simplify organization and planning",
    },
    {
      id: "landingPage.audience.gameMasters.point2",
      defaultMessage: "Automate game state tracking",
    },
    {
      id: "landingPage.audience.gameMasters.point3",
      defaultMessage: "Get a clear overview of game progress",
    },
  ];

  const playerBenefits = [
    {
      id: "landingPage.audience.players.point1",
      defaultMessage: "Enhanced immersion in the game world",
    },
    {
      id: "landingPage.audience.players.point2",
      defaultMessage:
        "Clear information about character abilities and inventory",
    },
    {
      id: "landingPage.audience.players.point3",
      defaultMessage: "Seamless gameplay experience with real-time updates",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-100 to-primary-200">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            <FormattedMessage
              defaultMessage="LARPlaner: The Ultimate Toolkit for Your Next Live Action Role-Playing Adventure"
              id="landingPage.hero.title"
            />
          </h1>
          <p className="mb-8 text-xl md:text-2xl">
            <FormattedMessage
              defaultMessage="Elevate your LARP experience with seamless scenario creation, event management, and real-time gameplay interactions."
              id="landingPage.hero.subtitle"
            />
          </p>
          <Link
            as={Link}
            className="rounded-full bg-primary px-8 py-3 text-lg font-semibold text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            href="/login"
          >
            <FormattedMessage
              defaultMessage="Get Started"
              id="landingPage.hero.ctaButton"
            />
          </Link>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="mb-12 text-center text-3xl font-bold">
            <FormattedMessage
              defaultMessage="Core Features"
              id="landingPage.features.title"
            />
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {coreFeatures.map((feature, index) => (
              <div key={index} className="rounded-lg bg-content1 p-6 shadow-md">
                <Icon
                  className="mb-4 h-12 w-12 text-primary"
                  icon={feature.icon}
                />
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-foreground-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Is It For Section */}
      <section className="bg-content2 py-20">
        <div className="container mx-auto px-6">
          <h2 className="mb-12 text-center text-3xl font-bold">
            <FormattedMessage
              defaultMessage="Who Is It For?"
              id="landingPage.audience.title"
            />
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-lg bg-content1 p-6 shadow-md">
              <h3 className="mb-4 text-2xl font-semibold">
                <FormattedMessage
                  defaultMessage="Game Masters"
                  id="landingPage.audience.gameMasters.title"
                />
              </h3>
              <ul className="space-y-2">
                {gameMasterBenefits.map((benefit) => (
                  <li key={benefit.id} className="flex items-center">
                    <Icon
                      className="mr-2 h-5 w-5 text-success"
                      icon="lucide:check-circle"
                    />
                    <FormattedMessage
                      defaultMessage={benefit.defaultMessage}
                      id={benefit.id}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-content1 p-6 shadow-md">
              <h3 className="mb-4 text-2xl font-semibold">
                <FormattedMessage
                  defaultMessage="Players"
                  id="landingPage.audience.players.title"
                />
              </h3>
              <ul className="space-y-2">
                {playerBenefits.map((benefit) => (
                  <li key={benefit.id} className="flex items-center">
                    <Icon
                      className="mr-2 h-5 w-5 text-success"
                      icon="lucide:check-circle"
                    />
                    <FormattedMessage
                      defaultMessage={benefit.defaultMessage}
                      id={benefit.id}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-primary-100 py-20 text-center">
        <div className="container mx-auto px-6">
          <h2 className="mb-4 text-3xl font-bold">
            <FormattedMessage
              defaultMessage="Ready to Elevate Your LARP Experience?"
              id="landingPage.cta.title"
            />
          </h2>
          <p className="mb-8 text-xl">
            <FormattedMessage
              defaultMessage="Join LARPlaner today and transform the way you create, manage, and play live action role-playing games."
              id="landingPage.cta.subtitle"
            />
          </p>
          <Link
            as={Link}
            className="rounded-full bg-primary px-8 py-3 text-lg font-semibold text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            href="/login"
          >
            <FormattedMessage
              defaultMessage="Create Your First Event"
              id="landingPage.cta.button"
            />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Page;
