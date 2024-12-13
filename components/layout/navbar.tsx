import React from "react";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import { ThemeToggle } from "@/components/theme-toggle";
import { Switch } from "@/components/ui/switch";
import { useTherapist } from "@/contexts/therapist-context";
import { Label } from "@/components/ui/label";

const playfair = Playfair_Display({ subsets: ["latin"] });

export default function Navbar() {
  const { therapistMode, toggleTherapistMode } = useTherapist();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className={`text-lg font-bold ${playfair.className}`}>
                Gavin
              </div>
            </Link>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-4 md:justify-end">
          <div className="flex items-center space-x-2">
            <Switch
              id="therapist-mode"
              checked={therapistMode}
              onCheckedChange={toggleTherapistMode}
            />
            <Label htmlFor="therapist-mode">Therapist Mode</Label>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
