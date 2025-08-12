"use client"

import "../styles/globals.css"
import { useState, useEffect } from 'react'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Sparkles, TrendingUp, Users, Zap, Star, ArrowRight, Search, icons, Wallet } from 'lucide-react'
import Link from 'next/link'
import { CampProvider, CampModal, useAuthState, useAuth, useConnect, useModal } from '@campnetwork/origin/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from "@radix-ui/react-tooltip"
import { info } from "console"
import { structurePromptDetails, truncate } from "../lib/types"
import Navbar from "../components/navbar"
import { ethers, JsonRpcProvider, } from "ethers"; // Note the imports
import PromptMarketplaceABI from './../abi.json'
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import Image from "next/image"



const CAMP_RPC_URL = 'https://rpc.campnetwork.xyz'
const CONTRACT_ADDRESS = '0xb9504d2b36f9cf828ab883dda5622bb5530bc861' // Your contract address on Camp Network



let ethereum: any
let tx: any

if (typeof window !== 'undefined') {
  ethereum = (window as any).ethereum
}

export default function HomePage() {


  const { authenticated } = useAuthState()
  const { isOpen, closeModal, openModal } = useModal()
  const { connect, disconnect } = useConnect()
  console.log(authenticated)
  const auth = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [trendingPrompts, setTrendingPrompts] = useState([])
  const [featuredCreators, setFeaturedCreators] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPrompts: 17,
    activeCreators: 8,
    totalVolume: 0.5,
    totalSales: 0
  })




  const getContract = async () => {
    try {
      if (!auth.walletAddress) {
        throw new Error("Wallet not connected");
      }

      const provider = auth.walletAddress ? new ethers.BrowserProvider(ethereum) : new JsonRpcProvider(CAMP_RPC_URL);
      const signer = await provider.getSigner(auth.walletAddress ? undefined : auth.walletAddress);

      return new ethers.Contract(
        CONTRACT_ADDRESS,
        PromptMarketplaceABI,
        signer
      );
    } catch (error) {
      console.error("Failed to initialize contract:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // try {
      //   if (auth.origin) {
      //     // Fetch trending prompts using Origin API
      //     const contract = await getContract()
      //     const tx = await contract.getAllPromtsWithDetails()
      //     const promptsResponse = structurePromptDetails(tx)
      //     const processedPrompts = promptsResponse.slice(0, 6).map((token, index) => ({
      //       id: token?.id.toString(),
      //       title: token.title,
      //       description: token.description || "Premium AI prompt for creative projects",
      //       price: (token.price / 1e18).toFixed(3),
      //       creator: token.creator || "Anonymous",
      //       tags: token.tags || ["ai", "prompt", "creative"],
      //       rating: 4.5 + Math.random() * 0.5,
      //       sales: Math.floor(Math.random() * 1000) + 100,
      //       image: token.imageUri || `/placeholder.svg?height=200&width=300&query=ai prompt ${index + 1}`
      //     }))
      //     setTrendingPrompts(processedPrompts)

      //     // Get unique creators
      //     const creators = [...new Set(processedPrompts.map(p => p.creator))]
      //     const processedCreators = creators.slice(0, 3).map((creator, index) => ({
      //       name: creator,
      //       prompts: Math.floor(Math.random() * 50) + 10,
      //       earnings: (Math.random() * 20 + 5).toFixed(1),
      //       avatar: `/placeholder.svg?height=60&width=60&query=creator ${index + 1}`,
      //       address: `0x${Math.random().toString(16).substr(2, 40)}`
      //     }))
      //     setFeaturedCreators(processedCreators)

      //     // Calculate stats
      //     setStats({
      //       totalPrompts: promptsResponse.length,
      //       activeCreators: creators.length,
      //       totalVolume: Number(processedPrompts.reduce((sum, p) => sum + parseFloat(p.price), 0).toFixed(1)),
      //       totalSales: processedPrompts.reduce((sum, p) => sum + p.sales, 0)
      //     })
      //   }

      setLoading(false)

      setTrendingPrompts([
        {
          id: 1,
          title: "Anime Character Creator Pro",
          description: "Generate stunning anime characters with detailed backgrounds and unique personalities",
          price: "0.05",
          creator: "MangaMaster",
          tags: ["anime", "character", "art"],
          rating: 4.9,
          sales: 1250,
          image: "/promt/1.jpeg"
        },
        {
          id: 2,
          title: "Cyberpunk City Builder",
          description: "Create futuristic cyberpunk cityscapes with neon lights and flying cars",
          price: "0.08",
          creator: "NeonDreamer",
          tags: ["cyberpunk", "city", "futuristic"],
          rating: 4.8,
          sales: 890,
          image: "/promt/2.png"
        },
        {
          id: 3,
          title: "Magical Spell Descriptions",
          description: "Generate detailed magical spell descriptions for fantasy RPGs and stories",
          price: "0.03",
          creator: "SpellWeaver",
          tags: ["magic", "fantasy", "rpg"],
          rating: 4.7,
          sales: 2100,
          image: "/promt/3.png"
        }
      ])
      setFeaturedCreators([
        {
          name: "MangaMaster",
          prompts: 45,
          earnings: "12.5",
          avatar: "/placeholder.svg?height=60&width=60",
          address: "0x00000000000000000000000000000000000"
        },
        {
          name: "NeonDreamer",
          prompts: 32,
          earnings: "8.9",
          avatar: "/placeholder.svg?height=60&width=60",
          address: "0x00000000000000000000000000000000000"
        },
        {
          name: "SpellWeaver",
          prompts: 67,
          earnings: "15.2",
          avatar: "/placeholder.svg?height=60&width=60",
          address: "0x00000000000000000000000000000000000"
        }
      ])
    }

    fetchData()
  }, [auth.origin])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/marketplace?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <Navbar />

      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              The Ultimate AI Prompt Marketplace
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Discover, create, and trade premium AI prompts as NFTs. Join the revolution where creativity meets blockchain technology in a manga-inspired universe!
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search for prompts, creators, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-12 pr-4 py-4 text-lg bg-black/30 border-purple-500/30 text-white placeholder-gray-400 focus:border-yellow-400"
                />
                <Button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-semibold"
                >
                  Search
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Link href="/marketplace">
                <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-semibold text-lg px-8 py-4">
                  Explore Marketplace
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/create">
                <Button size="lg" variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white text-lg px-8 py-4">
                  Create Prompt
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-black/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">{stats.totalPrompts.toLocaleString()}+</div>
              <div className="text-gray-300">Prompts Created</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-400 mb-2">{stats.activeCreators.toLocaleString()}+</div>
              <div className="text-gray-300">Active Creators</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">{stats.totalVolume} ETH</div>
              <div className="text-gray-300">Total Volume</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">{stats.totalSales.toLocaleString()}+</div>
              <div className="text-gray-300">Prompt Sales</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Prompts */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold text-white">
              <TrendingUp className="inline-block mr-3 h-10 w-10 text-yellow-400" />
              Trending Prompts
            </h2>
            <Link href="/marketplace">
              <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30 animate-pulse">
                  <div className="h-48 bg-gray-700 rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-6 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-700 rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-700 rounded w-20"></div>
                      <div className="h-8 bg-gray-700 rounded w-24"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trendingPrompts.map((prompt) => (
                <Card key={prompt.id} className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
                  <div className="relative">
                    <img
                      src={prompt.image || ""}
                      alt={prompt.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-3 right-3 bg-yellow-400 text-black">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Hot
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-white text-xl">{prompt.title}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {prompt.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {prompt.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-purple-600/30 text-purple-200">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-white font-semibold">{prompt.rating.toFixed(1)}</span>
                        <span className="text-gray-400">({prompt.sales} sales)</span>
                      </div>
                      <div className="text-2xl font-bold text-yellow-400">{prompt.price} ETH</div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        by <span className="text-purple-400 font-semibold">{prompt.creator}</span>
                      </div>
                      <Link href={`/prompt/${prompt.id}`}>
                        <Button className="bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-semibold">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Creators */}
      <section className="py-20 px-4 bg-black/20">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold text-white">
              <Users className="inline-block mr-3 h-10 w-10 text-pink-400" />
              Featured Creators
            </h2>
            <Link href="/creators">
              <Button variant="outline" className="border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-white">
                View All Creators
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCreators.map((creator, index) => (
              <Card key={creator.name} className="bg-gradient-to-br from-pink-900/50 to-purple-900/50 border-pink-500/30 hover:border-pink-400/50 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage src={creator.avatar || "/placeholder.svg"} alt={creator.name} />
                    <AvatarFallback>{creator.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold text-white mb-2">{creator.name}</h3>
                  <div className="space-y-2 text-gray-300">
                    <div>{creator.prompts} Prompts Created</div>
                    <div className="text-pink-400 font-semibold text-lg">{creator.earnings} ETH Earned</div>
                  </div>
                  <Link href={`/creator/${creator.address}`}>
                    <Button className="mt-4 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white">
                      View Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Ready to Join the Revolution?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Start creating, trading, and earning with AI prompts today. Connect your wallet and become part of the PromptVerse community!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/create">
                <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-semibold text-lg px-8 py-4">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Creating
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button size="lg" variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white text-lg px-8 py-4">
                  <Search className="mr-2 h-5 w-5" />
                  Explore Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black/40 border-t border-purple-500/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-6 w-6 text-yellow-400" />
                <span className="text-xl font-bold text-white">PromptVerse</span>
              </div>
              <p className="text-gray-400">
                The ultimate AI prompt marketplace where creativity meets blockchain technology.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Marketplace</h4>
              <div className="space-y-2 text-gray-400">
                <div><Link href="/marketplace" className="hover:text-yellow-400">Browse Prompts</Link></div>
                <div><Link href="/creators" className="hover:text-yellow-400">Top Creators</Link></div>
                <div><Link href="/categories" className="hover:text-yellow-400">Categories</Link></div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Create</h4>
              <div className="space-y-2 text-gray-400">
                <div><Link href="/create" className="hover:text-yellow-400">Create Prompt</Link></div>
                <div><Link href="/chains" className="hover:text-yellow-400">Build Chains</Link></div>
                <div><Link href="/bounties" className="hover:text-yellow-400">Join Bounties</Link></div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <div className="space-y-2 text-gray-400">
                <div><Link href="/dao" className="hover:text-yellow-400">DAO Governance</Link></div>
                <div><a href="#" className="hover:text-yellow-400">Discord</a></div>
                <div><a href="#" className="hover:text-yellow-400">Twitter</a></div>
              </div>
            </div>
          </div>
          <div className="border-t border-purple-500/20 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PromptVerse. All rights reserved. Built with Camp Network SDK.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}



// export default function LandingPage() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <CampProvider 
//         clientId={process.env.}
//         redirectUri={typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}

//       >
//         <HomePage />
//       </CampProvider>
//     </QueryClientProvider>
//   )
// }
