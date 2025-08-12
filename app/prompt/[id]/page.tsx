"use client"

import { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Separator } from "../../../components/ui/separator"
import { Star, Heart, Share2, Download, Eye, DollarSign, Clock, Shield, Users, Zap, Copy, ExternalLink, Flag, MessageCircle, ThumbsUp, ChevronLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { CampProvider, CampModal, useAuthState, useAuth } from '@campnetwork/origin/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Navbar from '../../../components/navbar'
import { StatusModal } from '../../../components/modal'



export default function PromptDetailPage() {
  const { authenticated } = useAuthState()
  const auth = useAuth()
  const params = useParams()
  const [promptData, setPromptData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const [reviews, setReviews] = useState([])
  const [modalType, setModalType] = useState<null | "success" | "error" | "warning" | "maintenance">(null);

  useEffect(() => {
    const fetchPromptData = async () => {
      try {
        if (auth.origin && params.id) {
          // Fetch token data from Camp Network
          const tokenId = BigInt(params.id as string)
          const tokenData = await auth.origin.getData(tokenId)
        

          // // Check if user has access
          // if (authenticated && auth.walletAddress) {
          //   const access = await auth.origin.hasAccess(auth.origin, auth.walletAddress, tokenId)
          //   setHasAccess(access)
          // }

          // Process token data
          const processedData = {
            id: tokenData.tokenId.toString(),
            title: tokenData.metadata?.name || `AI Prompt #${tokenData.tokenId}`,
            description: tokenData.metadata?.description || "Premium AI prompt for creative projects",
            promptText: tokenData.metadata?.promptText || "Prompt content available after purchase",
            price: (parseFloat(tokenData.price || "0.05") / 1e18).toFixed(3),
            creator: {
              username: tokenData.creator || "Anonymous",
              avatar: `/placeholder.svg?height=60&width=60&query=creator`,
              verified: true,
              followers: Math.floor(Math.random() * 1000) + 100,
              totalPrompts: Math.floor(Math.random() * 50) + 10,
              address: tokenData.creator
            },
            tags: tokenData.metadata?.tags || ["ai", "prompt", "creative"],
            rating: 4.0 + Math.random() * 1.0,
            reviews: Math.floor(Math.random() * 100) + 20,
            sales: Math.floor(Math.random() * 500) + 50,
            views: Math.floor(Math.random() * 2000) + 500,
            category: tokenData.metadata?.category || "Art & Design",
            aiModel: tokenData.metadata?.aiModel || "GPT-4",
            createdAt: tokenData.createdAt || new Date().toISOString(),
            updatedAt: tokenData.updatedAt || new Date().toISOString(),
            images: [
              tokenData.metadata?.image || `/placeholder.svg?height=400&width=400&query=ai prompt ${params.id}`,
              `/placeholder.svg?height=400&width=400&query=ai prompt ${params.id} variant 1`,
              `/placeholder.svg?height=400&width=400&query=ai prompt ${params.id} variant 2`,
              `/placeholder.svg?height=400&width=400&query=ai prompt ${params.id} variant 3`
            ],
            license: {
              type: "Standard License",
              description: "Multiple uses, limited commercial rights",
              duration: "Lifetime",
              royalty: 10
            },
            features: [
              "High-quality prompt generation",
              "Customizable parameters",
              "Multiple style variations",
              "Commercial usage rights",
              "Lifetime updates"
            ]
          }

          setPromptData(processedData)

          // Mock reviews data
          setReviews([
            {
              id: 1,
              user: "ArtLover123",
              avatar: "/placeholder.svg?height=40&width=40",
              rating: 5,
              comment: "Amazing prompt! Generated exactly what I was looking for. The results are incredibly detailed and unique.",
              date: new Date(Date.now() - 86400000 * 2).toISOString(),
              helpful: 12
            },
            {
              id: 2,
              user: "GameDev_Pro",
              avatar: "/placeholder.svg?height=40&width=40",
              rating: 5,
              comment: "Perfect for my indie game project. The variety of outputs I can create with this prompt is outstanding.",
              date: new Date(Date.now() - 86400000 * 5).toISOString(),
              helpful: 8
            },
            {
              id: 3,
              user: "DigitalArtist",
              avatar: "/placeholder.svg?height=40&width=40",
              rating: 4,
              comment: "Great prompt with lots of customization options. Would love to see more variations.",
              date: new Date(Date.now() - 86400000 * 7).toISOString(),
              helpful: 5
            }
          ])
        }
      } catch (error) {
        console.error("Error fetching prompt data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPromptData()
  }, [auth.origin, params.id, authenticated,])

  const handlePurchase = async () => {
    if (!authenticated) {
      alert("Please connect your wallet first")
      return
    }

    if (!promptData) return

    setIsPurchasing(true)
    try {

      setModalType("maintenance")

      // const tokenId = BigInt(promptData.id)
      // const periods = 1 // Buy access for 1 period

      // await auth.origin.buyAccessSmart(tokenId, periods)

      // alert("Purchase successful! You now have access to this prompt.")
      // setHasAccess(true)
    } catch (error) {
      console.error("Purchase failed:", error)
      alert("Purchase failed. Please try again.")
    } finally {
      setIsPurchasing(false)
    }
  }

  const handleCopyPrompt = () => {
    if (promptData?.promptText) {
      navigator.clipboard.writeText(promptData.promptText)
      alert("Prompt copied to clipboard!")
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: promptData?.title,
        text: promptData?.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-yellow-400 mx-auto mb-4 animate-spin" />
          <p className="text-white text-lg">Loading prompt details...</p>
        </div>
      </div>
    )
  }

  if (!promptData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30 max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">Prompt Not Found</CardTitle>
            <CardDescription className="text-gray-300">
              The prompt you're looking for doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/marketplace">
              <Button className="bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-semibold">
                Browse Marketplace
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

      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/marketplace" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <img
                    src={promptData.images[selectedImage] || "/placeholder.svg"}
                    alt={`${promptData.title} - Preview ${selectedImage + 1}`}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  <div className="grid grid-cols-4 gap-2">
                    {promptData.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative rounded-lg overflow-hidden ${selectedImage === index ? 'ring-2 ring-yellow-400' : ''
                          }`}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prompt Details */}
            <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl text-white mb-2">{promptData.title}</CardTitle>
                    <CardDescription className="text-gray-300 text-lg">
                      {promptData.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsLiked(!isLiked)}
                      className={`border-pink-400 ${isLiked ? 'bg-pink-400 text-white' : 'text-pink-400 hover:bg-pink-400 hover:text-white'}`}
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {promptData.tags.map((tag) => (
                      <Badge key={tag} className="bg-purple-600/30 text-purple-200">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-yellow-400">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-bold">{promptData.rating.toFixed(1)}</span>
                      </div>
                      <div className="text-gray-400 text-sm">{promptData.reviews} reviews</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-green-400">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-bold">{promptData.sales}</span>
                      </div>
                      <div className="text-gray-400 text-sm">sales</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-blue-400">
                        <Eye className="h-4 w-4" />
                        <span className="font-bold">{promptData.views}</span>
                      </div>
                      <div className="text-gray-400 text-sm">views</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-purple-400">
                        <Clock className="h-4 w-4" />
                        <span className="font-bold">{new Date(promptData.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-gray-400 text-sm">created</div>
                    </div>
                  </div>

                  {/* Creator Info */}
                  <div className="flex items-center space-x-4 p-4 bg-black/20 rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={promptData.creator.avatar || "/placeholder.svg"} alt={promptData.creator.username} />
                      <AvatarFallback>{promptData.creator.username.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-white font-semibold">{promptData.creator.username}</h4>
                        {promptData.creator.verified && (
                          <Badge className="bg-blue-500 text-white">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">
                        {promptData.creator.followers} followers • {promptData.creator.totalPrompts} prompts
                      </p>
                    </div>
                    <Link href={`/creator/${promptData.creator.address}`}>
                      <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="prompt" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-black/30">
                <TabsTrigger value="prompt" className="text-white">Prompt</TabsTrigger>
                <TabsTrigger value="reviews" className="text-white">Reviews</TabsTrigger>
                <TabsTrigger value="details" className="text-white">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="prompt">
                <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      Prompt Text
                      {hasAccess && (
                        <Button
                          onClick={handleCopyPrompt}
                          size="sm"
                          className="bg-gradient-to-r from-yellow-400 to-pink-400 text-black"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {hasAccess ? (
                      <pre className="text-gray-300 whitespace-pre-wrap bg-black/30 p-4 rounded-lg font-mono text-sm">
                        {promptData.promptText}
                      </pre>
                    ) : (
                      <div className="bg-black/30 p-8 rounded-lg text-center">
                        <Shield className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                        <h3 className="text-white font-semibold text-lg mb-2">Premium Content</h3>
                        <p className="text-gray-300 mb-4">
                          Purchase this prompt to access the full prompt text and start creating amazing content.
                        </p>
                        <Button
                          onClick={handlePurchase}
                          disabled={isPurchasing}
                          className="bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-semibold"
                        >
                          {isPurchasing ? (
                            <>
                              <Zap className="mr-2 h-4 w-4 animate-pulse" />
                              Purchasing...
                            </>
                          ) : (
                            <>
                              <DollarSign className="mr-2 h-4 w-4" />
                              Purchase for {promptData.price} ETH
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Customer Reviews</CardTitle>
                    <CardDescription className="text-gray-300">
                      See what other creators are saying about this prompt
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-600 pb-4 last:border-b-0">
                          <div className="flex items-start space-x-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.user} />
                              <AvatarFallback>{review.user.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="text-white font-semibold">{review.user}</h4>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                                        }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-gray-400 text-sm">
                                  {new Date(review.date).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-300 mb-2">{review.comment}</p>
                              <div className="flex items-center space-x-4">
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                  <ThumbsUp className="h-3 w-3 mr-1" />
                                  Helpful ({review.helpful})
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                  <MessageCircle className="h-3 w-3 mr-1" />
                                  Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details">
                <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Prompt Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-white font-semibold mb-2">Technical Info</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Category:</span>
                              <span className="text-white">{promptData.category}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">AI Model:</span>
                              <span className="text-white">{promptData.aiModel}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Created:</span>
                              <span className="text-white">{new Date(promptData.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Updated:</span>
                              <span className="text-white">{new Date(promptData.updatedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-white font-semibold mb-2">License Info</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Type:</span>
                              <span className="text-white">{promptData.license.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Duration:</span>
                              <span className="text-white">{promptData.license.duration}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Royalty:</span>
                              <span className="text-white">{promptData.license.royalty}%</span>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm mt-2">{promptData.license.description}</p>
                        </div>
                      </div>

                      <Separator className="bg-gray-600" />

                      <div>
                        <h4 className="text-white font-semibold mb-3">Features Included</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {promptData.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-gray-300 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-500/30 sticky top-4">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center justify-between">
                  <span>{promptData.price} ETH</span>
                  <Badge className="bg-green-500 text-white">
                    <Zap className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  One-time purchase • Lifetime access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {hasAccess ? (
                  <div className="text-center">
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-4">
                      <Shield className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <p className="text-green-400 font-semibold">You own this prompt!</p>
                      <p className="text-gray-300 text-sm">Access granted • Use unlimited</p>
                    </div>
                    <Button
                      onClick={handleCopyPrompt}
                      className="w-full bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white font-semibold"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Prompt
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      onClick={handlePurchase}
                      disabled={!authenticated || isPurchasing}
                      className="w-full bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-semibold text-lg py-3"
                    >
                      {isPurchasing ? (
                        <>
                          <Zap className="mr-2 h-5 w-5 animate-pulse" />
                          Purchasing...
                        </>
                      ) : (
                        <>
                          <DollarSign className="mr-2 h-5 w-5" />
                          Buy Now
                        </>
                      )}
                    </Button>

                    {!authenticated && (
                      <p className="text-center text-gray-400 text-sm">
                        Connect your wallet to purchase
                      </p>
                    )}
                  </>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Shield className="h-4 w-4 text-green-400" />
                    <span>Secure blockchain transaction</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Download className="h-4 w-4 text-blue-400" />
                    <span>Instant access after purchase</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Users className="h-4 w-4 text-purple-400" />
                    <span>Join {promptData.sales}+ satisfied customers</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Prompts */}
            <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">More from {promptData.creator.username}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <img
                        src={`/placeholder.svg?height=60&width=60&query=related prompt ${i}`}
                        alt={`Related prompt ${i}`}
                        className="w-15 h-15 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-sm">Related Prompt #{i}</h4>
                        <p className="text-gray-400 text-xs">0.0{3 + i} ETH</p>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-gray-300 text-xs">{(4.5 + Math.random() * 0.5).toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href={`/creator/${promptData.creator.address}`}>
                  <Button variant="outline" className="w-full mt-4 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                    View All Prompts
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="bg-gradient-to-br from-gray-900/50 to-slate-900/50 border-gray-500/30">
              <CardHeader>
                <CardTitle className="text-white text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Creator
                </Button>
                <Button variant="outline" className="w-full border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Tutorial
                </Button>
                <Button variant="outline" className="w-full border-red-400 text-red-400 hover:bg-red-400 hover:text-white">
                  <Flag className="mr-2 h-4 w-4" />
                  Report Issue
                </Button>
              </CardContent>
            </Card>


            <StatusModal
              isOpen={!!modalType}
              type={modalType || "success"}
              title={
                modalType === "success"
                  ? "Success!"
                  : modalType === "error"
                    ? "Error!"
                    : modalType === "warning"
                      ? "Insufficient Funds"
                      : "System Maintenance"
              }
              message={
                modalType === "success"
                  ? "Your prompt was created successfully."
                  : modalType === "error"
                    ? "Something went wrong. Please try again."
                    : modalType === "warning"
                      ? "You do not have enough balance to complete this transaction."
                      : "The system is currently undergoing maintenance. Please check back later."
              }
              onClose={() => setModalType(null)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

