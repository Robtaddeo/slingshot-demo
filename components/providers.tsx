"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { TherapistProvider } from "@/contexts/therapist-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ThemeProviderProps } from "next-themes";

const queryClient = new QueryClient();

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <QueryClientProvider client={queryClient}>
        <TherapistProvider>{children}</TherapistProvider>
      </QueryClientProvider>
    </NextThemesProvider>
  );
}
