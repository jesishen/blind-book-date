"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export interface FlapProgress {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

function Flap({
  side,
  progress,
  dragging,
}: {
  side: "top" | "right" | "bottom" | "left";
  progress: number;
  dragging: boolean;
}) {
  const clipPaths: Record<string, string> = {
    top: "polygon(0 0, 100% 0, 50% 50%)",
    right: "polygon(100% 0, 100% 100%, 50% 50%)",
    bottom: "polygon(100% 100%, 0 100%, 50% 50%)",
    left: "polygon(0 100%, 0 0, 50% 50%)",
  };

  const origin: Record<string, string> = {
    top: "top",
    right: "right",
    bottom: "bottom",
    left: "left",
  };

  const maxAngle: Record<string, { rotateX?: number; rotateY?: number }> = {
    top: { rotateX: -130 },
    bottom: { rotateX: 130 },
    left: { rotateY: 130 },
    right: { rotateY: -130 },
  };

  const angle = maxAngle[side];
  const rotate = {
    rotateX: (angle.rotateX ?? 0) * progress,
    rotateY: (angle.rotateY ?? 0) * progress,
  };

  return (
    <motion.div
      className="absolute inset-0 bg-amber-700"
      style={{
        clipPath: clipPaths[side],
        transformOrigin: origin[side],
        transformStyle: "preserve-3d",
        boxShadow: "inset 0 0 12px rgba(0,0,0,0.15)",
      }}
      animate={{ ...rotate, opacity: 1 - progress * 0.9 }}
      transition={
        dragging ? { duration: 0 } : { duration: 1.4, ease: [0.22, 1, 0.36, 1] }
      }
    />
  );
}

export function GiftWrap({
  flapProgress,
  fadeProgress,
  dragging,
  children,
}: {
  flapProgress: FlapProgress;
  fadeProgress: number;
  dragging: boolean;
  children: ReactNode;
}) {
  const transition = dragging
    ? { duration: 0 }
    : { duration: 1.4, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-lg"
      style={{ perspective: 900 }}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          opacity: Math.max(0, (fadeProgress - 0.4) / 0.6),
          scale: 0.9 + 0.1 * Math.max(0, (fadeProgress - 0.4) / 0.6),
        }}
        transition={transition}
      >
        {children}
      </motion.div>

      <motion.div
        className="absolute left-1/2 top-1/2 z-10 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-900"
        animate={{
          opacity: 1 - Math.min(fadeProgress / 0.3, 1),
          scale: 1 - 0.5 * Math.min(fadeProgress / 0.3, 1),
        }}
        transition={transition}
      />

      <Flap side="top" progress={flapProgress.top} dragging={dragging} />
      <Flap side="right" progress={flapProgress.right} dragging={dragging} />
      <Flap side="bottom" progress={flapProgress.bottom} dragging={dragging} />
      <Flap side="left" progress={flapProgress.left} dragging={dragging} />
    </div>
  );
}