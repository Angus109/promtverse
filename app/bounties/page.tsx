"use client"

import { useState, useEffect } from 'react'

import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Trophy, Users, DollarSign, Plus, Search,  Upload, Send, Eye, Award, Target } from 'lucide-react'
import { CampModal, useAuthState, useAuth } from '@campnetwork/origin/react'
import Navbar from '../../components/navbar'
import { StatusModal } from '../../components/modal'

const bountyCategories = ["All", "Art & Design", "Writing", "Code", "Music", "Video", "Other"]
const bountyStatuses = ["All", "Open", "In Progress", "Completed", "Expired"]

const activeBounties = [
  {
    id: 1,
    title: "Create Cyberpunk Character Series",
    description: "Looking for 5 unique cyberpunk characters with detailed backgrounds and consistent art style. Must include character sheets and backstories.",
    category: "Art & Design",
    reward: "2.5",
    deadline: "2024-02-15",
    creator: {
      name: "GameStudio",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true
    },
    submissions: 23,
    status: "Open",
    requirements: [
      "5 unique character designs",
      "Consistent cyberpunk art style",
      "Character backstories included",
      "High resolution (4K minimum)"
    ]
  },
  {
    id: 2,
    title: "Fantasy World Building Prompts",
    description: "Need comprehensive prompts for generating fantasy worlds including geography, cultures, magic systems, and political structures.",
    category: "Writing",
    reward: "1.8",
    deadline: "2024-02-20",
    creator: {
      name: "FantasyAuthor",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true
    },
    submissions: 15,
    status: "Open",
    requirements: [
      "10+ world building prompts",
      "Cover all major aspects",
      "Detailed examples provided",
      "Compatible with GPT-4"
    ]
  },
  {
    id: 3,
    title: "AI Music Generation Workflow",
    description: "Create a complete workflow for generating background music for indie games using AI tools. Include different moods and genres.",
    category: "Music",
    reward: "3.2",
    deadline: "2024-02-10",
    creator: {
      name: "IndieGameDev",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: false
    },
    submissions: 8,
    status: "Open",
    requirements: [
      "Complete music workflow",
      "Multiple genres covered",
      "Game-ready formats",
      "Documentation included"
    ]
  }
]

const mySubmissions = [
  {
    id: 1,
    bountyId: 1,
    bountyTitle: "Create Cyberpunk Character Series",
    submittedAt: "2024-01-20",
    status: "Under Review",
    feedback: null,
    files: ["character1.png", "character2.png", "backstories.pdf"]
  },
  {
    id: 2,
    bountyId: 2,
    bountyTitle: "Fantasy World Building Prompts",
    submittedAt: "2024-01-18",
    status: "Accepted",
    feedback: "Excellent work! Very comprehensive and creative prompts.",
    files: ["world_prompts.txt", "examples.pdf"]
  }
]

