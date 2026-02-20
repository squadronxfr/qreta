"use client";

import {useMemo} from "react";
import {motion} from "framer-motion";

interface SplitTextProps {
    text: string;
    className?: string;
    delay?: number;
}

export function SplitText({text, className, delay = 0}: SplitTextProps) {
    const words = useMemo(() => text.split(" "), [text]);

    return (
        <span className={className}>
      {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
              initial={{y: "100%"}}
              animate={{y: 0}}
              transition={{
                  duration: 0.5,
                  delay: delay + i * 0.1,
                  ease: [0.2, 0.65, 0.3, 0.9],
              }}
              className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
    );
}