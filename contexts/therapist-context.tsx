"use client";

import React, { createContext, useContext, useState } from "react";

interface TherapistContextType {
  therapistMode: boolean;
  toggleTherapistMode: () => void;
}

const TherapistContext = createContext<TherapistContextType | undefined>(
  undefined
);

export function TherapistProvider({ children }: { children: React.ReactNode }) {
  const [therapistMode, setTherapistMode] = useState(true);

  const toggleTherapistMode = () => {
    setTherapistMode((prev) => !prev);
  };

  return (
    <TherapistContext.Provider value={{ therapistMode, toggleTherapistMode }}>
      {children}
    </TherapistContext.Provider>
  );
}

export function useTherapist() {
  const context = useContext(TherapistContext);
  if (context === undefined) {
    throw new Error("useTherapist must be used within a TherapistProvider");
  }
  return context;
}
