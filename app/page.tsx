"use client"

import { useState, useEffect, useRef } from "react"
import { X, Volume2, VolumeX, Send, Heart } from "lucide-react"

interface Memory {
  id: number
  title: string
  message: string
  date: string
  position: { top: string; left: string }
}

const memories: Memory[] = [
  {
    id: 1,
    title: "Digital Destiny",
    message:
      "I still remember how it all began — we were just two students attending classes on Unacademy, and somehow, amidst all that studying, we started chatting.It was around August 2021.",
    date: "August 2021",
    position: { top: "15%", left: "20%" },
  },
  {
    id: 2,
    title: "Playing Free Fire",
    message:
      "Then came 22nd August, Rakshabandhan — a day I’ll never forget. We ended up playing Free Fire together. It was so much fun, we lost track of time just laughing and messing around.",
    date: "22 August 2021",
    position: { top: "25%", left: "75%" },
  },
  {
    id: 3,
    title: "Brave Hearts",
    message:
      "I gathered courage to tell you how I felt. You said okay. For one beautiful week, we were just two kids discovering something special.",
    date: "Late August 2021",
    position: { top: "35%", left: "45%" },
  },
  {
    id: 4,
    title: "When Reality Hit",
    message:
      "We talked for about a week, maybe a little more… until your parents found out. You were in 8th, I was in 9th. We were just kids, and honestly, they were probably just being protective. After that, we stopped talking.",
    date: "September 2021",
    position: { top: "45%", left: "15%" },
  },
  {
    id: 5,
    title: "Silent Seasons",
    message:
      "After that, we lost contact and did not speak for one or two years.",
    date: "2021-2023",
    position: { top: "55%", left: "70%" },
  },
  {
    id: 6,
    title: "Chasing Dreams",
    message:
      "In 11th and 12th, I went to Kota for NEET preparation. We were in different places, focused on our own goals.",
    date: "Class 11-12",
    position: { top: "65%", left: "35%" },
  },
  {
    id: 7,
    title: "Gentle Reminders",
    message:
      "A message every 6 months. Just enough to say 'I remember you exist.",
    date: "2023-2024",
    position: { top: "75%", left: "80%" },
  },
  {
    id: 8,
    title: "Coming Full Circle",
    message: "And now, somehow, we’re back in touch. Not like before, but in a new, more grounded way. As friends.",
    date: "Present",
    position: { top: "85%", left: "50%" },
  },
]

