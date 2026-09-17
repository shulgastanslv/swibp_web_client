"use client";

import { ThemeProvider, type ThemeProviderProps } from "next-themes";

import * as React from "react";
import { SessionProvider } from "next-auth/react";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {


  return (<SessionProvider>{children}</SessionProvider>);
}
