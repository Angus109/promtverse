"use client"

import { useState, useEffect } from 'react'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Progress } from "../../components/ui/progress"
import { Link2, Plus, Play, Pause, RotateCcw, Save, Share2, Eye, Users, Star, Zap, Sparkles, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { CampProvider, CampModal, useAuthState, useAuth } from '@campnetwork/origin/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function ChainsPage() {
  const { authenticated, user, use } = useAuthState()
  const auth = useAuth()
  const [chains, setChains] = useState([])
  const [myChains, setMyChains] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("explore")
  const [isCreating, setIsCreating] = useState(false)
  const [newChain, setNewChain] = useState({
    title: '',
    description: '',
    prompts: [{ id: 1, content: '', order: 1 }]
  })

  useEffect(() => {
    const fetchChains = async () => {
      try {
        // Mock data for prompt chains
        const mockChains = [
          {
            id: 1,
            title: "Complete Character Development Chain",
            description: "A comprehensive chain for creating detailed character profiles from concept to final design",
            creator: "CharacterMaster",
            prompts: [
              { id: 1, title: "Character Concept", content: "Create a basic character concept with personality traits...", order: 1 },
              { id: 2, title: "Visual Design", content: "Design the visual appearance based on the character concept...", order: 2 },
              { id: 3, title: "Background Story", content: "Develop a compelling backstory for the character...", order: 3 },
              { id: 4, title: "Final Polish", content: "Refine and polish all aspects of the character...", order: 4 }
            ],
            tags: ["character", "design", "storytelling"],
            rating: 4.8,
            uses: 1250,
            price: "0.08",
            featured: true,
            image: "/placeholder.svg?height=200&width=300"
          },
          {
            id: 2,
            title: "World Building Masterclass",
            description: "Step-by-step chain for creating immersive fantasy worlds",
            creator: "WorldBuilder",
            prompts: [
              { id: 1, title: "Geography & Climate", content: "Design the physical world and climate systems...", order: 1 },
              { id: 2, title: "Cultures & Societies", content: "Create diverse cultures and social structures...", order: 2 },
              { id: 3, title: "History & Lore", content: "Develop rich history and mythology...", order: 3 }
            ],
            tags: ["worldbuilding", "fantasy", "lore"],
            rating: 4.9,
            uses: 890,
            price: "0.12",
            featured: false,
            image: "/placeholder.svg?height=200&width=300"
          },
          {
            id: 3,
            title: "Logo Design Process",
            description: "Professional logo design workflow from brief to final delivery",
            creator: "DesignPro",
            prompts: [
              { id: 1, title: "Brand Analysis", content: "Analyze brand requirements and target audience...", order: 1 },
              { id: 2, title: "Concept Sketches", content: "Create initial logo concepts and variations...", order: 2 },
              { id: 3, title: "Digital Refinement", content: "Refine chosen concept digitally...", order: 3 },
              { id: 4, title: "Final Presentation", content: "Prepare final logo with brand guidelines...", order: 4 }
            ],
            tags: ["logo", "branding", "design"],
            rating: 4.7,
            uses: 650,
            price: "0.06",
            featured: false,
            image: "/placeholder.svg?height=200&width=300"
          }
        ]

        setChains(mockChains)

        // Mock user's chains
        if (authenticated) {
          const userChains = [
            {
              id: 101,
              title: "My Custom Art Chain",
              description: "Personal workflow for digital art creation",
              prompts: [
                { id: 1, title: "Sketch", content: "Create initial sketch...", order: 1 },
                { id: 2, title: "Color", content: "Add colors and shading...", order: 2 }
              ],
              tags: ["art", "digital", "personal"],
              rating: 0,
              uses: 0,
              price: "0.00",
              isPublic: false
            }
          ]
          setMyChains(userChains)
        }
      } catch (error) {
        console.error("Error fetching chains:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchChains()
  }, [authenticated])

  const addPromptToChain = () => {
    const newPrompt = {
      id: newChain.prompts.length + 1,
      content: '',
      order: newChain.prompts.length + 1
    }
    setNewChain(prev => ({
      ...prev,
      prompts: [...prev.prompts, newPrompt]
    }))
  }

  const removePromptFromChain = (promptId) => {
    setNewChain(prev => ({
      ...prev,
      prompts: prev.prompts.filter(p => p.id !== promptId)
    }))
  }

  const updatePromptContent = (promptId, content) => {
    setNewChain(prev => ({
      ...prev,
      prompts: prev.prompts.map(p => 
        p.id === promptId ? { ...p, content } : p
      )
    }))
  }

  const handleCreateChain = async () => {
    if (!authenticated) {
      alert("Please connect your wallet first")
      return
    }

    setIsCreating(true)
    try {
      // In a real app, you'd save this to the blockchain/database
      const chainData = {
        ...newChain,
        id: Date.now(),
        creator: user?.username || 'Anonymous',
        rating: 0,
        uses: 0,
        price: "0.00",
        isPublic: false
      }

      setMyChains(prev => [...prev, chainData])
      
      // Reset form
      setNewChain({
        title: '',
        description: '',
        prompts: [{ id: 1, content: '', order: 1 }]
      })

      alert("Chain created successfully!")
    } catch (error) {
      console.error("Error creating chain:", error)
      alert("Failed to create chain. Please try again.")
    } finally {
      setIsCreating(false)
    }
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
              <Link href="/chains" className="text-yellow-400 font-semibold">
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
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            <Link2 className="inline-block mr-3 h-10 w-10 text-blue-400" />
            Prompt Chains
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Create and discover powerful prompt chains that guide users through complex creative processes step by step.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/30">
            <TabsTrigger value="explore" className="text-white">Explore Chains</TabsTrigger>
            <TabsTrigger value="create" className="text-white">Create Chain</TabsTrigger>
            <TabsTrigger value="my-chains" className="text-white">My Chains</TabsTrigger>
          </TabsList>

          {/* Explore Chains */}
          <TabsContent value="explore" className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chains.map((chain) => (
                  <Card key={chain.id} className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105">
                    <div className="relative">
                      <img
                        src={chain.image || "/placeholder.svg"}
                        alt={chain.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {chain.featured && (
                        <Badge className="absolute top-3 right-3 bg-blue-400 text-white">
                          <Zap className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-black/60 text-white">
                          {chain.prompts.length} Steps
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-white text-xl">{chain.title}</CardTitle>
                      <CardDescription className="text-gray-300">
                        {chain.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {chain.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-blue-600/30 text-blue-200">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-white font-semibold">{chain.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-blue-400" />
                            <span className="text-gray-400">{chain.uses}</span>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-blue-400">{chain.price} ETH</div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                          by <span className="text-blue-400 font-semibold">{chain.creator}</span>
                        </div>
                        <Button className="bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white font-semibold">
                          <Play className="mr-2 h-4 w-4" />
                          Start Chain
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Create Chain */}
          <TabsContent value="create" className="space-y-6">
            {!authenticated ? (
              <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                <CardHeader className="text-center">
                  <Link2 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <CardTitle className="text-white text-2xl">Connect Your Wallet</CardTitle>
                  <CardDescription className="text-gray-300">
                    You need to connect your wallet to create prompt chains
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <CampModal />
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chain Builder */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-white">Chain Information</CardTitle>
                      <CardDescription className="text-gray-300">
                        Provide basic information about your prompt chain
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-white font-semibold mb-2 block">Title</label>
                        <Input
                          value={newChain.title}
                          onChange={(e) => setNewChain(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g., Complete Character Development Chain"
                          className="bg-black/30 border-purple-500/30 text-white placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label className="text-white font-semibold mb-2 block">Description</label>
                        <Textarea
                          value={newChain.description}
                          onChange={(e) => setNewChain(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe what your chain accomplishes and who it's for..."
                          rows={3}
                          className="bg-black/30 border-purple-500/30 text-white placeholder-gray-400"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white">Chain Steps</CardTitle>
                          <CardDescription className="text-gray-300">
                            Add prompts that will guide users through your process
                          </CardDescription>
                        </div>
                        <Button
                          onClick={addPromptToChain}
                          className="bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Step
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {newChain.prompts.map((prompt, index) => (
                        <Card key={prompt.id} className="bg-black/20 border-gray-600">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-white text-lg">Step {index + 1}</CardTitle>
                              {newChain.prompts.length > 1 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removePromptFromChain(prompt.id)}
                                  className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <Textarea
                              value={prompt.content}
                              onChange={(e) => updatePromptContent(prompt.id, e.target.value)}
                              placeholder={`Enter the prompt for step ${index + 1}...`}
                              rows={4}
                              className="bg-black/30 border-gray-500/30 text-white placeholder-gray-400"
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>

                  <div className="flex justify-end space-x-4">
                    <Button
                      variant="outline"
                      className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white"
                    >
                      Save Draft
                    </Button>
                    <Button
                      onClick={handleCreateChain}
                      disabled={isCreating || !newChain.title || !newChain.description}
                      className="bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-8"
                    >
                      {isCreating ? (
                        <>
                          <Zap className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Create Chain
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Preview */}
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border-blue-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Eye className="mr-2 h-5 w-5" />
                        Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-white font-semibold text-lg">
                            {newChain.title || 'Your Chain Title'}
                          </h3>
                          <p className="text-gray-300 text-sm mt-1">
                            {newChain.description || 'Your chain description will appear here...'}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-white font-semibold text-sm">Steps ({newChain.prompts.length})</div>
                          {newChain.prompts.map((prompt, index) => (
                            <div key={prompt.id} className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-blue-400 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </div>
                              <div className="text-gray-300 text-sm">
                                {prompt.content ? `${prompt.content.slice(0, 30)}...` : `Step ${index + 1}`}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-600">
                          <div className="text-gray-400 text-sm">
                            by {user?.username || 'You'}
                          </div>
                          <div className="text-blue-400 font-bold">
                            Free
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/30">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">💡 Chain Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-gray-300">
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p>Each step should build upon the previous one</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p>Include clear instructions and examples</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p>Test your chain before publishing</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p>Keep steps focused and actionable</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* My Chains */}
          <TabsContent value="my-chains" className="space-y-6">
            {!authenticated ? (
              <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                <CardHeader className="text-center">
                  <CardTitle className="text-white text-2xl">Connect Your Wallet</CardTitle>
                  <CardDescription className="text-gray-300">
                    Connect your wallet to view and manage your chains
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <CampModal />
                </CardContent>
              </Card>
            ) : myChains.length === 0 ? (
              <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                <CardHeader className="text-center">
                  <Link2 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <CardTitle className="text-white text-2xl">No Chains Yet</CardTitle>
                  <CardDescription className="text-gray-300">
                    You haven't created any prompt chains yet. Start building your first chain!
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    onClick={() => setActiveTab("create")}
                    className="bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white font-semibold"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Chain
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myChains.map((chain) => (
                  <Card key={chain.id} className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white text-xl">{chain.title}</CardTitle>
                          <CardDescription className="text-gray-300">
                            {chain.description}
                          </CardDescription>
                        </div>
                        <Badge className={chain.isPublic ? "bg-green-500" : "bg-gray-500"}>
                          {chain.isPublic ? "Public" : "Draft"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {chain.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-purple-600/30 text-purple-200">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-400">
                          {chain.prompts.length} steps
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-blue-400" />
                            <span className="text-gray-400">{chain.uses}</span>
                          </div>
                          {chain.rating > 0 && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-white font-semibold">{chain.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function Chains() {
  return (
    <QueryClientProvider client={queryClient}>
      <CampProvider 
        clientId={process.env.NEXT_PUBLIC_CAMP_CLIENT_ID || "your-client-id"}
        redirectUri={typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}
        environment="production"
      >
        <ChainsPage />
      </CampProvider>
    </QueryClientProvider>
  )
}
