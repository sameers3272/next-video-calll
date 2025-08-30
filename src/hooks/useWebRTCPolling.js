'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

export function useWebRTCPolling(userId) {
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [isInCall, setIsInCall] = useState(false)
  const [callStatus, setCallStatus] = useState('idle') // idle, calling, ringing, connected, ended
  const [currentCall, setCurrentCall] = useState(null)
  
  const peerConnection = useRef(null)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const pollingInterval = useRef(null)
  const lastSignalCheck = useRef(null)

  // WebRTC configuration
  const pcConfig = useMemo(() => ({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  }), [])

  // Send WebRTC signal via API
  const sendSignal = useCallback(async (recipientId, type, data) => {
    try {
      const response = await fetch('/api/webrtc/signal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId,
          type,
          data
        })
      })

      if (!response.ok) {
        console.error('Failed to send WebRTC signal')
      }
    } catch (error) {
      console.error('Error sending WebRTC signal:', error)
    }
  }, [])

  // Poll for WebRTC signals
  const pollSignals = useCallback(async () => {
    if (!userId) return

    try {
      const url = lastSignalCheck.current 
        ? `/api/webrtc/signal?since=${lastSignalCheck.current.toISOString()}`
        : '/api/webrtc/signal'
      
      const response = await fetch(url)
      
      if (response.ok) {
        const signals = await response.json()
        lastSignalCheck.current = new Date()
        
        for (const signal of signals) {
          await handleSignal(signal)
        }
      }
    } catch (error) {
      console.error('Error polling WebRTC signals:', error)
    }
  }, [userId, handleSignal])

  // Handle incoming WebRTC signals
  const handleSignal = useCallback(async (signal) => {
    const { type, data, senderId } = signal

    switch (type) {
      case 'offer':
        if (callStatus === 'idle') {
          // Incoming call
          setCurrentCall({ 
            otherUserId: senderId._id, 
            otherUser: senderId, 
            offer: data 
          })
          setCallStatus('ringing')
        }
        break

      case 'answer':
        if (peerConnection.current && callStatus === 'calling') {
          try {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data))
            setCallStatus('connected')
          } catch (error) {
            console.error('Error setting remote description:', error)
          }
        }
        break

      case 'ice-candidate':
        if (peerConnection.current) {
          try {
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(data))
          } catch (error) {
            console.error('Error adding ICE candidate:', error)
          }
        }
        break

      case 'call-end':
      case 'call-decline':
        endCall()
        break
    }
  }, [callStatus])

  // Start polling when needed
  useEffect(() => {
    if (isInCall || callStatus !== 'idle') {
      // Poll more frequently during calls
      pollingInterval.current = setInterval(pollSignals, 1000)
    } else {
      // Poll less frequently when idle
      pollingInterval.current = setInterval(pollSignals, 3000)
    }

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current)
      }
    }
  }, [isInCall, callStatus, pollSignals])

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
    
    if (currentCall) {
      // Send call end signal
      sendSignal(currentCall.otherUserId, 'call-end', {})
    }
    
    setCurrentCall(null)
  }, [localStream, currentCall, sendSignal])

  // Initialize peer connection
  const initializePeerConnection = useCallback(() => {
    if (peerConnection.current) return peerConnection.current

    const pc = new RTCPeerConnection(pcConfig)
    
    pc.onicecandidate = (event) => {
      if (event.candidate && currentCall) {
        sendSignal(currentCall.otherUserId, 'ice-candidate', event.candidate)
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
        // Use a separate function to avoid circular dependency
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
        setCurrentCall(null)
      }
    }

    peerConnection.current = pc
    return pc
  }, [currentCall, pcConfig, sendSignal, localStream])

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

      // Send offer via API
      await sendSignal(recipientId, 'offer', offer)

      setIsInCall(true)
    } catch (error) {
      console.error('Error starting call:', error)
      setCallStatus('idle')
    }
  }, [getUserMedia, initializePeerConnection, sendSignal])

  // Decline a call
  const declineCall = useCallback((callerId) => {
    sendSignal(callerId, 'call-decline', {})
    setCallStatus('idle')
    setCurrentCall(null)
  }, [sendSignal])

  // Answer a call
  const answerCall = useCallback(async (callerId, offer) => {
    try {
      setCallStatus('ringing')
      setCurrentCall(prev => ({ ...prev, otherUserId: callerId }))
      
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

      await sendSignal(callerId, 'answer', answer)

      setIsInCall(true)
      setCallStatus('connected')
    } catch (error) {
      console.error('Error answering call:', error)
      declineCall(callerId)
    }
  }, [getUserMedia, initializePeerConnection, sendSignal, declineCall])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endCall()
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current)
      }
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