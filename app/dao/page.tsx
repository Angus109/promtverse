"use client"

import { useState, useEffect } from 'react'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Progress } from "../../components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Vote, Users, Clock, CheckCircle,  Search,  MessageSquare, ThumbsUp, ThumbsDown, Crown, Gavel } from 'lucide-react'
import { CampModal, useAuthState, useAuth } from '@campnetwork/origin/react'

import Navbar from '../../components/navbar'
import { StatusModal } from '../../components/modal'


const proposalTypes = ["Feature Request", "Policy Change", "Treasury", "Moderation", "Partnership", "Other"]
const proposalStatuses = ["All", "Active", "Passed", "Failed", "Pending"]

const activeProposals = [
  {
    id: 1,
    title: "Implement Creator Verification System",
    description: "Introduce a verification system for creators to build trust and credibility in the marketplace. This would include identity verification, portfolio review, and community endorsements.",
    type: "Feature Request",
    proposer: {
      name: "CommunityLead",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
      tokens: 15000
    },
    votesFor: 12500,
    votesAgainst: 3200,
    totalVotes: 15700,
    quorum: 10000,
    endDate: "2024-02-15",
    status: "Active",
    discussion: 45,
    created: "2024-01-20"
  },
  {
    id: 2,
    title: "Reduce Platform Fees to 2%",
    description: "Lower the platform fee from 2.5% to 2% to make the marketplace more competitive and attractive to creators. This would increase creator earnings and potentially drive more volume.",
    type: "Policy Change",
    proposer: {
      name: "CreatorAdvocate",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
      tokens: 8500
    },
    votesFor: 8900,
    votesAgainst: 6100,
    totalVotes: 15000,
    quorum: 10000,
    endDate: "2024-02-18",
    status: "Active",
    discussion: 67,
    created: "2024-01-22"
  },
  {
    id: 3,
    title: "Establish Community Grant Program",
    description: "Allocate 100 ETH from treasury to fund community projects, educational content, and tools that benefit the PromptVerse ecosystem.",
    type: "Treasury",
    proposer: {
      name: "TreasuryManager",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
      tokens: 25000
    },
    votesFor: 18500,
    votesAgainst: 2100,
    totalVotes: 20600,
    quorum: 10000,
    endDate: "2024-02-12",
    status: "Active",
    discussion: 89,
    created: "2024-01-18"
  }
]

const governanceStats = {
  totalTokens: 1000000,
  circulatingTokens: 750000,
  totalHolders: 5420,
  activeProposals: 3,
  passedProposals: 12,
  treasuryBalance: "450.5"
}

