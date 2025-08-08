"use client"

import { useState, useEffect } from 'react'
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Input } from "../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Star, Users, Calendar, MapPin, ExternalLink, MessageCircle, Heart, Share2, Grid, List, Filter, Search, Shield, Award, TrendingUp, Eye, DollarSign, Sparkles, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { CampProvider, CampModal, useAuthState, useAuth } from '@campnetwork/origin/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "popular", label: "Most Popular" }
]

function CreatorProfilePage() {
  const { authenticated } = useAuthState()
  const auth = useAuth()
  const params = useParams()
  const [creatorData, setCreatorData] = useState(null)
  const [creatorPrompts, setCreatorPrompts] = useState([])
  const [filteredPrompts, setFilteredPrompts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchCreatorData = async () => {
      try {
        if (auth.origin && params.address) {
          // Fetch all tokens by this creator
          const allTokens = await auth.origin.getAllTokens()
          const creatorTokens = allTokens.filter(token => 
            token.creator?.toLowerCase() === params.address.toLowerCase()
          )

          // Process creator data
          const totalEarnings = creatorTokens.reduce((sum, token) => {
            return sum + (parseFloat(token.price || "0") / 1e18)
          }, 0)

          const totalSales = creatorTokens.reduce((sum, token) => {
            return sum + Math.floor(Math.random() * 100) + 10
          }, 0)

          const processedCreator = {
            address: params.address,
            username: `Creator_${params.address.slice(-6)}`,
            displayName: `AI Prompt Master`,
            avatar: `/placeholder.svg?height=120&width=120&query=creator profile`,
            coverImage: `/placeholder.svg?height=300&width=800&query=creator cover`,
            verified: true,
            followers: Math.floor(Math.random() * 10000) + 500,
            following: Math.floor(Math.random() * 500) + 50,
            prompts: creatorTokens.length,
            earnings: totalEarnings.toFixed(3),
            totalSales,
            rating: 4.2 + Math.random() * 0.8,
            joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
            location: "Digital Realm",
            website: "https://example.com",
            bio: "Passionate AI prompt engineer creating innovative solutions for digital artists and content creators. Specializing in character design, environmental art, and creative writing prompts.",
            specialties: ["Character Design", "Environmental Art", "Creative Writing", "Digital Art"],
            achievements: [
              { title: "Top Creator", description: "Ranked in top 10 creators this month" },
              { title: "Verified Artist", description: "Verified for quality and authenticity" },
              { title: "Community Favorite", description: "Highly rated by the community" }
            ]
          }

          setCreatorData(processedCreator)

          // Process creator's prompts
          const processedPrompts = creatorTokens.map((token, index) => ({
            id: token.tokenId.toString(),
            title: token.metadata?.name || `AI Prompt #${token.tokenId}`,
            description: token.metadata?.description || "Premium AI prompt for creative projects",
            price: (parseFloat(token.price || "0.05") / 1e18).toFixed(3),
            tags: token.metadata?.tags || ["ai", "prompt", "creative"],
            rating: 4.0 + Math.random() * 1.0,
            sales: Math.floor(Math.random() * 500) + 50,
            views: Math.floor(Math.random() * 2000) + 500,
            category: token.metadata?.category || "Art & Design",
            createdAt: token.createdAt || new Date().toISOString(),
            image: token.metadata?.image || `/placeholder.svg?height=200&width=300&query=prompt ${index + 1}`,
            featured: Math.random() > 0.8
          }))

          setCreatorPrompts(processedPrompts)
        }
      } catch (error) {
        console.error("Error fetching creator data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCreatorData()
  }, [auth.origin, params.address])

  // Filter and sort prompts
  useEffect(() => {
    let filtered = creatorPrompts.filter(prompt =>
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    // Sort prompts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price)
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price)
        case "popular":
          return b.sales - a.sales
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    setFilteredPrompts(filtered)
  }, [creatorPrompts, searchQuery, sortBy])

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    // In a real app, you'd make an API call here
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${creatorData?.displayName} - PromptVerse`,
        text: creatorData?.bio,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Profile link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-yellow-400 mx-auto mb-4 animate-spin" />
          <p className="text-white text-lg">Loading creator profile...</p>
        </div>
      </div>
    )
  }

  if (!creatorData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30 max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">Creator Not Found</CardTitle>
            <CardDescription className="text-gray-300">
              The creator profile you're looking for doesn't exist.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/creators">
              <Button className="bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-semibold">
                Browse Creators
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

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

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/creators" className="inline-flex items-center text-purple-400 hover:text-purple-300">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Creators
        </Link>
      </div>

      {/* Cover Image */}
      <div className="relative h-64 md:h-80">
        <img
          src={creatorData.coverImage || "/placeholder.svg"}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      {/* Profile Header */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-32 w-32 border-4 border-yellow-400">
                <AvatarImage src={creatorData.avatar || "/placeholder.svg"} alt={creatorData.username} />
                <AvatarFallback className="text-2xl">{creatorData.username.slice(0, 2)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">{creatorData.displayName}</h1>
                  {creatorData.verified && (
                    <Badge className="bg-blue-500 text-white">
                      <Shield className="h-4 w-4 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-gray-400 mb-2">@{creatorData.username}</p>
                <p className="text-gray-300 mb-4 max-w-2xl">{creatorData.bio}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(creatorData.joinedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{creatorData.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ExternalLink className="h-4 w-4" />
                    <a href={creatorData.website} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">
                      Website
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {creatorData.specialties.map((specialty) => (
                    <Badge key={specialty} className="bg-purple-600/30 text-purple-200">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <Button
                  onClick={handleFollow}
                  className={`${
                    isFollowing
                      ? 'bg-gray-600 hover:bg-gray-700 text-white'
                      : 'bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white'
                  } font-semibold px-6`}
                >
                  <Users className="mr-2 h-4 w-4" />
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleShare}
                    className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{creatorData.followers.toLocaleString()}</div>
              <div className="text-gray-400 text-sm">Followers</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-pink-400">{creatorData.prompts}</div>
              <div className="text-gray-400 text-sm">Prompts</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{creatorData.earnings}</div>
              <div className="text-gray-400 text-sm">ETH Earned</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{creatorData.totalSales.toLocaleString()}</div>
              <div className="text-gray-400 text-sm">Total Sales</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-2xl font-bold text-yellow-400">{creatorData.rating.toFixed(1)}</span>
              </div>
              <div className="text-gray-400 text-sm">Rating</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <Tabs defaultValue="prompts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/30">
            <TabsTrigger value="prompts" className="text-white">Prompts ({creatorData.prompts})</TabsTrigger>
            <TabsTrigger value="achievements" className="text-white">Achievements</TabsTrigger>
            <TabsTrigger value="about" className="text-white">About</TabsTrigger>
          </TabsList>

          <TabsContent value="prompts" className="space-y-6">
            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search prompts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-black/30 border-purple-500/30 text-white placeholder-gray-400 focus:border-yellow-400"
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
                <div className="flex items-center space-x-2">
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
            </div>

            {/* Prompts Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                          {new Date(prompt.createdAt).toLocaleDateString()}
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
                              <div className="text-gray-400">{new Date(prompt.createdAt).toLocaleDateString()}</div>
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
            {filteredPrompts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">No prompts found</div>
                <Button 
                  onClick={() => setSearchQuery("")}
                  variant="outline" 
                  className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creatorData.achievements.map((achievement, index) => (
                <Card key={index} className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-500/30">
                  <CardContent className="p-6 text-center">
                    <Award className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">{achievement.title}</h3>
                    <p className="text-gray-300">{achievement.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about">
            <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">About {creatorData.displayName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-white font-semibold mb-2">Bio</h4>
                  <p className="text-gray-300">{creatorData.bio}</p>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {creatorData.specialties.map((specialty) => (
                      <Badge key={specialty} className="bg-purple-600/30 text-purple-200">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Contact</h4>
                    <div className="space-y-2 text-gray-300">
                      <div className="flex items-center space-x-2">
                        <ExternalLink className="h-4 w-4" />
                        <a href={creatorData.website} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400">
                          {creatorData.website}
                        </a>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{creatorData.location}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2">Stats</h4>
                    <div className="space-y-2 text-gray-300">
                      <div className="flex justify-between">
                        <span>Member since:</span>
                        <span>{new Date(creatorData.joinedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total earnings:</span>
                        <span className="text-green-400">{creatorData.earnings} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average rating:</span>
                        <span className="text-yellow-400">{creatorData.rating.toFixed(1)} ⭐</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function CreatorProfile() {
  return (
    <QueryClientProvider client={queryClient}>
      <CampProvider 
        clientId={process.env.NEXT_PUBLIC_CAMP_CLIENT_ID || "your-client-id"}
        redirectUri={typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}
        environment="production"
      >
        <CreatorProfilePage />
      </CampProvider>
    </QueryClientProvider>
  )
}
