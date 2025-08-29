'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone,
  Maximize,
  Minimize,
  Settings,
  Users,
  MessageSquare
} from "lucide-react"

export default function VideoCallModal({ 
  isOpen, 
  callStatus, 
  currentCall, 
  localVideoRef, 
  remoteVideoRef, 
  onEndCall, 
  onAnswer, 
  onDecline,
  localStream 
}) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [callDuration, setCallDuration] = useState(0)

  const isIncoming = callStatus === 'ringing' && currentCall.offer
  const isConnected = callStatus === 'connected'
  const isCalling = callStatus === 'calling'

  // Format call duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Start timer when connected
  useEffect(() => {
    let interval = null
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(duration => duration + 1)
      }, 1000)
    } else {
      setCallDuration(0)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isConnected])

  const toggleMicrophone = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
      }
    }
  }

  const toggleCamera = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoOff(!videoTrack.enabled)
      }
    }
  }

  if (!isOpen || !currentCall) return null

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center z-50 ${isFullscreen ? '' : 'p-4'}`}>
      <div className={`bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl ${isFullscreen ? 'w-full h-full rounded-none' : 'max-w-6xl w-full h-[80vh]'} overflow-hidden relative`}>
        {isConnected ? (
          <div className="relative w-full h-full">
            {/* Call Header */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-6">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10 ring-2 ring-white/20">
                    <AvatarImage src={currentCall.otherUser?.profilePicture} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                      {currentCall.otherUser?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{currentCall.otherUser?.name || 'Unknown User'}</h3>
                    <p className="text-sm text-green-400 flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      {formatDuration(callDuration)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-10 w-10 p-0 text-white hover:bg-white/10"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-10 w-10 p-0 text-white hover:bg-white/10"
                  >
                    <Settings size={20} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Remote video */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover bg-gray-900"
            />
            
            {/* Local video (picture-in-picture) */}
            <div className="absolute bottom-24 right-6 w-48 h-36 bg-gray-900 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl z-10">
              {isVideoOff ? (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={currentCall.otherUser?.profilePicture} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-xl">
                      You
                    </AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute bottom-2 left-2">
                <span className="bg-black/50 text-white text-xs px-2 py-1 rounded">You</span>
              </div>
            </div>
            
            {/* Control Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="flex justify-center space-x-4">
                <Button
                  variant={isMuted ? "destructive" : "secondary"}
                  size="lg"
                  onClick={toggleMicrophone}
                  className={`h-14 w-14 rounded-full ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-white/10 hover:bg-white/20'} backdrop-blur-sm border border-white/20`}
                >
                  {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </Button>
                
                <Button
                  variant={isVideoOff ? "destructive" : "secondary"}
                  size="lg"
                  onClick={toggleCamera}
                  className={`h-14 w-14 rounded-full ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-white/10 hover:bg-white/20'} backdrop-blur-sm border border-white/20`}
                >
                  {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  className="h-14 w-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20"
                >
                  <MessageSquare size={24} />
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  className="h-14 w-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20"
                >
                  <Users size={24} />
                </Button>
                
                <Button 
                  variant="destructive" 
                  size="lg"
                  onClick={onEndCall}
                  className="h-14 w-14 rounded-full bg-red-500 hover:bg-red-600 shadow-lg"
                >
                  <PhoneOff size={24} />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
              <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-500/10 rounded-full blur-xl"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-2xl"></div>
            </div>

            <div className="text-center space-y-8 z-10 max-w-md mx-auto px-8">
              {/* Avatar with pulse animation */}
              <div className="relative mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse opacity-20 scale-110"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping opacity-10 scale-125"></div>
                <Avatar className="w-32 h-32 mx-auto ring-4 ring-white/20 relative z-10">
                  <AvatarImage src={currentCall.otherUser?.profilePicture} />
                  <AvatarFallback className="text-4xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                    {currentCall.otherUser?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-3xl font-bold text-white">
                  {currentCall.otherUser?.name || 'Unknown User'}
                </h3>
                <div className="flex items-center justify-center space-x-2">
                  {(isIncoming || isCalling) && (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  )}
                  <p className="text-xl text-blue-100">
                    {isIncoming ? 'Incoming video call...' : 
                     isCalling ? 'Calling...' : 
                     callStatus}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center space-x-6 pt-4">
                {isIncoming ? (
                  <>
                    <Button 
                      variant="destructive" 
                      size="lg"
                      onClick={() => onDecline(currentCall.otherUserId)}
                      className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 shadow-2xl"
                    >
                      <PhoneOff size={28} />
                    </Button>
                    <Button 
                      size="lg"
                      onClick={() => onAnswer(currentCall.otherUserId, currentCall.offer)}
                      className="h-16 w-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-2xl"
                    >
                      <Phone size={28} />
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="destructive" 
                    size="lg"
                    onClick={onEndCall}
                    className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 shadow-2xl"
                  >
                    <PhoneOff size={28} />
                  </Button>
                )}
              </div>

              {/* Additional info */}
              <div className="pt-8 space-y-2">
                <p className="text-sm text-gray-400">
                  {isIncoming ? 'Tap to answer or decline' : isCalling ? 'Connecting...' : ''}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}