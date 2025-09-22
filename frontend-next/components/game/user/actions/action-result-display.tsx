"use client";

import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { motion, Variants } from "framer-motion";

import { IGameActionLogSummary } from "@/types/game.types";
import TagList from "@/components/game/user/actions/tag-list";

// Animation variants for Framer Motion
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const iconSuccessVariants: Variants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    // CORRECTED: Provide only the final value for scale.
    // The spring physics will handle the "bounce" effect automatically.
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15, // A slightly lower damping can make the bounce more pronounced
    },
  },
};

const iconFailureVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    x: [0, -5, 5, -5, 5, 0],
    transition: {
      duration: 0.4,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const ActionResultDisplay = ({
  actionResult,
}: {
  actionResult: IGameActionLogSummary;
}) => {
  const hasTags =
    actionResult.appliedTags.length > 0 || actionResult.removedTags.length > 0;

  return (
    <motion.div
      key={actionResult.id}
      animate="visible"
      className="flex-grow flex flex-col items-center justify-center text-center space-y-4"
      initial="hidden"
      variants={containerVariants}
    >
      {actionResult.success ? (
        <motion.div variants={iconSuccessVariants}>
          <CheckCircleIcon className="h-12 w-12 text-green-500" />
        </motion.div>
      ) : (
        <motion.div variants={iconFailureVariants}>
          <XCircleIcon className="h-12 w-12 text-red-600" />
        </motion.div>
      )}

      <motion.p
        className="text-zinc-800 dark:text-zinc-200"
        variants={itemVariants}
      >
        {actionResult.message}
      </motion.p>

      {hasTags && (
        <motion.div className="pt-2 w-full" variants={itemVariants}>
          <hr className="border-zinc-200 dark:border-zinc-800 mb-4" />
          <div className="flex flex-wrap justify-center gap-2">
            <TagList tags={actionResult.appliedTags} type="applied" />
            <TagList tags={actionResult.removedTags} type="removed" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ActionResultDisplay;