export default function BountiesPage() {
  const { authenticated } = useAuthState()
  const auth = useAuth()
  const [activeTab, setActiveTab] = useState("browse")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [filteredBounties, setFilteredBounties] = useState(activeBounties)
  const [modalType, setModalType] = useState<null | "success" | "error" | "warning" | "maintenance">(null);

  // Create bounty form state
  const [bountyForm, setBountyForm] = useState({
    title: "",
    description: "",
    category: "",
    reward: "",
    deadline: "",
    requirements: [""]
  })

  // Submission form state
  const [submissionForm, setSubmissionForm] = useState({
    bountyId: null as number | null,
    description: "",
    files: [] as File[]
  })

  useEffect(() => {
    let filtered = activeBounties.filter(bounty => {
      const matchesSearch = bounty.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bounty.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || bounty.category === selectedCategory
      const matchesStatus = selectedStatus === "All" || bounty.status === selectedStatus

      return matchesSearch && matchesCategory && matchesStatus
    })

    setFilteredBounties(filtered)
  }, [searchQuery, selectedCategory, selectedStatus])

  const handleCreateBounty = async () => {
    if (!authenticated) {
      alert("Please connect your wallet first")
      return
    }


    setModalType('maintenance')

    // try {
    //   // Prepare bounty metadata
    //   const bountyMetadata = {
    //     title: bountyForm.title,
    //     description: bountyForm.description,
    //     category: bountyForm.category,
    //     reward: bountyForm.reward,
    //     deadline: bountyForm.deadline,
    //     requirements: bountyForm.requirements.filter(req => req.trim()),
    //     createdAt: new Date().toISOString(),
    //     type: "bounty"
    //   }

    //   // License terms for bounty
    //   const licenseTerms = {
    //     price: BigInt(Math.floor(parseFloat(bountyForm.reward) * 1e18)),
    //     duration: Math.floor((new Date(bountyForm.deadline).getTime() - Date.now()) / 1000),
    //     royaltyBps: 0, // No royalties for bounties
    //     paymentToken: "0x0000000000000000000000000000000000000000" as `0x${string}`
    //   }

    //   await auth.origin.registerIpNFT(
    //     "bounty",
    //     BigInt(Math.floor(Date.now() / 1000) + 3600),
    //     licenseTerms,
    //     bountyMetadata
    //   )

    //   alert("Bounty created successfully!")

    //   // Reset form
    //   setBountyForm({
    //     title: "",
    //     description: "",
    //     category: "",
    //     reward: "",
    //     deadline: "",
    //     requirements: [""]
    //   })
    //   setActiveTab("browse")

    // } catch (error: any) {
    //   console.error("Error creating bounty:", error)
    //   alert("Error creating bounty. Please try again.")
    // }
  }

  const handleSubmitToBounty = async () => {
    if (!authenticated || !submissionForm.bountyId) {
      alert("Please connect your wallet and select a bounty")
      return
    }

    setModalType("maintenance")

    // try {
    //   // Prepare submission metadata
    //   const submissionMetadata = {
    //     bountyId: submissionForm.bountyId,
    //     description: submissionForm.description,
    //     files: submissionForm.files.map(f => f.name),
    //     submittedAt: new Date().toISOString(),
    //     type: "bounty-submission"
    //   }

    //   // If files are included, mint with file
    //   if (submissionForm.files.length > 0) {
    //     const licenseTerms = {
    //       price: BigInt(0), // Free submission
    //       duration: 365 * 24 * 60 * 60,
    //       royaltyBps: 0,
    //       paymentToken: "0x0000000000000000000000000000000000000000" as `0x${string}`
    //     }

    //     await auth.origin.mintFile(
    //       submissionForm.files[0],
    //       submissionMetadata,
    //       licenseTerms
    //     )
    //   }

    //   alert("Submission sent successfully!")

    //   // Reset form
    //   setSubmissionForm({
    //     bountyId: null,
    //     description: "",
    //     files: []
    //   })

    // } catch (error: any) {
    //   console.error("Error submitting to bounty:", error)
    //   alert("Error submitting to bounty. Please try again.")
    // }
  }

  const addRequirement = () => {
    setBountyForm(prev => ({
      ...prev,
      requirements: [...prev.requirements, ""]
    }))
  }

  const updateRequirement = (index: number, value: string) => {
    setBountyForm(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }))
  }

  const removeRequirement = (index: number) => {
    setBountyForm(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}

      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Bounty Board
          </h1>
          <p className="text-gray-300 text-lg">
            Discover challenges, showcase your skills, and earn rewards for your creative work
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-500/30">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-400 mb-1">156</div>
              <div className="text-gray-300">Active Bounties</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/30">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400 mb-1">45.8 ETH</div>
              <div className="text-gray-300">Total Rewards</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/30">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400 mb-1">1,234</div>
              <div className="text-gray-300">Participants</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400 mb-1">89</div>
              <div className="text-gray-300">Completed</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-black/30 mb-8">
            <TabsTrigger value="browse" className="text-white">Browse Bounties</TabsTrigger>
            <TabsTrigger value="create" className="text-white">Create Bounty</TabsTrigger>
            <TabsTrigger value="submissions" className="text-white">My Submissions</TabsTrigger>
            <TabsTrigger value="manage" className="text-white">Manage</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Filters */}
            <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search bounties..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48 bg-black/30 border-purple-500/30 text-white">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {bountyCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-48 bg-black/30 border-purple-500/30 text-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {bountyStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Bounties List */}
            <div className="space-y-6">
              {filteredBounties.map((bounty) => (
                <Card key={bounty.id} className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30 hover:border-yellow-400/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-white">{bounty.title}</h3>
                          <Badge className={`${bounty.status === 'Open' ? 'bg-green-500' :
                            bounty.status === 'In Progress' ? 'bg-yellow-500' :
                              'bg-gray-500'
                            } text-white`}>
                            {bounty.status}
                          </Badge>
                          <Badge variant="secondary" className="bg-purple-600/30 text-purple-200">
                            {bounty.category}
                          </Badge>
                        </div>
                        <p className="text-gray-300 mb-4">{bounty.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="text-white font-semibold mb-2">Requirements:</h4>
                            <ul className="text-gray-300 text-sm space-y-1">
                              {bounty.requirements.map((req, index) => (
                                <li key={index} className="flex items-start">
                                  <Target className="h-3 w-3 text-yellow-400 mt-1 mr-2 flex-shrink-0" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Reward:</span>
                              <span className="text-2xl font-bold text-green-400">{bounty.reward} ETH</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Deadline:</span>
                              <span className="text-white">{new Date(bounty.deadline).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Submissions:</span>
                              <span className="text-blue-400 font-semibold">{bounty.submissions}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={bounty.creator.avatar || "/placeholder.svg"} alt={bounty.creator.name} />
                              <AvatarFallback>{bounty.creator.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="text-white font-semibold">{bounty.creator.name}</span>
                              {bounty.creator.verified && (
                                <Badge className="ml-2 bg-blue-500 text-white text-xs">Verified</Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button
                              onClick={() => {
                                setSubmissionForm(prev => ({ ...prev, bountyId: bounty.id }))
                                setActiveTab("submissions")
                              }}
                              className="bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-semibold"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Submit Entry
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            {!authenticated ? (
              <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                <CardHeader className="text-center">
                  <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <CardTitle className="text-2xl text-white">Connect Your Wallet</CardTitle>
                  <CardDescription className="text-gray-300">
                    You need to connect your wallet to create bounties
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <CampModal />
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-white">Create New Bounty</CardTitle>
                      <CardDescription className="text-gray-300">
                        Set up a challenge for the community to solve
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <label className="text-white font-semibold block mb-2">Bounty Title</label>
                        <Input
                          placeholder="Enter a clear, descriptive title"
                          value={bountyForm.title}
                          onChange={(e) => setBountyForm(prev => ({ ...prev, title: e.target.value }))}
                          className="bg-black/30 border-purple-500/30 text-white placeholder-gray-400"
                        />
                      </div>

                      <div>
                        <label className="text-white font-semibold block mb-2">Description</label>
                        <Textarea
                          placeholder="Provide detailed information about what you're looking for"
                          value={bountyForm.description}
                          onChange={(e) => setBountyForm(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                          className="bg-black/30 border-purple-500/30 text-white placeholder-gray-400"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-white font-semibold block mb-2">Category</label>
                          <Select value={bountyForm.category} onValueChange={(value) => setBountyForm(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {bountyCategories.slice(1).map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-white font-semibold block mb-2">Reward (ETH)</label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="0.00"
                            value={bountyForm.reward}
                            onChange={(e) => setBountyForm(prev => ({ ...prev, reward: e.target.value }))}
                            className="bg-black/30 border-purple-500/30 text-white placeholder-gray-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-white font-semibold block mb-2">Deadline</label>
                        <Input
                          type="date"
                          value={bountyForm.deadline}
                          onChange={(e) => setBountyForm(prev => ({ ...prev, deadline: e.target.value }))}
                          className="bg-black/30 border-purple-500/30 text-white"
                        />
                      </div>

                      <div>
                        <label className="text-white font-semibold block mb-2">Requirements</label>
                        <div className="space-y-2">
                          {bountyForm.requirements.map((req, index) => (
                            <div key={index} className="flex space-x-2">
                              <Input
                                placeholder={`Requirement ${index + 1}`}
                                value={req}
                                onChange={(e) => updateRequirement(index, e.target.value)}
                                className="bg-black/30 border-purple-500/30 text-white placeholder-gray-400"
                              />
                              {bountyForm.requirements.length > 1 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeRequirement(index)}
                                  className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            onClick={addRequirement}
                            className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Requirement
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/30">
                    <CardHeader>
                      <CardTitle className="text-white">Bounty Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Reward Amount:</span>
                        <span className="text-green-400 font-semibold">{bountyForm.reward || '0'} ETH</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Platform Fee (5%):</span>
                        <span className="text-white">{(parseFloat(bountyForm.reward || '0') * 0.05).toFixed(3)} ETH</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Total Cost:</span>
                        <span className="text-yellow-400 font-semibold">{(parseFloat(bountyForm.reward || '0') * 1.05).toFixed(3)} ETH</span>
                      </div>
                      <div className="border-t border-gray-600 pt-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Requirements:</span>
                          <span className="text-white">{bountyForm.requirements.filter(r => r.trim()).length}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    onClick={handleCreateBounty}
                    disabled={!bountyForm.title || !bountyForm.description || !bountyForm.category || !bountyForm.reward || !bountyForm.deadline}
                    className="w-full bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-semibold text-lg py-3"
                  >
                    <Trophy className="mr-2 h-5 w-5" />
                    Create Bounty
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="submissions" className="space-y-6">
            {!authenticated ? (
              <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                <CardHeader className="text-center">
                  <Send className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <CardTitle className="text-2xl text-white">Connect Your Wallet</CardTitle>
                  <CardDescription className="text-gray-300">
                    You need to connect your wallet to view and submit entries
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <CampModal />
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Submit to Bounty Form */}
                {submissionForm.bountyId && (
                  <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/30">
                    <CardHeader>
                      <CardTitle className="text-white">Submit Entry</CardTitle>
                      <CardDescription className="text-gray-300">
                        Submit your work for bounty #{submissionForm.bountyId}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-white font-semibold block mb-2">Submission Description</label>
                        <Textarea
                          placeholder="Describe your submission and how it meets the requirements"
                          value={submissionForm.description}
                          onChange={(e) => setSubmissionForm(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                          className="bg-black/30 border-blue-500/30 text-white placeholder-gray-400"
                        />
                      </div>

                      <div>
                        <label className="text-white font-semibold block mb-2">Upload Files</label>
                        <div className="border-2 border-dashed border-blue-500/30 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-300 mb-2">Upload your submission files</p>
                          <input
                            type="file"
                            multiple
                            onChange={(e) => {
                              if (e.target.files) {
                                setSubmissionForm(prev => ({
                                  ...prev,
                                  files: Array.from(e.target.files!)
                                }))
                              }
                            }}
                            className="hidden"
                            id="submission-files"
                          />
                          <Button
                            onClick={() => document.getElementById('submission-files')?.click()}
                            variant="outline"
                            className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                          >
                            Choose Files
                          </Button>
                        </div>
                        {submissionForm.files.length > 0 && (
                          <div className="mt-2">
                            <p className="text-gray-300 text-sm">Selected files:</p>
                            <ul className="text-gray-400 text-sm">
                              {submissionForm.files.map((file, index) => (
                                <li key={index}>\u2022 {file.name}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          onClick={handleSubmitToBounty}
                          disabled={!submissionForm.description.trim()}
                          className="bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-semibold"
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Submit Entry
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setSubmissionForm(prev => ({ ...prev, bountyId: null }))}
                          className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white"
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* My Submissions */}
                <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">My Submissions</CardTitle>
                    <CardDescription className="text-gray-300">
                      Track your bounty submissions and their status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mySubmissions.map((submission) => (
                        <div key={submission.id} className="bg-black/20 border border-purple-500/30 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="text-white font-semibold">{submission.bountyTitle}</h4>
                              <p className="text-gray-400 text-sm">Submitted on {new Date(submission.submittedAt).toLocaleDateString()}</p>
                            </div>
                            <Badge className={`${submission.status === 'Accepted' ? 'bg-green-500' :
                              submission.status === 'Under Review' ? 'bg-yellow-500' :
                                'bg-red-500'
                              } text-white`}>
                              {submission.status}
                            </Badge>
                          </div>

                          {submission.feedback && (
                            <div className="bg-green-900/20 border border-green-500/30 rounded p-3 mb-3">
                              <p className="text-green-400 text-sm font-semibold mb-1">Feedback:</p>
                              <p className="text-gray-300 text-sm">{submission.feedback}</p>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="text-gray-400 text-sm">
                              Files: {submission.files.join(', ')}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Manage Your Bounties</CardTitle>
                <CardDescription className="text-gray-300">
                  Review submissions and manage your active bounties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No bounties created yet</p>
                  <Button
                    onClick={() => setActiveTab("create")}
                    className="mt-4 bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-semibold"
                  >
                    Create Your First Bounty
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
  )
}
