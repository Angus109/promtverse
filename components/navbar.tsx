"use client"
import React, { useState } from "react"
import { CampModal, useAuth, useModal, useAuthState, useConnect } from "@campnetwork/origin/react"
import { Sparkles, Menu, X } from "lucide-react"
import Link from "next/link"
import { truncate } from "../lib/types"

export default function Navbar() {
  const { authenticated } = useAuthState()
  const { isOpen, closeModal, openModal } = useModal()
  const { connect, disconnect } = useConnect()
  const auth = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div>
      <nav className="border-b border-purple-500/20 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Sparkles className="h-8 w-8 text-yellow-400" />
                <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                  PromptVerse
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/marketplace" className="text-white hover:text-yellow-400 transition-colors">
                Marketplace
              </Link>
              <Link href="/create" className="text-white hover:text-yellow-400 transition-colors">
                Create
              </Link>
              <Link href="/chains" className="text-white hover:text-yellow-400 transition-colors">
                Chains
              </Link>
              <Link href="/bounties" className="text-white hover:text-yellow-400 transition-colors">
                Bounties
              </Link>
              <Link href="/dao" className="text-white hover:text-yellow-400 transition-colors">
                DAO
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center space-x-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:text-yellow-400 focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Wallet Connect Button - Hidden on mobile when menu is open */}
            <div className={`${mobileMenuOpen ? 'hidden' : 'flex'} md:flex items-center space-x-4`}>
              <CampModal
                injectButton={false}
                defaultProvider={
                  typeof window !== "undefined"
                    ? { Provider: window.ethereum, info: { name: "MetaMask", icons: "https://" } }
                    : undefined
                }
              />

              {authenticated ? (
                <button
                  className="h-[48px] w-[130px] sm:w-[148px] px-3 rounded-full text-sm font-bold transition-all duration-300 bg-[#1B5CFE] hover:bg-blue-500 bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black"
                  onClick={disconnect}
                >
                  {truncate({ text: auth.walletAddress, startChars: 4, endChars: 4, maxLength: 1 })}
                </button>
              ) : (
                <button
                  className="h-[48px] w-[130px] sm:w-[148px] px-3 rounded-full text-sm font-bold transition-all duration-300 bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black"
                  onClick={openModal}
                >
                  connect wallet
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-4 pb-2">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/marketplace"
                  className="text-white hover:text-yellow-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Marketplace
                </Link>
                <Link
                  href="/create"
                  className="text-white hover:text-yellow-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create
                </Link>
                <Link
                  href="/chains"
                  className="text-white hover:text-yellow-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Chains
                </Link>
                <Link
                  href="/bounties"
                  className="text-white hover:text-yellow-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Bounties
                </Link>
                <Link
                  href="/dao"
                  className="text-white hover:text-yellow-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  DAO
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}