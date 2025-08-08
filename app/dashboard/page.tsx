"use client"

import { useState, useEffect } from 'react'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Progress } from "../../components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { DollarSign, TrendingUp, Eye, Star, Edit, Trash2, Share2, Download, Plus, BarChart3, Users, Zap, Crown, Twitter, Music, LinkIcon, Settings, Wallet } from 'lucide-react'
import Link from 'next/link'
import { CampProvider, CampModal, useAuthState, useAuth, useSocials, LinkButton } from '@campnetwork/origin/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

// Mock user data
const userData = {
  username: "PromptMaster",
  avatar: "/placeholder.svg?height=80&width=80",
  joinDate: "2024-01-15",
  totalEarnings: "45.8",
  totalSales: 1250,
  totalPrompts: 23,
  followers: 890,
  following: 156,
  rank: "Diamond Creator",
  multiplier: 2.5,
  points: 15420
}

const myPrompts = [
  {
    id: 1,
    title: "Anime Character Creator Pro",
    description: "Generate stunning anime characters with detailed backgrounds",
    price: "0.05",
    sales: 1250,
    earnings: "15.6",
    views: 5420,
    rating: 4.9,
    status: "active",
    image: "/placeholder.svg?height=150&width=200",
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    title: "Cyberpunk City Builder",
    description: "Create futuristic cyberpunk cityscapes with neon lights",
    price: "0.08",
    sales: 890,
    earnings: "22.4",
    views: 3210,
    rating: 4.8,
    status: "active",
    image: "/placeholder.svg?height=150&width=200",
    createdAt: "2024-01-10"
  },
  {
    id: 3,
    title: "Fantasy Spell Generator",
    description: "Generate magical spell descriptions for RPGs",
    price: "0.03",
    sales: 2100,
    earnings: "7.8",
    views: 8900,
    rating: 4.7,
    status: "draft",
    image: "/placeholder.svg?height=150&width=200",
    createdAt: "2024-01-20"
  }
]

const recentSales = [
  { id: 1, prompt: "Anime Character Creator Pro", buyer: "ArtLover123", amount: "0.05", date: "2024-01-25" },
  { id: 2, prompt: "Cyberpunk City Builder", buyer: "NeonFan", amount: "0.08", date: "2024-01-24" },
  { id: 3, prompt: "Fantasy Spell Generator", buyer: "RPGMaster", amount: "0.03", date: "2024-01-24" },
  { id: 4, prompt: "Anime Character Creator Pro", buyer: "MangaArtist", amount: "0.05", date: "2024-01-23" }
]