export default function DAOPage() {
  const { authenticated } = useAuthState()
  const auth = useAuth()
  const [activeTab, setActiveTab] = useState("proposals")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [filteredProposals, setFilteredProposals] = useState(activeProposals)
  const [userTokens, setUserTokens] = useState(0)
  const [modalType, setModalType] = useState<null | "success" | "error" | "warning" | "maintenance">(null);

  // Create proposal form state
  const [proposalForm, setProposalForm] = useState({
    title: "",
    description: "",
    type: "",
    details: "",
    requestedAmount: "",
    duration: "7"
  })

  useEffect(() => {
    let filtered = activeProposals.filter(proposal => {
      const matchesSearch = proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = selectedType === "All" || proposal.type === selectedType
      const matchesStatus = selectedStatus === "All" || proposal.status === selectedStatus

      return matchesSearch && matchesType && matchesStatus
    })

    setFilteredProposals(filtered)
  }, [searchQuery, selectedType, selectedStatus])

  useEffect(() => {
    if (authenticated) {
      // In a real app, fetch user's governance token balance
      setUserTokens(1250) // Mock value
    }
  }, [authenticated])

  const handleCreateProposal = async () => {
    if (!authenticated) {
      alert("Please connect your wallet first")
      return
    }

    if (!proposalForm.title || !proposalForm.description || !proposalForm.type) {
      alert("Please fill in all required fields")
      return
    }

    setModalType('maintenance')


    // try {
    //   // Prepare proposal metadata
    //   const proposalMetadata = {
    //     title: proposalForm.title,
    //     description: proposalForm.description,
    //     type: proposalForm.type,
    //     details: proposalForm.details,
    //     requestedAmount: proposalForm.requestedAmount,
    //     duration: parseInt(proposalForm.duration),
    //     proposer: "user-address", // Would be actual user address
    //     createdAt: new Date().toISOString(),
    //     status: "Pending",
    //     votingPeriod: parseInt(proposalForm.duration) * 24 * 60 * 60, // Convert days to seconds

    //   }

    //   // License terms for proposal
    //   const licenseTerms = {
    //     price: BigInt(0), // Free to view
    //     duration: parseInt(proposalForm.duration) * 24 * 60 * 60,
    //     royaltyBps: 0,
    //     paymentToken: "0x0000000000000000000000000000000000000000" as `0x${string}`
    //   }

    //   await auth.origin.registerIpNFT(
    //     "proposal",
    //     BigInt(Math.floor(Date.now() / 1000) + 3600),
    //     licenseTerms,
    //     proposalMetadata
    //   )

    //   alert("Proposal submitted successfully! It will be reviewed before voting begins.")

    //   // Reset form
    //   setProposalForm({
    //     title: "",
    //     description: "",
    //     type: "",
    //     details: "",
    //     requestedAmount: "",
    //     duration: "7"
    //   })

    // } catch (error: any) {
    //   console.error("Error creating proposal:", error)
    //   alert("Error creating proposal. Please try again.")
    // }
  }

  const handleVote = async (proposalId: number, support: boolean) => {
    if (!authenticated) {
      alert("Please connect your wallet first")
      return
    }

    if (userTokens === 0) {
      alert("You need governance tokens to vote")
      return
    }

    try {
      // In a real implementation, this would interact with a governance contract
      console.log(`Voting ${support ? 'FOR' : 'AGAINST'} proposal ${proposalId} with ${userTokens} tokens`)

      alert(`Vote submitted! You voted ${support ? 'FOR' : 'AGAINST'} with ${userTokens} tokens.`)

      // Update local state (in real app, this would come from blockchain)
      setFilteredProposals(prev => prev.map(proposal => {
        if (proposal.id === proposalId) {
          return {
            ...proposal,
            votesFor: support ? proposal.votesFor + userTokens : proposal.votesFor,
            votesAgainst: !support ? proposal.votesAgainst + userTokens : proposal.votesAgainst,
            totalVotes: proposal.totalVotes + userTokens
          }
        }
        return proposal
      }))

    } catch (error: any) {
      console.error("Error voting:", error)
      alert("Error submitting vote. Please try again.")
    }
  }

  const calculateVotingPower = (tokens: number) => {
    return ((tokens / governanceStats.circulatingTokens) * 100).toFixed(4)
  }

  const getProposalStatus = (proposal: any) => {
    const now = new Date()
    const endDate = new Date(proposal.endDate)

    if (now > endDate) {
      return proposal.votesFor > proposal.votesAgainst && proposal.totalVotes >= proposal.quorum ? "Passed" : "Failed"
    }

    return proposal.totalVotes >= proposal.quorum ? "Active" : "Pending"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}

      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            DAO Governance
          </h1>
          <p className="text-gray-300 text-lg">
            Shape the future of PromptVerse through community governance and democratic decision-making
          </p>
        </div>

        {/* Governance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/30">
            <CardContent className="p-6 text-center">
              <Vote className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400 mb-1">{governanceStats.activeProposals}</div>
              <div className="text-gray-300">Active Proposals</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/30">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400 mb-1">{governanceStats.passedProposals}</div>
              <div className="text-gray-300">Passed Proposals</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400 mb-1">{governanceStats.totalHolders.toLocaleString()}</div>
              <div className="text-gray-300">Token Holders</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-500/30">
            <CardContent className="p-6 text-center">
              <Crown className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-400 mb-1">{governanceStats.treasuryBalance} ETH</div>
              <div className="text-gray-300">Treasury Balance</div>
            </CardContent>
          </Card>
        </div>

        {/* User Voting Power */}
        {authenticated && (
          <Card className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-indigo-500/30 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">Your Voting Power</h3>
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-gray-300">Tokens: </span>
                      <span className="text-indigo-400 font-bold">{userTokens.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-300">Voting Power: </span>
                      <span className="text-indigo-400 font-bold">{calculateVotingPower(userTokens)}%</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Button className="bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-500 hover:to-purple-500 text-white">
                    <Crown className="mr-2 h-4 w-4" />
                    Get More Tokens
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-black/30 mb-8">
            <TabsTrigger value="proposals" className="text-white">Proposals</TabsTrigger>
            <TabsTrigger value="create" className="text-white">Create Proposal</TabsTrigger>
            <TabsTrigger value="treasury" className="text-white">Treasury</TabsTrigger>
          </TabsList>

          <TabsContent value="proposals" className="space-y-6">
            {/* Filters */}
            <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search proposals..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-48 bg-black/30 border-purple-500/30 text-white">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Types</SelectItem>
                      {proposalTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-48 bg-black/30 border-purple-500/30 text-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {proposalStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Proposals List */}
            <div className="space-y-6">
              {filteredProposals.map((proposal) => {
                const votingProgress = (proposal.totalVotes / proposal.quorum) * 100
                const forPercentage = proposal.totalVotes > 0 ? (proposal.votesFor / proposal.totalVotes) * 100 : 0
                const againstPercentage = proposal.totalVotes > 0 ? (proposal.votesAgainst / proposal.totalVotes) * 100 : 0
                const currentStatus = getProposalStatus(proposal)

                return (
                  <Card key={proposal.id} className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30 hover:border-yellow-400/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-white">{proposal.title}</h3>
                            <Badge className={`${currentStatus === 'Active' ? 'bg-green-500' :
                                currentStatus === 'Passed' ? 'bg-blue-500' :
                                  currentStatus === 'Failed' ? 'bg-red-500' :
                                    'bg-yellow-500'
                              } text-white`}>
                              {currentStatus}
                            </Badge>
                            <Badge variant="secondary" className="bg-purple-600/30 text-purple-200">
                              {proposal.type}
                            </Badge>
                          </div>
                          <p className="text-gray-300 mb-4">{proposal.description}</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                              <h4 className="text-white font-semibold mb-3">Voting Progress</h4>
                              <div className="space-y-3">
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-300">Quorum Progress</span>
                                    <span className="text-white">{proposal.totalVotes.toLocaleString()} / {proposal.quorum.toLocaleString()}</span>
                                  </div>
                                  <Progress value={Math.min(votingProgress, 100)} className="h-2" />
                                </div>

                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-green-400">For ({forPercentage.toFixed(1)}%)</span>
                                    <span className="text-green-400">{proposal.votesFor.toLocaleString()}</span>
                                  </div>
                                  <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div
                                      className="bg-green-400 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${forPercentage}%` }}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-red-400">Against ({againstPercentage.toFixed(1)}%)</span>
                                    <span className="text-red-400">{proposal.votesAgainst.toLocaleString()}</span>
                                  </div>
                                  <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div
                                      className="bg-red-400 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${againstPercentage}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">Proposer:</span>
                                <div className="flex items-center space-x-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={proposal.proposer.avatar || "/placeholder.svg"} alt={proposal.proposer.name} />
                                    <AvatarFallback>{proposal.proposer.name.slice(0, 2)}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-white font-semibold">{proposal.proposer.name}</span>
                                  {proposal.proposer.verified && (
                                    <Badge className="bg-blue-500 text-white text-xs">Verified</Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">End Date:</span>
                                <span className="text-white">{new Date(proposal.endDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">Discussion:</span>
                                <span className="text-blue-400 font-semibold">{proposal.discussion} comments</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">Created:</span>
                                <span className="text-white">{new Date(proposal.created).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                                onClick={()=> setModalType("maintenance")}
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Discussion
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white"
                                onClick={()=> setModalType("maintenance")}
                              >
                                <Gavel className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </div>

                            {authenticated && currentStatus === 'Active' && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleVote(proposal.id, true)}
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                >
                                  <ThumbsUp className="h-4 w-4 mr-2" />
                                  Vote For
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleVote(proposal.id, false)}
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                >
                                  <ThumbsDown className="h-4 w-4 mr-2" />
                                  Vote Against
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            {!authenticated ? (
              <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                <CardHeader className="text-center">
                  <Vote className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <CardTitle className="text-2xl text-white">Connect Your Wallet</CardTitle>
                  <CardDescription className="text-gray-300">
                    You need to connect your wallet to create proposals
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <CampModal />
                </CardContent>
              </Card>
            ) : userTokens < 100 ? (
              <Card className="bg-gradient-to-br from-red-900/50 to-orange-900/50 border-red-500/30">
                <CardHeader className="text-center">
                  <Crown className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <CardTitle className="text-2xl text-white">Insufficient Tokens</CardTitle>
                  <CardDescription className="text-gray-300">
                    You need at least 100 governance tokens to create proposals. You currently have {userTokens} tokens.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-semibold">
                    Get Governance Tokens
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-white">Create New Proposal</CardTitle>
                      <CardDescription className="text-gray-300">
                        Submit a proposal for community consideration
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <label className="text-white font-semibold block mb-2">Proposal Title</label>
                        <Input
                          placeholder="Enter a clear, descriptive title"
                          value={proposalForm.title}
                          onChange={(e) => setProposalForm(prev => ({ ...prev, title: e.target.value }))}
                          className="bg-black/30 border-purple-500/30 text-white placeholder-gray-400"
                        />
                      </div>

                      <div>
                        <label className="text-white font-semibold block mb-2">Type</label>
                        <Select value={proposalForm.type} onValueChange={(value) => setProposalForm(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                            <SelectValue placeholder="Select proposal type" />
                          </SelectTrigger>
                          <SelectContent>
                            {proposalTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-white font-semibold block mb-2">Description</label>
                        <Textarea
                          placeholder="Provide a clear summary of your proposal"
                          value={proposalForm.description}
                          onChange={(e) => setProposalForm(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          className="bg-black/30 border-purple-500/30 text-white placeholder-gray-400"
                        />
                      </div>

                      <div>
                        <label className="text-white font-semibold block mb-2">Detailed Proposal</label>
                        <Textarea
                          placeholder="Provide detailed information, rationale, and implementation plan"
                          value={proposalForm.details}
                          onChange={(e) => setProposalForm(prev => ({ ...prev, details: e.target.value }))}
                          rows={8}
                          className="bg-black/30 border-purple-500/30 text-white placeholder-gray-400"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {proposalForm.type === "Treasury" && (
                          <div>
                            <label className="text-white font-semibold block mb-2">Requested Amount (ETH)</label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={proposalForm.requestedAmount}
                              onChange={(e) => setProposalForm(prev => ({ ...prev, requestedAmount: e.target.value }))}
                              className="bg-black/30 border-purple-500/30 text-white placeholder-gray-400"
                            />
                          </div>
                        )}

                        <div>
                          <label className="text-white font-semibold block mb-2">Voting Duration (Days)</label>
                          <Select value={proposalForm.duration} onValueChange={(value) => setProposalForm(prev => ({ ...prev, duration: value }))}>
                            <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3 Days</SelectItem>
                              <SelectItem value="7">7 Days</SelectItem>
                              <SelectItem value="14">14 Days</SelectItem>
                              <SelectItem value="30">30 Days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/30">
                    <CardHeader>
                      <CardTitle className="text-white">Proposal Requirements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300 text-sm">Minimum 100 tokens to propose</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300 text-sm">Clear title and description</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300 text-sm">Detailed implementation plan</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-yellow-400" />
                        <span className="text-gray-300 text-sm">24h review period before voting</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-blue-400" />
                        <span className="text-gray-300 text-sm">10,000 token quorum required</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/30">
                    <CardHeader>
                      <CardTitle className="text-white">Your Voting Power</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Your Tokens:</span>
                        <span className="text-blue-400 font-semibold">{userTokens.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Voting Power:</span>
                        <span className="text-blue-400 font-semibold">{calculateVotingPower(userTokens)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Proposal Cost:</span>
                        <span className="text-white">100 tokens</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    onClick={handleCreateProposal}
                    disabled={!proposalForm.title || !proposalForm.description || !proposalForm.type || !proposalForm.details}
                    className="w-full bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-semibold text-lg py-3"
                  >
                    <Vote className="mr-2 h-5 w-5" />
                    Submit Proposal
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="treasury" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Treasury Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Balance:</span>
                    <span className="text-2xl font-bold text-green-400">{governanceStats.treasuryBalance} ETH</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Available for Grants:</span>
                    <span className="text-green-400 font-semibold">350.2 ETH</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Reserved Funds:</span>
                    <span className="text-yellow-400 font-semibold">100.3 ETH</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Monthly Inflow:</span>
                    <span className="text-blue-400 font-semibold">25.8 ETH</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Recent Treasury Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold text-sm">Platform Fees</p>
                        <p className="text-gray-400 text-xs">Jan 25, 2024</p>
                      </div>
                      <span className="text-green-400 font-semibold">+5.2 ETH</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold text-sm">Community Grant</p>
                        <p className="text-gray-400 text-xs">Jan 23, 2024</p>
                      </div>
                      <span className="text-red-400 font-semibold">-10.0 ETH</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold text-sm">Royalty Income</p>
                        <p className="text-gray-400 text-xs">Jan 22, 2024</p>
                      </div>
                      <span className="text-green-400 font-semibold">+3.8 ETH</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Treasury Proposals</CardTitle>
                <CardDescription className="text-gray-300">
                  Active and recent proposals involving treasury funds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-black/20 border border-purple-500/30 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-white font-semibold">Community Grant Program</h4>
                        <p className="text-gray-400 text-sm">Allocate 100 ETH for community projects</p>
                      </div>
                      <Badge className="bg-green-500 text-white">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Requested: 100 ETH</span>
                      <span className="text-green-400 text-sm">85% approval</span>
                    </div>
                  </div>

                  <div className="bg-black/20 border border-purple-500/30 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-white font-semibold">Marketing Campaign</h4>
                        <p className="text-gray-400 text-sm">Fund Q2 marketing initiatives</p>
                      </div>
                      <Badge className="bg-blue-500 text-white">Passed</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Approved: 50 ETH</span>
                      <span className="text-blue-400 text-sm">Executed</span>
                    </div>
                  </div>
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

