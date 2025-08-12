"use client"

import { useState, useEffect } from 'react'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Search, Users, Star, Award,  Shield } from 'lucide-react'
import Link from 'next/link'
import {useAuthState, useAuth } from '@campnetwork/origin/react'

import Navbar from '../../components/navbar'
import { ethers, JsonRpcProvider, } from "ethers"; // Note the imports
import PromptMarketplaceABI from './../../abi.json'
// import { structureCreators } from '../../lib/types'


const sortOptions = [
  { value: "followers", label: "Most Followers" },
  { value: "prompts", label: "Most Prompts" },
  { value: "earnings", label: "Highest Earnings" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" }
]

const CAMP_RPC_URL = 'https://rpc.campnetwork.xyz'
const CONTRACT_ADDRESS = '0xb9504d2b36f9cf828ab883dda5622bb5530bc861' // Your contract address on Camp Network


let ethereum: any
let tx: any

if (typeof window !== 'undefined') {
  ethereum = (window as any).ethereum
}




export default function CreatorsPage() {
  const { authenticated } = useAuthState()
  const auth = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("followers")
  const [creators, setCreators] = useState([])
  const [filteredCreators, setFilteredCreators] = useState([])
  const [loading, setLoading] = useState(true)



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
    const fetchCreators = async () => {
      // try {
      //   if (auth.origin) {
      //     const contract = await getContract()
      //     const tx = await contract.getAllPromtsWithDetails()
      //     const creatorResponse = structureCreators(tx)

      //     const processedCreators = creatorResponse.slice(0, 6).map((token, index) => ({
      //       id: token.id,
      //       username: `Creator${index + 1}`,
      //       address: token.creatorAddress,
      //       avatar: token.avatarUri || `/placeholder.svg?height=80&width=80&query=creator ${index + 1}`,
      //       verified: Math.random() > 0.7,
      //       followers: Math.floor(Math.random() * 5000) + 100,
      //       prompts: token.promptCount,
      //       earnings: token.totalEarnings.toFixed(3),
      //       rating: 4.0 + Math.random() * 1.0,
      //       totalSales: token.totalSales || Math.floor(Math.random() * 100) + 10,
      //       joinedDate: token.joinedDate || new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      //       specialties: token.specialties || ["AI Art", "Character Design", "Prompts"][Math.floor(Math.random() * 3)],
      //       bio: token.bio || `Passionate AI prompt creator specializing in ${["digital art", "character design", "creative writing"][Math.floor(Math.random() * 3)]}.`
      //     }))

      //     setCreators(processedCreators)
      //   }
      // } catch (error) {
      //   console.error("Error fetching creators:", error)
        let creatorCount = 1
        setCreators([[
          {
            id: creatorCount++,
            username: "MangaMaster",
            prompts: 45,
            earnings: "12.5",
            avatar: "/placeholder.svg?height=60&width=60",
            rating: 4.0 + Math.random() * 1.0,
            joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
            bio: `Passionate AI prompt creator specializing in ${["digital art", "character design", "creative writing"][Math.floor(Math.random() * 3)]}.`,
            specialties: ["AI Art", "Character Design", "Prompts"][Math.floor(Math.random() * 3)],
            verified: Math.random() > 0.7,
            followers: Math.floor(Math.random() * 5000) + 100,
            address: 0x0000000000000000000000000000000000000000000,
            totalSales: Math.floor(Math.random() * 100) + 10,
          },


          {
            username: "NeonDreamer",
            prompts: 32,
            earnings: "8.9",
            avatar: "/placeholder.svg?height=60&width=60",
            rating: 4.0 + Math.random() * 1.0,
            joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
            bio: `Passionate AI prompt creator specializing in ${["digital art", "character design", "creative writing"][Math.floor(Math.random() * 3)]}.`,
            specialties: ["AI Art", "Character Design", "Prompts"][Math.floor(Math.random() * 3)],
            verified: Math.random() > 0.7,
            followers: Math.floor(Math.random() * 5000) + 100,
            address: 0x0000000000000000000000000000000000000000000,
            totalSales: Math.floor(Math.random() * 100) + 10,
          },
          {
           username: "SpellWeaver",
            prompts: 67,
            earnings: "15.2",
            avatar: "/placeholder.svg?height=60&width=60",
            rating: 4.0 + Math.random() * 1.0,
            joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
            bio: `Passionate AI prompt creator specializing in ${["digital art", "character design", "creative writing"][Math.floor(Math.random() * 3)]}.`,
            specialties: ["AI Art", "Character Design", "Prompts"][Math.floor(Math.random() * 3)],
            verified: Math.random() > 0.7,
            followers: Math.floor(Math.random() * 5000) + 100,
            address: 0x0000000000000000000000000000000000000000000,
            totalSales: Math.floor(Math.random() * 100) + 10,
          }
        ]])
      // } finally {
      //   setLoading(false)
      // }
    }

    fetchCreators()
    setLoading(false)
  }, [auth.origin])


  // Filter and sort creators
