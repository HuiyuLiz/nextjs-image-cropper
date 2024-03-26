import { Inter } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import "@uploadthing/react/styles.css";
import type { Metadata } from "next";

import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_META_TITLE,
  description: process.env.NEXT_PUBLIC_META_DESCRIPTION,
};

const theme = {
  variables: { colorPrimary: "#000000" },
  elements: {
    formButtonPrimary:
      "bg-black border border-black border-solid hover:bg-white hover:text-black",
    socialButtonsBlockButton:
      "bg-white border-gray-200 hover:bg-transparent hover:border-black text-gray-600 hover:text-black",
    socialButtonsBlockButtonText: "font-semibold",
    formButtonReset:
      "bg-white border border-solid border-gray-200 hover:bg-transparent hover:border-black text-gray-500 hover:text-black",
    membersPageInviteButton:
      "bg-black border border-black border-solid hover:bg-white hover:text-black",
    card: "bg-[#fafafa]",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-hidden`}>
        <ClerkProvider appearance={theme}>
          <Toaster />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
