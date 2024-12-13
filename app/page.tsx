"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"] });
const sourceSans = Source_Sans_3({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className={`text-4xl font-bold ${playfair.className}`}>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Hi
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.8 }}
            >
              , I&apos;m Gavin
            </motion.span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2 }}
            className={`text-muted-foreground ${sourceSans.className}`}
          >
            I&apos;m here to help you work through your thoughts and feelings.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 3.5 }}
          >
            <Button
              size="lg"
              onClick={() => router.push("/chat")}
              className={`px-8 ${sourceSans.className}`}
            >
              Let&apos;s chat
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
