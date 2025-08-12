import "../styles/globals.css"

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { CampProvider } from "@campnetwork/origin/react"
import { Providers } from "./provider"



const inter = Inter({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: 'PromptVerse - AI Prompt Marketplace',
  description: 'The ultimate AI prompt marketplace where creativity meets blockchain technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
            <Providers >
              {children}
            </Providers>

      </body>
    </html>
  )
}
