"use client"

import { useState, useEffect } from 'react'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Sparkles, UserPlus, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { useAuthState, useAuth } from '@campnetwork/origin/react'

export function CreatorRegistrationModal({ isOpen, onClose, contract }) {
  const { authenticated } = useAuthState()
  const auth =useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [creatorExists, setCreatorExists] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    avatarUri: '',
    bio: '',
    specialties: []
  })
  
  const [currentSpecialty, setCurrentSpecialty] = useState('')
  const [status, setStatus] = useState({ success: false, message: '' })

  // Check if creator exists when wallet connects or changes
//   useEffect(() => {
//     const checkCreatorExists = async () => {
//       if (authenticated && user?.address && contract) {
//         try {
//           setIsLoading(true)
//           const exists = await contract.doesCreatorExist(user.address)
//           setCreatorExists(exists)
//         } catch (error) {
//           console.error("Error checking creator existence:", error)
//         } finally {
//           setIsLoading(false)
//         }
//       }
//     }

//     checkCreatorExists()
//   }, [authenticated, user?.address, contract])

  const addSpecialty = () => {
    if (currentSpecialty.trim() && !formData.specialties.includes(currentSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, currentSpecialty.trim()]
      }))
      setCurrentSpecialty('')
    }
  }

  const removeSpecialty = (specialtyToRemove) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(spec => spec !== specialtyToRemove)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus({ success: false, message: '' })

    try {
      const tx = await contract.registerCreator(
        formData.username,
        formData.avatarUri,
        formData.bio,
        formData.specialties,
        false // verified status
      )
      await tx.wait()
      setStatus({ success: true, message: 'Creator profile created successfully!' })
      setCreatorExists(true)
      // Close modal after 2 seconds
      setTimeout(() => onClose(), 2000)
    } catch (error) {
      console.error("Error registering creator:", error)
      setStatus({ success: false, message: error.message || 'Failed to create creator profile' })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            {creatorExists ? (
              <CheckCircle className="mr-2 h-6 w-6 text-green-400" />
            ) : (
              <UserPlus className="mr-2 h-6 w-6 text-yellow-400" />
            )}
            {creatorExists ? 'Creator Profile Exists' : 'Register as Creator'}
          </CardTitle>
          <CardDescription className="text-gray-300">
            {creatorExists 
              ? 'Your creator profile is already registered on the blockchain.' 
              : 'Complete your creator profile to start selling prompts'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isLoading && !status.message ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
            </div>
          ) : status.message ? (
            <div className={`p-4 rounded-lg mb-4 ${status.success ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
              <div className="flex items-center">
                {status.success ? (
                  <CheckCircle className="h-5 w-5 mr-2" />
                ) : (
                  <XCircle className="h-5 w-5 mr-2" />
                )}
                {status.message}
              </div>
            </div>
          ) : creatorExists ? (
            <div className="space-y-4">
              <div className="bg-purple-900/30 p-4 rounded-lg text-center">
                <p className="text-purple-300">You're all set to create and sell prompts!</p>
              </div>
              <Button 
                onClick={onClose}
                className="w-full bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 text-white"
              >
                Continue to Dashboard
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Username *</label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="Your creator name"
                  className="bg-black/30 border-purple-500/30 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Avatar URL</label>
                <Input
                  value={formData.avatarUri}
                  onChange={(e) => setFormData({...formData, avatarUri: e.target.value})}
                  placeholder="https://example.com/avatar.jpg"
                  className="bg-black/30 border-purple-500/30 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
                <Input
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="Tell us about yourself"
                  className="bg-black/30 border-purple-500/30 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Specialties</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={currentSpecialty}
                    onChange={(e) => setCurrentSpecialty(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                    placeholder="Add specialty"
                    className="bg-black/30 border-purple-500/30 text-white flex-1"
                  />
                  <Button 
                    type="button"
                    onClick={addSpecialty}
                    className="bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 text-white"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.specialties.map((spec) => (
                    <div key={spec} className="bg-purple-900/30 text-purple-200 px-3 py-1 rounded-full text-sm flex items-center">
                      {spec}
                      <button 
                        type="button"
                        onClick={() => removeSpecialty(spec)}
                        className="ml-2 text-purple-400 hover:text-white"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-semibold"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Register Creator
                </Button>
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}