"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Sidebar({ title, isOpen, onClose, children }: SidebarProps) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      className="fixed right-0 top-0 bottom-0 w-96 bg-background border-l shadow-lg z-50 flex flex-col"
    >
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-6">{children}</div>
    </motion.div>
  );
}
