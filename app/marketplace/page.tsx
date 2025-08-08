"use client"

import { useState, useEffect } from 'react'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Slider } from "../../components/ui/slider"
import { Checkbox } from "../../components/ui/checkbox"
import { Search, Filter, Star, TrendingUp, Grid, List, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { CampProvider, CampModal, useAuthState, useAuth } from '@campnetwork/origin/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'

const queryClient = new QueryClient()

const categories = ["All", "Art & Design", "Writing", "Environment", "Character", "Music", "Code"]
const aiModels = ["All", "GPT-4", "DALL-E 3", "Midjourney", "Stable Diffusion", "Claude"]
const sortOptions = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "sales", label: "Most Sales" }
]

function MarketplacePage() {
  const { authenticated } = useAuthState()
  const auth = useAuth()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedAiModel, setSelectedAiModel] = useState("All")
  const [priceRange, setPriceRange] = useState([0, 1])
  const [sortBy, setSortBy] = useState("trending")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [prompts, setPrompts] = useState([])
  const [filteredPrompts, setFilteredPrompts] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch prompts from Camp Network
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        if (auth.origin) {
          const tokensResponse = await auth.origin.getAllTokens()
          const processedPrompts = tokensResponse.map((token, index) => ({
            id: token.tokenId.toString(),
            title: token.metadata?.name || `AI Prompt #${token.tokenId}`,
            description: token.metadata?.description || "Premium AI prompt for creative projects",
            price: (parseFloat(token.price || "0.05") / 1e18).toFixed(3),
            creator: token.creator || "Anonymous",
            tags: token.metadata?.tags || ["ai", "prompt", "creative"],
            rating: 4.0 + Math.random() * 1.0,
            sales: Math.floor(Math.random() * 1000) + 50,
            category: token.metadata?.category || categories[Math.floor(Math.random() * (categories.length - 1)) + 1],
            aiModel: aiModels[Math.floor(Math.random() * (aiModels.length - 1)) + 1],
            createdAt: token.createdAt || new Date().toISOString(),
            image: token.metadata?.image || `/placeholder.svg?height=200&width=300&query=ai prompt ${index + 1}`,
            featured: Math.random() > 0.7
          }))
          setPrompts(processedPrompts)
        }
      } catch (error) {
        console.error("Error fetching prompts:", error)
        setPrompts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPrompts()
  }, [auth.origin])

  // Filter and sort prompts
  useEffect(() => {
    let filtered = prompts.filter(prompt => {
      const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = selectedCategory === "All" || prompt.category === selectedCategory
      const matchesAiModel = selectedAiModel === "All" || prompt.aiModel === selectedAiModel
      const matchesPrice = parseFloat(prompt.price) >= priceRange[0] && parseFloat(prompt.price) <= priceRange[1]
      
      return matchesSearch && matchesCategory && matchesAiModel && matchesPrice
    })

    // Sort prompts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price)
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price)
        case "rating":
          return b.rating - a.rating
        case "sales":
          return b.sales - a.sales
        case "trending":
        default:
          return b.sales - a.sales
      }
    })

    setFilteredPrompts(filtered)
  }, [prompts, searchQuery, selectedCategory, selectedAiModel, priceRange, sortBy])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="border-b border-purple-500/20 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-yellow-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                PromptVerse
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/marketplace" className="text-yellow-400 font-semibold">
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

            <div className="flex items-center space-x-4">
              <CampModal />
              {authenticated && (
                <Link href="/dashboard">
                  <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
                    Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Discover Amazing AI Prompts
          </h1>
          <p className="text-gray-300 text-lg">
            Browse through thousands of premium AI prompts created by talented artists and developers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search prompts, creators, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg bg-black/30 border-purple-500/30 text-white placeholder-gray-400 focus:border-yellow-400"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-black/30 border-purple-500/30 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-black/30 border-purple-500/30 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2 ml-auto">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <Card className="bg-black/30 border-purple-500/30">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-white font-semibold mb-2 block">AI Model</label>
                    <Select value={selectedAiModel} onValueChange={setSelectedAiModel}>
                      <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                        <SelectValue placeholder="AI Model" />
                      </SelectTrigger>
                      <SelectContent>
                        {aiModels.map(model => (
                          <SelectItem key={model} value={model}>{model}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-white font-semibold mb-2 block">
                      Price Range: {priceRange[0]} - {priceRange[1]} ETH
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={1}
                      min={0}
                      step={0.01}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-white font-semibold mb-2 block">Features</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="featured" />
                        <label htmlFor="featured" className="text-gray-300">Featured Only</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="verified" />
                        <label htmlFor="verified" className="text-gray-300">Verified Creators</label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-300">
          Showing {filteredPrompts.length} prompts
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
          <>
            {/* Prompts Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPrompts.map((prompt) => (
                  <Card key={prompt.id} className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
                    <div className="relative">
                      <img
                        src={prompt.image || "/placeholder.svg"}
                        alt={prompt.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {prompt.featured && (
                        <Badge className="absolute top-3 right-3 bg-yellow-400 text-black">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <Badge className="absolute top-3 left-3 bg-purple-600/80 text-white">
                        {prompt.aiModel}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-lg line-clamp-2">{prompt.title}</CardTitle>
                      <CardDescription className="text-gray-300 line-clamp-2">
                        {prompt.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {prompt.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-purple-600/30 text-purple-200 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-white font-semibold">{prompt.rating.toFixed(1)}</span>
                          <span className="text-gray-400 text-sm">({prompt.sales})</span>
                        </div>
                        <div className="text-xl font-bold text-yellow-400">{prompt.price} ETH</div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                          by <span className="text-purple-400 font-semibold">{prompt.creator}</span>
                        </div>
                        <Link href={`/prompt/${prompt.id}`}>
                          <Button size="sm" className="bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-semibold">
                            View
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPrompts.map((prompt) => (
                  <Card key={prompt.id} className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30 hover:border-yellow-400/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-6">
                        <img
                          src={prompt.image || "/placeholder.svg"}
                          alt={prompt.title}
                          className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-white mb-1">{prompt.title}</h3>
                              <p className="text-gray-300 mb-2">{prompt.description}</p>
                            </div>
                            <div className="text-2xl font-bold text-yellow-400">{prompt.price} ETH</div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {prompt.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="bg-purple-600/30 text-purple-200">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-white font-semibold">{prompt.rating.toFixed(1)}</span>
                              </div>
                              <div className="text-gray-400">{prompt.sales} sales</div>
                              <div className="text-gray-400">by {prompt.creator}</div>
                              <Badge className="bg-purple-600/80 text-white">{prompt.aiModel}</Badge>
                            </div>
                            <Link href={`/prompt/${prompt.id}`}>
                              <Button className="bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-semibold">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* No Results */}
            {filteredPrompts.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">No prompts found matching your criteria</div>
                <Button 
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("All")
                    setSelectedAiModel("All")
                    setPriceRange([0, 1])
                  }}
                  variant="outline" 
                  className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function Marketplace() {
  return (
    <QueryClientProvider client={queryClient}>
      <CampProvider 
        clientId={process.env.NEXT_PUBLIC_CAMP_CLIENT_ID || "your-client-id"}
        redirectUri={typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}
        environment="production"
      >
        <MarketplacePage />
      </CampProvider>
    </QueryClientProvider>
  )
}
