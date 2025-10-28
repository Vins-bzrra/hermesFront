"use client"

import { MessageSquare, Users, UserPlus, Search, Moon, Sun, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ConversationItem } from "@/components/conversation-item"
import { Checkbox } from "@/components/ui/checkbox" // Import do Checkbox personalizado
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Import do Select personalizado
import type { Conversation, User, Contact, GroupMember } from "@/app/page"

interface SidebarProps {
  conversations: Conversation[]
  activeConversation: Conversation | null
  onConversationSelect: (conversation: Conversation) => void
  activeTab: "chats" | "groups"
  onTabChange: (tab: "chats" | "groups") => void
  isDarkMode: boolean
  onThemeToggle: () => void
  user: User
  onProfileClick: () => void
  // Props para modo nova conversa
  isNewConversationMode: boolean
  onNewConversation: () => void
  onCancelNewConversation: () => void
  contacts: Contact[]
  onContactSelect: (contact: Contact) => void
  // Props para modo novo grupo
  isNewGroupMode: boolean
  newGroupStep: 1 | 2
  selectedContacts: Contact[]
  groupMembers: GroupMember[]
  groupName: string
  onNewGroup: () => void
  onCancelNewGroup: () => void
  onToggleContactSelection: (contact: Contact) => void
  onNextStep: () => void
  onPrevStep: () => void
  onRoleChange: (contactId: string, role: "USER" | "ADMIN") => void
  onGroupNameChange: (name: string) => void
  onCreateGroup: () => void
}

