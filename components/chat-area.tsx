"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Search, Phone, Video, MoreVertical, Smile, Paperclip, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Conversation, Message } from "@/app/page"

interface ChatAreaProps {
  conversation: Conversation
  messages: Message[]
  onSendMessage: (text: string) => void
  currentUserId: number
}

export function ChatArea({ conversation, messages, onSendMessage, currentUserId }: ChatAreaProps) {
  const [messageText, setMessageText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Transforma e ordena as mensagens corretamente
  const transformedMessages = messages
    .map(message => {
      const text = message.content || message.text || ""
      const sender = message.senderName || message.sender || "Unknown"
      const time = new Date(message.createdAt).toLocaleTimeString([], { 
        hour: '2-digit', minute: '2-digit' 
      })
      const isSent = message.senderId === currentUserId
      
      return {
        ...message,
        text,
        sender,
        time,
        isSent,
        content: text,
        senderName: sender
      }
    })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText)
      setMessageText("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{ background: conversation.avatarColor }}
          >
            {conversation.avatar}
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">{conversation.name}</h3>
            <p className="text-sm text-green-500">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-background p-6">
        <div className="mx-auto max-w-4xl space-y-4">
          {transformedMessages.map((message) => (
            <div key={message.id} className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] ${message.isSent ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div
                  className={`rounded-2xl px-4 py-2.5 ${
                    message.isSent 
                      ? "bg-purple-600 text-white" 
                      // : "bg-white text-gray-900 border border-gray-200 shadow-sm" // Mensagens recebidas com destaque
                      : "bg-white text-gray-900 border border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 shadow-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
                <span className="px-2 text-xs text-muted-foreground">
                  {message.isSent ? message.time : `${message.sender} • ${message.time}`}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-border bg-card px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Smile className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon" className="bg-purple-600 hover:bg-purple-700">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}