export default function ConstellationOfUs() {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [openedStars, setOpenedStars] = useState<number[]>([])
  const [isMuted, setIsMuted] = useState(false)
  const [showMessageForm, setShowMessageForm] = useState(false)
  const [userMessage, setUserMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [messageSubmitted, setMessageSubmitted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const clickSoundRef = useRef<HTMLAudioElement>(null)
  const whooshSoundRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    // Initialize audio
    if (audioRef.current) {
      audioRef.current.volume = 0.3
      audioRef.current.loop = true
    }
  }, [])

  useEffect(() => {
    // Show message form when all stars are opened
    if (openedStars.length === 8 && !messageSubmitted) {
      setTimeout(() => setShowMessageForm(true), 2000)
    }
  }, [openedStars.length, messageSubmitted])

  const playClickSound = () => {
    if (!isMuted && clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0
      clickSoundRef.current.play().catch(() => { })
    }
  }

  const handleStarClick = (memory: Memory) => {
    playClickSound()
    setSelectedMemory(memory)
    if (!openedStars.includes(memory.id)) {
      setOpenedStars((prev) => [...prev, memory.id])
    }
  }

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(() => { })
      } else {
        audioRef.current.pause()
      }
      setIsMuted(!isMuted)
    }
  }

  const handleSubmitMessage = async () => {
    if (!userMessage.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          timestamp: new Date().toISOString(),
        }),
      })

      const result = await response.json()

      if (result.success) {
        setMessageSubmitted(true)
        setShowMessageForm(false)

        // Store in localStorage as backup
        localStorage.setItem(
          "starryJourneyMessage",
          JSON.stringify({
            message: userMessage,
            timestamp: new Date().toISOString(),
            completed: true,
            emailId: result.emailId,
          }),
        )
      } else {
        console.error("Failed to send message:", result.error)
        // You could show an error message to the user here
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      // You could show an error message to the user here
    } finally {
      setIsSubmitting(false)
    }
  }

  const getConnectionLines = () => {
    const sortedOpened = openedStars.sort((a, b) => a - b)
    const lines = []

    for (let i = 0; i < sortedOpened.length - 1; i++) {
      const currentStar = memories.find((m) => m.id === sortedOpened[i])
      const nextStar = memories.find((m) => m.id === sortedOpened[i + 1])

      if (currentStar && nextStar) {
        lines.push({
          from: currentStar.position,
          to: nextStar.position,
          delay: i * 0.5,
        })
      }
    }

    return lines
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black relative overflow-hidden">
      {/* Audio elements */}
      <audio ref={audioRef} preload="auto">
        <source src="/placeholder.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={clickSoundRef} preload="auto">
        <source src="/placeholder-click.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={whooshSoundRef} preload="auto">
        <source src="/placeholder-whoosh.mp3" type="audio/mpeg" />
      </audio>

      {/* Audio control */}
      <button
        onClick={toggleAudio}
        className="fixed top-4 right-4 z-50 bg-black bg-opacity-50 text-white p-3 rounded-full backdrop-blur-sm"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {/* Animated background stars */}
      <div className="absolute inset-0">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 md:w-1 md:h-1 bg-white rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Connection lines SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {getConnectionLines().map((line, index) => (
          <line
            key={index}
            x1={line.from.left}
            y1={line.from.top}
            x2={line.to.left}
            y2={line.to.top}
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeDasharray="5,5"
            className="animate-draw-line"
            style={{
              animationDelay: `${line.delay}s`,
            }}
          />
        ))}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f472b6" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>

      {/* Title */}
      <div className="relative z-10 text-center pt-6 pb-4 px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
          Written in the Stars ✨
        </h1>
        <p className="text-gray-300 text-sm md:text-lg px-2">Tap each star to unveil our journey</p>
        <div className="text-xs text-gray-400 mt-2">{openedStars.length}/8 memories discovered</div>
      </div>

      {/* Memory Stars */}
      <div className="relative z-20 h-screen">
        {memories.map((memory) => (
          <button
            key={memory.id}
            onClick={() => handleStarClick(memory)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group touch-manipulation"
            style={{ top: memory.position.top, left: memory.position.left }}
          >
            <div className="relative">
              {/* Star glow effect */}
              <div
                className={`absolute inset-0 w-10 h-10 md:w-12 md:h-12 rounded-full blur-md opacity-60 group-active:opacity-100 transition-all duration-300 animate-pulse ${openedStars.includes(memory.id) ? "bg-green-400" : "bg-yellow-400"
                  }`}
              />

              {/* Main star */}
              <div
                className={`relative w-8 h-8 md:w-10 md:h-10 transform rotate-45 group-active:scale-110 transition-all duration-300 ${openedStars.includes(memory.id) ? "bg-green-300" : "bg-yellow-300"
                  }`}
              >
                <div
                  className={`absolute inset-1 transform -rotate-45 ${openedStars.includes(memory.id) ? "bg-green-100" : "bg-yellow-100"
                    }`}
                />
              </div>

              {/* Star points */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div
                  className={`w-10 h-0.5 md:w-12 md:h-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${openedStars.includes(memory.id) ? "bg-green-300" : "bg-yellow-300"
                    }`}
                />
                <div
                  className={`w-0.5 h-10 md:w-1 md:h-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${openedStars.includes(memory.id) ? "bg-green-300" : "bg-yellow-300"
                    }`}
                />
              </div>

              {/* Star number */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black font-bold text-xs md:text-sm">
                {memory.id}
              </div>
            </div>

            {/* Mobile-friendly tooltip */}
            <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-active:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-black bg-opacity-90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap max-w-32 text-center">
                {memory.title}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Memory Modal - Mobile Optimized */}
      {selectedMemory && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-end md:items-center justify-center z-50 p-0 md:p-4">
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-t-3xl md:rounded-2xl p-6 w-full md:max-w-md md:w-full mx-0 md:mx-4 relative border-t-2 md:border border-purple-500 shadow-2xl max-h-[80vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setSelectedMemory(null)}
              className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors p-2 -m-2"
            >
              <X size={24} />
            </button>

            {/* Content */}
            <div className="pr-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm">
                  {selectedMemory.id}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white">{selectedMemory.title}</h3>
              </div>
              <p className="text-purple-300 text-sm mb-4">{selectedMemory.date}</p>
              <p className="text-gray-200 leading-relaxed text-base">{selectedMemory.message}</p>
            </div>

            {/* Progress indicator */}
            <div className="mt-6 pt-4 border-t border-purple-700">
              <div className="flex justify-between items-center text-sm text-purple-300">
                <span>Memory {selectedMemory.id} of 8</span>
                <span>{openedStars.length} discovered</span>
              </div>
              <div className="w-full bg-purple-800 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(openedStars.length / 8) * 100}%` }}
                />
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
            <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-pink-400 rounded-full animate-pulse" />
          </div>
        </div>
      )}

      {/* Message Form Modal */}
      {showMessageForm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-lg flex items-center justify-center z-[9999] p-4">
          <div className="bg-gradient-to-br from-pink-900 to-purple-900 rounded-2xl p-6 max-w-md w-full mx-4 relative border border-pink-500 shadow-2xl transform scale-100 animate-modal-fade-in">
            <div className="text-center mb-6">
              <Heart className="w-12 h-12 text-pink-400 mx-auto mb-3 animate-pulse" />
              <h3 className="text-2xl font-bold text-white mb-2">Journey Complete! 🌟</h3>
              <p className="text-pink-200 text-sm">
                You've discovered all our memories. Would you like to leave a message?
              </p>
            </div>

            <div className="space-y-4">
              <textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Write something from your heart..."
                className="w-full h-32 p-4 bg-black bg-opacity-50 border border-pink-400 rounded-lg text-white placeholder-pink-300 resize-none focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-300 focus:ring-opacity-50"
                maxLength={500}
                autoFocus
              />

              <div className="text-right text-xs text-pink-300">{userMessage.length}/500</div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowMessageForm(false)}
                  className="flex-1 py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  onClick={handleSubmitMessage}
                  disabled={!userMessage.trim() || isSubmitting}
                  className="flex-1 py-3 px-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Sent Confirmation */}
      {messageSubmitted && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-lg flex items-center justify-center z-[9999] p-4">
          <div className="bg-gradient-to-br from-green-900 to-emerald-900 rounded-2xl p-6 max-w-md w-full mx-4 relative border border-green-500 shadow-2xl text-center transform scale-100 animate-modal-fade-in">
            <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-green-900" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Message Sent! 💫</h3>
            <p className="text-green-200 mb-6">
              Your message has been delivered. Thank you for completing our starry journey together.
            </p>
            <button
              onClick={() => setMessageSubmitted(false)}
              className="py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      )}

      {/* Shooting stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-shooting-star"
            style={{
              top: `${Math.random() * 30}%`,
              left: "-10px",
              animationDelay: `${i * 12}s`,
              animationDuration: "4s",
            }}
          />
        ))}
      </div>

      {/* Completion celebration */}
      {openedStars.length === 8 && !showMessageForm && !messageSubmitted && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-4xl md:text-6xl animate-bounce">🌟</div>
            <p className="text-white text-lg md:text-xl mt-2 font-semibold">Journey Complete!</p>
          </div>
        </div>
      )}
    </div>
  )
}
