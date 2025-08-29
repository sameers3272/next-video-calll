'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useSocket, useSocketEvent } from './useSocket'

export function useWebRTC(userId) {
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [isInCall, setIsInCall] = useState(false)
  const [callStatus, setCallStatus] = useState('idle') // idle, calling, ringing, connected, ended
  const [currentCall, setCurrentCall] = useState(null)
  
  const peerConnection = useRef(null)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const socket = useSocket(userId)

  // WebRTC configuration
  const pcConfig = useMemo(() => ({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  }), [])

  // End call function (defined early to avoid dependency issues)
  const endCall = useCallback(() => {
    if (peerConnection.current) {
      peerConnection.current.close()
      peerConnection.current = null
    }

    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
      setLocalStream(null)
    }

    setRemoteStream(null)
    setIsInCall(false)
    setCallStatus('idle')
    
    if (currentCall && socket) {
      socket.emit('call_end', {
        otherUserId: currentCall.otherUserId
      })
    }
    
    setCurrentCall(null)
  }, [localStream, currentCall, socket])

  // Initialize peer connection
  const initializePeerConnection = useCallback(() => {
    if (peerConnection.current) return peerConnection.current

    const pc = new RTCPeerConnection(pcConfig)
    
    pc.onicecandidate = (event) => {
      if (event.candidate && socket && currentCall) {
        socket.emit('webrtc_ice_candidate', {
          recipientId: currentCall.otherUserId,
          candidate: event.candidate
        })
      }
    }

    pc.ontrack = (event) => {
      const [stream] = event.streams
      setRemoteStream(stream)
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream
      }
    }

    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState)
      if (pc.connectionState === 'connected') {
        setCallStatus('connected')
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        endCall()
      }
    }

    peerConnection.current = pc
    return pc
  }, [socket, currentCall, endCall, pcConfig])

  // Get user media
  const getUserMedia = useCallback(async (video = true, audio = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video, audio })
      setLocalStream(stream)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      return stream
    } catch (error) {
      console.error('Error accessing media devices:', error)
      throw error
    }
  }, [])

  // Start a call
  const startCall = useCallback(async (recipientId, callType = 'video') => {
    try {
      setCallStatus('calling')
      setCurrentCall({ otherUserId: recipientId, callType })
      
      // Get user media
      const stream = await getUserMedia(callType === 'video', true)
      
      // Initialize peer connection
      const pc = initializePeerConnection()
      
      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream)
      })

      // Create and send offer
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      // Send offer through Socket.io
      socket.emit('webrtc_offer', {
        recipientId,
        offer
      })

      setIsInCall(true)
    } catch (error) {
      console.error('Error starting call:', error)
      setCallStatus('idle')
    }
  }, [socket, getUserMedia, initializePeerConnection])

  // Decline a call
  const declineCall = useCallback((callerId) => {
    socket.emit('call_decline', { callerId })
    setCallStatus('idle')
    setCurrentCall(null)
  }, [socket])

  // Answer a call
  const answerCall = useCallback(async (callerId, offer) => {
    try {
      setCallStatus('ringing')
      setCurrentCall({ otherUserId: callerId })
      
      // Get user media
      const stream = await getUserMedia(true, true)
      
      // Initialize peer connection
      const pc = initializePeerConnection()
      
      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream)
      })

      // Set remote description
      await pc.setRemoteDescription(new RTCSessionDescription(offer))
      
      // Create and send answer
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)

      socket.emit('webrtc_answer', {
        recipientId: callerId,
        answer
      })

      setIsInCall(true)
      setCallStatus('connected')
    } catch (error) {
      console.error('Error answering call:', error)
      declineCall(callerId)
    }
  }, [socket, getUserMedia, initializePeerConnection, declineCall])


  // Socket event handlers
  useSocketEvent(socket, 'webrtc_offer', useCallback(({ offer, senderId }) => {
    if (callStatus === 'idle') {
      // Incoming call
      setCurrentCall({ otherUserId: senderId, offer })
      setCallStatus('ringing')
    }
  }, [callStatus]))

  useSocketEvent(socket, 'webrtc_answer', useCallback(async ({ answer }) => {
    if (peerConnection.current && callStatus === 'calling') {
      try {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer))
        setCallStatus('connected')
      } catch (error) {
        console.error('Error setting remote description:', error)
      }
    }
  }, [callStatus]))

  useSocketEvent(socket, 'webrtc_ice_candidate', useCallback(async ({ candidate }) => {
    if (peerConnection.current) {
      try {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate))
      } catch (error) {
        console.error('Error adding ICE candidate:', error)
      }
    }
  }, []))

  useSocketEvent(socket, 'call_ended', useCallback(() => {
    endCall()
  }, [endCall]))

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endCall()
    }
  }, [endCall])

  return {
    localStream,
    remoteStream,
    isInCall,
    callStatus,
    currentCall,
    localVideoRef,
    remoteVideoRef,
    startCall,
    answerCall,
    declineCall,
    endCall
  }
}