function DashboardPage() {
  const { authenticated } = useAuthState()
  const auth = useAuth()
  const { data: socialData, isLoading: socialsLoading } = useSocials()
  const [activeTab, setActiveTab] = useState("overview")
  const [originData, setOriginData] = useState<any>(null)
  const [originUploads, setOriginUploads] = useState<any[]>([])

  useEffect(() => {
    if (authenticated && auth.origin) {
      // Fetch Origin usage data
      auth.origin.getOriginUsage().then(data => {
        setOriginData(data)
      }).catch(console.error)

      // Fetch Origin uploads
      auth.origin.getOriginUploads().then(uploads => {
        setOriginUploads(uploads || [])
      }).catch(console.error)
    }
  }, [authenticated, auth])

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
          <CardHeader className="text-center">
            <Crown className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <CardTitle className="text-2xl text-white">Access Dashboard</CardTitle>
            <CardDescription className="text-gray-300">
              Connect your wallet to access your creator dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <CampModal />
            <div className="mt-4">
              <Link href="/" className="text-purple-400 hover:text-purple-300">
                ← Back to Home
              </Link>
            </div>
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
              <div className="h-8 w-8 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">P</span>
              </div>
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
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-yellow-400 to-pink-400 text-black font-semibold">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-6 mb-6">
            <Avatar className="h-20 w-20 border-4 border-yellow-400">
              <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.username} />
              <AvatarFallback className="bg-gradient-to-r from-yellow-400 to-pink-400 text-black font-bold text-xl">
                {userData.username.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{userData.username}</h1>
              <div className="flex items-center space-x-4 text-gray-300">
                <Badge className="bg-gradient-to-r from-yellow-400 to-pink-400 text-black">
                  <Crown className="h-3 w-3 mr-1" />
                  {userData.rank}
                </Badge>
                <span>Joined {new Date(userData.joinDate).toLocaleDateString()}</span>
                <span>{userData.followers} followers</span>
              </div>
            </div>
            <div className="ml-auto">
              <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>

          {/* Origin Stats */}
          {originData && (
            <Card className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/30 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-yellow-400" />
                  Origin Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{originData.user?.multiplier || 'N/A'}x</div>
                    <div className="text-gray-300">Multiplier</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">{originData.user?.points || 0}</div>
                    <div className="text-gray-300">Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {originData.user?.active ? 'Active' : 'Inactive'}
                    </div>
                    <div className="text-gray-300">Status</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{originUploads.length}</div>
                    <div className="text-gray-300">Uploads</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Total Earnings</p>
                    <p className="text-2xl font-bold text-green-400">{userData.totalEarnings} ETH</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Total Sales</p>
                    <p className="text-2xl font-bold text-blue-400">{userData.totalSales}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Active Prompts</p>
                    <p className="text-2xl font-bold text-purple-400">{userData.totalPrompts}</p>
                  </div>
                  <Eye className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Avg Rating</p>
                    <p className="text-2xl font-bold text-yellow-400">4.8</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-black/30 mb-8">
            <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
            <TabsTrigger value="prompts" className="text-white">My Prompts</TabsTrigger>
            <TabsTrigger value="sales" className="text-white">Sales</TabsTrigger>
            <TabsTrigger value="socials" className="text-white">Socials</TabsTrigger>
            <TabsTrigger value="analytics" className="text-white">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentSales.slice(0, 5).map((sale) => (
                      <div key={sale.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-semibold">{sale.prompt}</p>
                          <p className="text-gray-400 text-sm">Sold to {sale.buyer}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-semibold">{sale.amount} ETH</p>
                          <p className="text-gray-400 text-sm">{new Date(sale.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Chart */}
              <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Sales This Month</span>
                        <span className="text-white">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Views Growth</span>
                        <span className="text-white">92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Rating Average</span>
                        <span className="text-white">96%</span>
                      </div>
                      <Progress value={96} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/create">
                    <Button className="w-full bg-gradient-to-r from-yellow-400 to-pink-400 text-black font-semibold">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Prompt
                    </Button>
                  </Link>
                  <Link href="/chains">
                    <Button variant="outline" className="w-full border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Build Chain
                    </Button>
                  </Link>
                  <Link href="/bounties">
                    <Button variant="outline" className="w-full border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">
                      <Users className="mr-2 h-4 w-4" />
                      Join Bounty
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full border-green-400 text-green-400 hover:bg-green-400 hover:text-white">
                    <Wallet className="mr-2 h-4 w-4" />
                    Withdraw
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prompts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">My Prompts</h2>
              <Link href="/create">
                <Button className="bg-gradient-to-r from-yellow-400 to-pink-400 text-black font-semibold">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Prompt
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myPrompts.map((prompt) => (
                <Card key={prompt.id} className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                  <div className="relative">
                    <img
                      src={prompt.image || "/placeholder.svg"}
                      alt={prompt.title}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    <Badge className={`absolute top-3 right-3 ${
                      prompt.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                    } text-white`}>
                      {prompt.status}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{prompt.title}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {prompt.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-400">Sales:</span>
                        <span className="text-white font-semibold ml-2">{prompt.sales}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Earnings:</span>
                        <span className="text-green-400 font-semibold ml-2">{prompt.earnings} ETH</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Views:</span>
                        <span className="text-white font-semibold ml-2">{prompt.views}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Rating:</span>
                        <span className="text-yellow-400 font-semibold ml-2">{prompt.rating}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">
                        <Share2 className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white">Sales History</CardTitle>
                <CardDescription className="text-gray-300">
                  Track all your prompt sales and earnings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSales.map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-lg flex items-center justify-center">
                          <DollarSign className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">{sale.prompt}</p>
                          <p className="text-gray-400 text-sm">Purchased by {sale.buyer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold text-lg">{sale.amount} ETH</p>
                        <p className="text-gray-400 text-sm">{new Date(sale.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="socials" className="space-y-6">
            <Card className="bg-gradient-to-br from-pink-900/50 to-purple-900/50 border-pink-500/30">
              <CardHeader>
                <CardTitle className="text-white">Connected Socials</CardTitle>
                <CardDescription className="text-gray-300">
                  Link your social accounts to enhance your creator profile and unlock additional features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Twitter className="h-6 w-6 text-blue-400" />
                        <div>
                          <p className="text-white font-semibold">Twitter</p>
                          <p className="text-gray-400 text-sm">
                            {socialData?.twitter ? 'Connected' : 'Not connected'}
                          </p>
                        </div>
                      </div>
                      <LinkButton social="twitter" variant="default" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Music className="h-6 w-6 text-green-400" />
                        <div>
                          <p className="text-white font-semibold">Spotify</p>
                          <p className="text-gray-400 text-sm">
                            {socialData?.spotify ? 'Connected' : 'Not connected'}
                          </p>
                        </div>
                      </div>
                      <LinkButton social="spotify" variant="default" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-6 w-6 bg-purple-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">D</span>
                        </div>
                        <div>
                          <p className="text-white font-semibold">Discord</p>
                          <p className="text-gray-400 text-sm">
                            {socialData?.discord ? 'Connected' : 'Not connected'}
                          </p>
                        </div>
                      </div>
                      <LinkButton social="discord" variant="default" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-6 w-6 bg-black rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">T</span>
                        </div>
                        <div>
                          <p className="text-white font-semibold">TikTok</p>
                          <p className="text-gray-400 text-sm">
                            {socialData?.tiktok ? 'Connected' : 'Not connected'}
                          </p>
                        </div>
                      </div>
                      <LinkButton social="tiktok" variant="default" />
                    </div>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="text-blue-400 font-semibold mb-2">Benefits of Connecting Socials:</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Mint social data as IpNFTs using Camp Network Origin</li>
                      <li>• Enhanced creator verification and credibility</li>
                      <li>• Access to social-based prompt creation tools</li>
                      <li>• Increased visibility in the marketplace</li>
                      <li>• Unlock exclusive features and rewards</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Total Views</span>
                      <span className="text-white font-bold">25,430</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Conversion Rate</span>
                      <span className="text-green-400 font-bold">4.9%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Avg. Sale Price</span>
                      <span className="text-yellow-400 font-bold">0.057 ETH</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Return Customers</span>
                      <span className="text-purple-400 font-bold">23%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Top Performing Prompts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {myPrompts.slice(0, 3).map((prompt, index) => (
                      <div key={prompt.id} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full flex items-center justify-center text-black font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-semibold text-sm">{prompt.title}</p>
                          <p className="text-gray-400 text-xs">{prompt.sales} sales</p>
                        </div>
                        <div className="text-green-400 font-bold">{prompt.earnings} ETH</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <QueryClientProvider client={queryClient}>
      <CampProvider clientId="your-client-id">
        <DashboardPage />
      </CampProvider>
    </QueryClientProvider>
  )
}