export function Sidebar({
  conversations,
  activeConversation,
  onConversationSelect,
  activeTab,
  onTabChange,
  isDarkMode,
  onThemeToggle,
  user,
  onProfileClick,
  // Props para modo nova conversa
  isNewConversationMode,
  onNewConversation,
  onCancelNewConversation,
  contacts,
  onContactSelect,
  // Props para modo novo grupo
  isNewGroupMode,
  newGroupStep,
  selectedContacts,
  groupMembers,
  groupName,
  onNewGroup,
  onCancelNewGroup,
  onToggleContactSelection,
  onNextStep,
  onPrevStep,
  onRoleChange,
  onGroupNameChange,
  onCreateGroup,
}: SidebarProps) {
  return (
    <div className="flex h-full w-[380px] flex-col border-r border-border bg-sidebar">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 text-white">
            <MessageSquare className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-sidebar-foreground">ConnectApp</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onThemeToggle}
          className="text-muted-foreground hover:text-primary"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      {isNewGroupMode ? (
        /* MODO NOVO GRUPO */
        <>
          {newGroupStep === 1 ? (
            /* ETAPA 1: Seleção de contatos */
            <>
              {/* Header */}
              <div className="flex items-center gap-2 border-b border-border px-6 py-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onCancelNewGroup}
                  className="h-8 w-8 text-muted-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-semibold text-sidebar-foreground">Novo Grupo</h2>
              </div>

              {/* Search */}
              <div className="px-6 py-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Pesquisar contatos..." className="pl-9" />
                </div>
              </div>

              {/* Lista de Contatos com Checkbox */}
              <div className="flex-1 overflow-y-auto">
                {contacts.map((contact) => {
                  const isSelected = !!selectedContacts.find(c => c.id === contact.id)
                  return (
                    <div
                      key={contact.id}
                      className="flex cursor-pointer items-center gap-3 border-b border-border px-6 py-4 transition-colors hover:bg-sidebar-accent"
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggleContactSelection(contact)}
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white"
                        style={{ background: contact.avatarColor }}
                      >
                        {contact.avatar}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-sidebar-foreground">{contact.name}</h3>
                        <p className="text-xs text-muted-foreground">{contact.email}</p>
                      </div>
                      <div
                        className={`h-2 w-2 rounded-full ${contact.status === "online"
                            ? "bg-green-500"
                            : contact.status === "away"
                              ? "bg-yellow-500"
                              : contact.status === "busy"
                                ? "bg-red-500"
                                : "bg-gray-400"
                          }`}
                      />
                    </div>
                  )
                })}
              </div>

              {/* Botão Avançar */}
              <div className="p-4 border-t border-border">
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={onNextStep}
                  disabled={selectedContacts.length === 0}
                >
                  Avançar ({selectedContacts.length} selecionados)
                </Button>
              </div>
            </>
          ) : (
            /* ETAPA 2: Configuração do grupo */
            <>
              {/* Header */}
              <div className="flex items-center gap-2 border-b border-border px-6 py-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onPrevStep}
                  className="h-8 w-8 text-muted-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-semibold text-sidebar-foreground">Configurar Grupo</h2>
              </div>

              {/* Nome do Grupo */}
              <div className="p-4 border-b border-border">
                <label className="text-sm font-medium text-sidebar-foreground mb-2 block">
                  Nome do Grupo
                </label>
                <Input
                  placeholder="Digite o nome do grupo"
                  value={groupName}
                  onChange={(e) => onGroupNameChange(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Lista de Membros com Roles */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-sidebar-foreground mb-3">
                    Membros do Grupo ({groupMembers.length})
                  </h3>
                  <div className="space-y-3">
                    {groupMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                            style={{ background: member.avatarColor }}
                          >
                            {member.avatar}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-sidebar-foreground">{member.name}</h4>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <Select
                          value={member.role}
                          onValueChange={(value: "USER" | "ADMIN") => onRoleChange(member.id, value)}
                        >
                          <SelectTrigger className="w-28 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USER">User</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botão Criar Grupo */}
              <div className="p-4 border-t border-border">
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={onCreateGroup}
                  disabled={!groupName.trim() || groupMembers.length === 0}
                >
                  Criar Grupo
                </Button>
              </div>
            </>
          )}
        </>
      ) : isNewConversationMode ? (
        /* MODO NOVA CONVERSA (existente) */
        <>
          <div className="flex items-center gap-2 border-b border-border px-6 py-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancelNewConversation}
              className="h-8 w-8 text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold text-sidebar-foreground">Nova Conversa</h2>
          </div>

          <div className="px-6 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Pesquisar contatos..." className="pl-9" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => onContactSelect(contact)}
                className="flex cursor-pointer items-center gap-3 border-b border-border px-6 py-4 transition-colors hover:bg-sidebar-accent"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ background: contact.avatarColor }}
                >
                  {contact.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-sidebar-foreground">{contact.name}</h3>
                  <p className="text-xs text-muted-foreground">{contact.email}</p>
                </div>
                <div
                  className={`h-2 w-2 rounded-full ${contact.status === "online"
                      ? "bg-green-500"
                      : contact.status === "away"
                        ? "bg-yellow-500"
                        : contact.status === "busy"
                          ? "bg-red-500"
                          : "bg-gray-400"
                    }`}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        /* MODO NORMAL */
        <>
          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => onTabChange("chats")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === "chats"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Conversas
            </button>
            <button
              onClick={() => onTabChange("groups")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === "groups"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Grupos
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2 px-6 py-4">
            <Button
              className="flex-1 gap-2 bg-purple-600 hover:bg-purple-700"
              onClick={onNewConversation}
            >
              <UserPlus className="h-4 w-4" />
              Nova Conversa
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2 bg-transparent"
              onClick={onNewGroup}
            >
              <Users className="h-4 w-4" />
              Novo Grupo
            </Button>
          </div>

          {/* Search */}
          <div className="px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Pesquisar conversas..." className="pl-9" />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={activeConversation ? activeConversation.id === conversation.id : false}
                onClick={() => onConversationSelect(conversation)}
              />
            ))}
          </div>
        </>
      )}

      {/* User Profile (sempre visível) */}
      {/* <div
        onClick={onProfileClick}
        className="flex cursor-pointer items-center gap-3 border-t border-border px-6 py-4 transition-colors hover:bg-sidebar-accent"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-400 text-sm font-semibold text-white">
          {user.avatar}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-sidebar-foreground">{user.name}</h3>
          <p className="text-xs text-muted-foreground">{user.type}</p>
        </div>
        <div
          className={`h-2 w-2 rounded-full ${
            user.status === "online"
              ? "bg-green-500"
              : user.status === "away"
                ? "bg-yellow-500"
                : user.status === "busy"
                  ? "bg-red-500"
                  : "bg-gray-400"
          }`}
        />
      </div> */}
      {/* User Profile (sempre visível) */}
      <div
        onClick={onProfileClick}
        className="flex cursor-pointer items-center gap-3 border-t border-border px-6 py-4 transition-colors hover:bg-sidebar-accent"
      >
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-400 text-sm font-semibold text-white">
            {user.avatar}
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-background">
            <div
              className={`h-2 w-2 rounded-full ${user.status === "online"
                  ? "bg-green-500"
                  : user.status === "away"
                    ? "bg-yellow-500"
                    : user.status === "busy"
                      ? "bg-red-500"
                      : "bg-gray-400"
                }`}
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-sidebar-foreground truncate">{user.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>
    </div>
  )
}