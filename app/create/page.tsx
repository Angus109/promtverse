"use client"

import { useState } from 'react'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Badge } from "../../components/ui/badge"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Progress } from "../../components/ui/progress"
import { Sparkles, Upload, Eye, DollarSign, Tag, Wand2, AlertCircle, CheckCircle, X } from 'lucide-react'
import Link from 'next/link'
import { CampProvider, CampModal, useAuthState, useAuth } from '@campnetwork/origin/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const categories = ["Art & Design", "Writing", "Environment", "Character", "Music", "Code", "Business", "Education"]
const aiModels = ["GPT-4", "DALL-E 3", "Midjourney", "Stable Diffusion", "Claude", "Gemini", "Other"]

function CreatePromptPage() {
  const { authenticated, user } = useAuthState()
  const auth = useAuth()
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    promptText: '',
    category: '',
    aiModel: '',
    price: '',
    tags: [],
    image: null
  })
  
  const [currentTag, setCurrentTag] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim()) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim().toLowerCase()]
      }))
      setCurrentTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      if (auth.blob) {
        setUploadProgress(10)
        
        // Upload to Camp Network Blob storage
        const uploadResult = await auth.blob.upload(file)
        
        setUploadProgress(100)
        setFormData(prev => ({ ...prev, image: uploadResult.url }))
        
        setTimeout(() => setUploadProgress(0), 1000)
      }
    } catch (error) {
      console.error('Image upload failed:', error)
      setErrors(prev => ({ ...prev, image: 'Failed to upload image' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.promptText.trim()) newErrors.promptText = 'Prompt text is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.aiModel) newErrors.aiModel = 'AI Model is required'
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required'
    if (formData.tags.length === 0) newErrors.tags = 'At least one tag is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!authenticated) {
      alert('Please connect your wallet first')
      return
    }

    if (!validateForm()) return

    setIsCreating(true)
    
    try {
      // Create metadata object
      const metadata = {
        name: formData.title,
        description: formData.description,
        image: formData.image,
        category: formData.category,
        aiModel: formData.aiModel,
        tags: formData.tags,
        promptText: formData.promptText,
        creator: user?.address || 'Anonymous'
      }

      // Upload metadata to IPFS via Camp Network
      let metadataUri = ''
      if (auth.blob) {
        const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' })
        const metadataFile = new File([metadataBlob], 'metadata.json', { type: 'application/json' })
        const metadataUpload = await auth.blob.upload(metadataFile)
        metadataUri = metadataUpload.url
      }

      // Mint NFT using Origin API
      if (auth.origin) {
        const priceInWei = (parseFloat(formData.price) * 1e18).toString()
        
        const mintResult = await auth.origin.mint({
          to: user?.address,
          price: priceInWei,
          metadataURI: metadataUri,
          royalty: 1000, // 10% royalty
        })

        console.log('Mint successful:', mintResult)
        setSuccess(true)
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          promptText: '',
          category: '',
          aiModel: '',
          price: '',
          tags: [],
          image: null
        })

        // Redirect to marketplace after success
        setTimeout(() => {
          window.location.href = '/marketplace'
        }, 3000)
      }
    } catch (error) {
      console.error('Failed to create prompt:', error)
      alert('Failed to create prompt. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30 max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <Sparkles className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <CardTitle className="text-white text-2xl">Connect Your Wallet</CardTitle>
            <CardDescription className="text-gray-300">
              You need to connect your wallet to create and sell AI prompts
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
              <Sparkles className="h-8 w-8 text-yellow-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                PromptVerse
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/marketplace" className="text-white hover:text-yellow-400 transition-colors">
                Marketplace
              </Link>
              <Link href="/create" className="text-yellow-400 font-semibold">
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
                <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            <Wand2 className="inline-block mr-3 h-10 w-10 text-yellow-400" />
            Create AI Prompt
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Transform your creative AI prompts into valuable NFTs. Share your expertise and earn from your innovations.
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <Alert className="mb-6 bg-green-900/50 border-green-500/30">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-300">
              Prompt created successfully! Redirecting to marketplace...
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Basic Information</CardTitle>
                  <CardDescription className="text-gray-300">
                    Provide the essential details about your AI prompt
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-white">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., Anime Character Creator Pro"
                      className="bg-black/30 border-purple-500/30 text-white placeholder-gray-400"
                    />
                    {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-white">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe what your prompt does and what makes it special..."
                      rows={4}
                      className="bg-black/30 border-purple-500/30 text-white placeholder-gray-400"
                    />
                    {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category" className="text-white">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
                    </div>

                    <div>
                      <Label htmlFor="aiModel" className="text-white">AI Model *</Label>
                      <Select value={formData.aiModel} onValueChange={(value) => handleInputChange('aiModel', value)}>
                        <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                          <SelectValue placeholder="Select AI model" />
                        </SelectTrigger>
                        <SelectContent>
                          {aiModels.map(model => (
                            <SelectItem key={model} value={model}>{model}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.aiModel && <p className="text-red-400 text-sm mt-1">{errors.aiModel}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Prompt Content */}
              <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Prompt Content</CardTitle>
                  <CardDescription className="text-gray-300">
                    The actual prompt text that users will receive
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="promptText" className="text-white">Prompt Text *</Label>
                    <Textarea
                      id="promptText"
                      value={formData.promptText}
                      onChange={(e) => handleInputChange('promptText', e.target.value)}
                      placeholder="Enter your detailed AI prompt here..."
                      rows={8}
                      className="bg-black/30 border-purple-500/30 text-white placeholder-gray-400 font-mono"
                    />
                    {errors.promptText && <p className="text-red-400 text-sm mt-1">{errors.promptText}</p>}
                    <p className="text-gray-400 text-sm mt-2">
                      Be specific and detailed. Include parameters, styles, and any special instructions.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Media & Tags */}
              <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Media & Tags</CardTitle>
                  <CardDescription className="text-gray-300">
                    Add visual examples and tags to help users discover your prompt
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Image Upload */}
                  <div>
                    <Label className="text-white">Preview Image</Label>
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-purple-500/30 rounded-lg cursor-pointer hover:border-purple-400/50 transition-colors"
                      >
                        {formData.image ? (
                          <img src={formData.image || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover rounded-lg" />
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-gray-400">Click to upload preview image</p>
                          </>
                        )}
                      </label>
                    </div>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <Progress value={uploadProgress} className="mt-2" />
                    )}
                    {errors.image && <p className="text-red-400 text-sm mt-1">{errors.image}</p>}
                  </div>

                  {/* Tags */}
                  <div>
                    <Label className="text-white">Tags * (Max 10)</Label>
                    <div className="flex space-x-2 mt-2">
                      <Input
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        placeholder="Add a tag..."
                        className="bg-black/30 border-purple-500/30 text-white placeholder-gray-400"
                      />
                      <Button
                        type="button"
                        onClick={addTag}
                        className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white"
                      >
                        <Tag className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} className="bg-purple-600/30 text-purple-200 flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-red-400"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    {errors.tags && <p className="text-red-400 text-sm mt-1">{errors.tags}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Pricing</CardTitle>
                  <CardDescription className="text-gray-300">
                    Set the price for your AI prompt NFT
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="price" className="text-white">Price (ETH) *</Label>
                    <div className="relative mt-2">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="price"
                        type="number"
                        step="0.001"
                        min="0"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder="0.05"
                        className="pl-10 bg-black/30 border-purple-500/30 text-white placeholder-gray-400"
                      />
                    </div>
                    {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
                    <p className="text-gray-400 text-sm mt-2">
                      Consider the complexity and value of your prompt when setting the price
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Link href="/marketplace">
                  <Button variant="outline" className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-semibold px-8"
                >
                  {isCreating ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Create Prompt
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview */}
            <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Eye className="mr-2 h-5 w-5" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formData.image && (
                    <img
                      src={formData.image || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="text-white font-semibold">
                      {formData.title || 'Your Prompt Title'}
                    </h3>
                    <p className="text-gray-300 text-sm mt-1">
                      {formData.description || 'Your prompt description will appear here...'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-purple-600/30 text-purple-200 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-400 text-sm">
                      by {user?.username || 'You'}
                    </div>
                    <div className="text-yellow-400 font-bold">
                      {formData.price || '0.00'} ETH
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white text-lg">💡 Tips for Success</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Write clear, detailed prompts with specific parameters</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Include example outputs or use cases</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Use relevant tags to help users discover your prompt</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Price competitively based on complexity and value</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Add high-quality preview images</p>
                </div>
              </CardContent>
            </Card>

            {/* Earnings Info */}
            <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white text-lg">💰 Earnings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Your Share:</span>
                  <span className="text-green-400 font-semibold">90%</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee:</span>
                  <span className="text-gray-400">10%</span>
                </div>
                <div className="border-t border-gray-600 pt-2">
                  <div className="flex justify-between">
                    <span>You'll Earn:</span>
                    <span className="text-green-400 font-bold">
                      {formData.price ? (parseFloat(formData.price) * 0.9).toFixed(3) : '0.000'} ETH
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CreatePrompt() {
  return (
    <QueryClientProvider client={queryClient}>
      <CampProvider 
        clientId={process.env.NEXT_PUBLIC_CAMP_CLIENT_ID || "your-client-id"}
        redirectUri={typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}
        environment="production"
      >
        <CreatePromptPage />
      </CampProvider>
    </QueryClientProvider>
  )
}