useEffect(() => {
  // Flatten creators in case of accidental nested arrays
  const flatCreators = Array.isArray(creators[0]) ? creators.flat() : creators;

  let filtered = flatCreators.filter(creator => {
    const username = creator?.username?.toString().toLowerCase() || "";
    const bio = creator?.bio?.toString().toLowerCase() || "";
    const specialties = Array.isArray(creator?.specialties)
      ? creator.specialties.join(" ").toLowerCase()
      : creator?.specialties?.toString().toLowerCase() || "";

    return (
      username.includes(searchQuery.toLowerCase()) ||
      bio.includes(searchQuery.toLowerCase()) ||
      specialties.includes(searchQuery.toLowerCase())
    );
  });

  // Sort creators
  filtered.sort((a, b) => {
    switch (sortBy) {
      case "followers":
        return b.followers - a.followers;
      case "prompts":
        return b.prompts - a.prompts;
      case "earnings":
        return parseFloat(b.earnings) - parseFloat(a.earnings);
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
      default:
        return b.followers - a.followers;
    }
  });

  setFilteredCreators(filtered);
}, [creators, searchQuery, sortBy]);



  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            <Users className="inline-block mr-3 h-10 w-10 text-pink-400" />
            Discover Creators
          </h1>
          <p className="text-gray-300 text-lg">
            Meet the talented creators behind the most innovative AI prompts
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search creators by name, bio, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg bg-black/30 border-purple-500/30 text-white placeholder-gray-400 focus:border-yellow-400"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 bg-black/30 border-purple-500/30 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-300">
          Showing {filteredCreators.length} creators
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30 animate-pulse">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-700 rounded mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-8 bg-gray-700 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Creators Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCreators.map((creator) => (
                <Card key={creator.id} className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30 hover:border-pink-400/50 transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={creator.avatar || "/placeholder.svg"} alt={creator.username} />
                        <AvatarFallback>{creator.username.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-xl font-bold text-white">{creator.username}</h3>
                          {creator.verified && (
                            <Badge className="bg-blue-500 text-white">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">{creator.specialties}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{creator.bio}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-pink-400">{creator.followers}</div>
                        <div className="text-gray-400 text-xs">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{creator.prompts}</div>
                        <div className="text-gray-400 text-xs">Prompts</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-white font-semibold">{creator.rating.toFixed(1)}</span>
                      </div>
                      <div className="text-green-400 font-bold">{creator.earnings} ETH</div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-gray-400 text-sm">
                        {creator.totalSales} total sales
                      </div>
                      <Link href={`/creator/${creator.address}`}>
                        <Button className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredCreators.length === 0 && !loading && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-400 text-lg mb-4">No creators found matching your search</div>
                <Button
                  onClick={() => setSearchQuery("")}
                  variant="outline"
                  className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </>
        )}

        {/* Top Creators Section */}
        {!loading && filteredCreators.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-8">
              <Award className="inline-block mr-3 h-8 w-8 text-yellow-400" />
              Top Creators This Month
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredCreators.slice(0, 3).map((creator, index) => (
                <Card key={creator.id} className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-500/30 relative">
                  <div className="absolute -top-3 -right-3">
                    <Badge className="bg-yellow-400 text-black text-lg px-3 py-1">
                      #{index + 1}
                    </Badge>
                  </div>
                  <CardHeader>
                    <div className="text-center">
                      <Avatar className="h-20 w-20 mx-auto mb-4">
                        <AvatarImage src={creator.avatar || "/placeholder.svg"} alt={creator.username} />
                        <AvatarFallback>{creator.username.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center justify-center space-x-2">
                        <h3 className="text-xl font-bold text-white">{creator.username}</h3>
                        {creator.verified && (
                          <Shield className="h-5 w-5 text-blue-400" />
                        )}
                      </div>
                      <p className="text-gray-300">{creator.specialties}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-lg font-bold text-yellow-400">{creator.followers}</div>
                        <div className="text-gray-400 text-xs">Followers</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-yellow-400">{creator.prompts}</div>
                        <div className="text-gray-400 text-xs">Prompts</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-yellow-400">{creator.earnings}</div>
                        <div className="text-gray-400 text-xs">ETH Earned</div>
                      </div>
                    </div>
                    <Link href={`/creator/${creator.address}`}>
                      <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-semibold">
                        View Profile
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

