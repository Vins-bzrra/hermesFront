"use client"

import type { Conversation } from "@/app/page"

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
}

export function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer items-start gap-3 px-6 py-4 transition-colors ${
        isActive ? "bg-purple-50 dark:bg-purple-950/30" : "hover:bg-sidebar-accent"
      }`}
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
        style={{ background: conversation.avatarColor }}
      >
        {conversation.avatar}
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sidebar-foreground">{conversation.name}</span>
            {conversation.isGroup && (
              <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                GRUPO
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{conversation.time}</span>
        </div>
        <p className="truncate text-sm text-muted-foreground">{conversation.lastMessage}</p>
      </div>
      {conversation.unreadCount && conversation.unreadCount > 0 && (
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-semibold text-white">
          {conversation.unreadCount}
        </div>
      )}
    </div>
  )
}
