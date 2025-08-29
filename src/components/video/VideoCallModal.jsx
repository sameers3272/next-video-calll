'use client'

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react"

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
  if (!isOpen || !currentCall) return null

  const isIncoming = callStatus === 'ringing' && currentCall.offer
  const isConnected = callStatus === 'connected'
  const isCalling = callStatus === 'calling'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 max-w-2xl w-full mx-4">
        {isConnected ? (
          <div className="space-y-4">
            <div className="relative">
              {/* Remote video */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-96 bg-gray-900 rounded-lg"
              />
              
              {/* Local video (picture-in-picture) */}
              <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Toggle microphone
                  if (localStream) {
                    const audioTrack = localStream.getAudioTracks()[0]
                    if (audioTrack) {
                      audioTrack.enabled = !audioTrack.enabled
                    }
                  }
                }}
              >
                <Mic size={20} />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Toggle camera
                  if (localStream) {
                    const videoTrack = localStream.getVideoTracks()[0]
                    if (videoTrack) {
                      videoTrack.enabled = !videoTrack.enabled
                    }
                  }
                }}
              >
                <Video size={20} />
              </Button>
              
              <Button variant="destructive" onClick={onEndCall}>
                <PhoneOff size={20} />
                End Call
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarImage src={currentCall.otherUser?.profilePicture} />
              <AvatarFallback className="text-2xl">
                {currentCall.otherUser?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="text-xl font-semibold">
                {currentCall.otherUser?.name || 'Unknown User'}
              </h3>
              <p className="text-muted-foreground">
                {isIncoming ? 'Incoming call...' : 
                 isCalling ? 'Calling...' : 
                 callStatus}
              </p>
            </div>
            
            <div className="flex justify-center space-x-4">
              {isIncoming ? (
                <>
                  <Button variant="destructive" onClick={() => onDecline(currentCall.otherUserId)}>
                    <PhoneOff size={20} />
                    Decline
                  </Button>
                  <Button onClick={() => onAnswer(currentCall.otherUserId, currentCall.offer)}>
                    <Video size={20} />
                    Answer
                  </Button>
                </>
              ) : (
                <Button variant="destructive" onClick={onEndCall}>
                  <PhoneOff size={20} />
                  {isCalling ? 'Cancel' : 'End Call'}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}