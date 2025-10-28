// "use client"

// import { useEffect, useState, useMemo } from "react"
// import { Sidebar } from "@/components/sidebar"
// import { ChatArea } from "@/components/chat-area"
// import { ProfileModal } from "@/components/profile-modal"
// import { useRouter } from "next/navigation"

// export type UserType = "USER" | "MANAGER" | "ADMIN"
// export type UserStatus = "online" | "away" | "busy" | "offline"

// export interface User {
//   name: string
//   email: string
//   type: UserType
//   status: UserStatus
//   avatar: string
// }

// export interface Conversation {
//   id: string
//   name: string
//   avatar: string
//   avatarColor: string
//   lastMessage: string
//   time: string
//   unreadCount?: number
//   isGroup?: boolean
//   isOnline?: boolean
// }

// export interface Message {
//   id: string
//   text: string
//   sender: string
//   time: string
//   isSent: boolean
// }

// export interface Contact {
//   id: string
//   name: string
//   email: string
//   avatar: string
//   avatarColor: string
//   status: UserStatus
//   type: UserType
// }

// // Nova interface para membros do grupo com role
// export interface GroupMember extends Contact {
//   role: "USER" | "ADMIN"
// }

// export default function Home() {
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/login");
//     }
//   }, [router]);

//   const [isDarkMode, setIsDarkMode] = useState(false)
//   const [activeTab, setActiveTab] = useState<"chats" | "groups">("chats")
//   const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
//   const [isNewConversationMode, setIsNewConversationMode] = useState(false)
//   const [isNewGroupMode, setIsNewGroupMode] = useState(false) // Novo estado para modo grupo
//   const [newGroupStep, setNewGroupStep] = useState<1 | 2>(1) // Etapa atual do novo grupo
//   const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]) // Contatos selecionados
//   const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]) // Membros com roles
//   const [groupName, setGroupName] = useState("") // Nome do grupo

//   const [user, setUser] = useState<User>({
//     name: "João Silva",
//     email: "joao.silva@empresa.com",
//     type: "MANAGER",
//     status: "online",
//     avatar: "JS",
//   })

//   // Lista de contatos disponíveis
//   const availableContacts: Contact[] = [
//     {
//       id: "c1",
//       name: "Ana Souza",
//       email: "ana.souza@empresa.com",
//       avatar: "AS",
//       avatarColor: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
//       status: "online",
//       type: "USER"
//     },
//     {
//       id: "c2",
//       name: "Carlos Lima",
//       email: "carlos.lima@empresa.com",
//       avatar: "CL",
//       avatarColor: "linear-gradient(135deg, #f59e0b, #fbbf24)",
//       status: "away",
//       type: "MANAGER"
//     },
//     {
//       id: "c3",
//       name: "Mariana Costa",
//       email: "mariana.costa@empresa.com",
//       avatar: "MC",
//       avatarColor: "linear-gradient(135deg, #ec4899, #f472b6)",
//       status: "online",
//       type: "USER"
//     },
//     {
//       id: "c4",
//       name: "Roberto Alves",
//       email: "roberto.alves@empresa.com",
//       avatar: "RA",
//       avatarColor: "linear-gradient(135deg, #10b981, #34d399)",
//       status: "busy",
//       type: "ADMIN"
//     },
//     {
//       id: "c5",
//       name: "Fernanda Oliveira",
//       email: "fernanda.oliveira@empresa.com",
//       avatar: "FO",
//       avatarColor: "linear-gradient(135deg, #ef4444, #f87171)",
//       status: "offline",
//       type: "USER"
//     },
//   ]

//   // Todas as conversas disponíveis
//   const [allConversations, setAllConversations] = useState<Conversation[]>([
//     {
//       id: "1",
//       name: "Maria Costa",
//       avatar: "MC",
//       avatarColor: "linear-gradient(135deg, #10b981, #34d399)",
//       lastMessage: "Precisamos finalizar o relatório até sexta...",
//       time: "10:45",
//       unreadCount: 3,
//       isOnline: true,
//       isGroup: false,
//     },
//     {
//       id: "2",
//       name: "Projeto Alpha",
//       avatar: "PA",
//       avatarColor: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
//       lastMessage: "Carlos: A reunião foi adiada para amanhã",
//       time: "09:30",
//       unreadCount: 12,
//       isGroup: true,
//     },
//     {
//       id: "3",
//       name: "Pedro Fernandes",
//       avatar: "PF",
//       avatarColor: "linear-gradient(135deg, #f59e0b, #fbbf24)",
//       lastMessage: "Obrigado pela ajuda no projeto!",
//       time: "Ontem",
//       isGroup: false,
//     },
//     {
//       id: "4",
//       name: "Marketing Digital",
//       avatar: "MD",
//       avatarColor: "linear-gradient(135deg, #ec4899, #f472b6)",
//       lastMessage: "Ana: Novo briefing disponível",
//       time: "Ontem",
//       isGroup: true,
//     },
//     {
//       id: "5",
//       name: "Carlos Santos",
//       avatar: "CS",
//       avatarColor: "linear-gradient(135deg, #ef4444, #f87171)",
//       lastMessage: "Enviei o documento atualizado",
//       time: "Seg",
//       isGroup: false,
//     },
//     {
//       id: "6",
//       name: "Lançamento Técnico",
//       avatar: "LT",
//       avatarColor: "linear-gradient(135deg, #06b6d4, #22d3ee)",
//       lastMessage: "Você: Vamos precisar de mais testes",
//       time: "Sáb",
//       isGroup: true,
//     },
//   ])

//   // Filtra as conversas baseado na tab ativa
//   const filteredConversations = useMemo(() => {
//     return allConversations.filter(conversation => 
//       activeTab === "chats" 
//         ? !conversation.isGroup
//         : conversation.isGroup
//     )
//   }, [activeTab, allConversations])

//   // Define a conversa ativa inicial
//   const [activeConversation, setActiveConversation] = useState<Conversation>(() => 
//     filteredConversations[0] || allConversations[0]
//   )

//   // Atualiza a conversa ativa quando o filtro muda
//   useEffect(() => {
//     if (!filteredConversations.find(conv => conv.id === activeConversation.id)) {
//       setActiveConversation(filteredConversations[0] || allConversations[0])
//     }
//   }, [filteredConversations, activeConversation.id])

//   const handleTabChange = (tab: "chats" | "groups") => {
//     setActiveTab(tab)
//   }

//   const handleConversationSelect = (conversation: Conversation) => {
//     setActiveConversation(conversation)
//   }

//   // Função para iniciar nova conversa
//   const handleNewConversation = () => {
//     setIsNewConversationMode(true)
//     setIsNewGroupMode(false)
//   }

//   // Função para selecionar um contato e criar nova conversa
//   const handleContactSelect = (contact: Contact) => {
//     const existingConversation = allConversations.find(
//       conv => !conv.isGroup && conv.name === contact.name
//     )

//     if (existingConversation) {
//       setActiveConversation(existingConversation)
//     } else {
//       const newConversation: Conversation = {
//         id: `new-${Date.now()}`,
//         name: contact.name,
//         avatar: contact.avatar,
//         avatarColor: contact.avatarColor,
//         lastMessage: "Conversa iniciada",
//         time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
//         isGroup: false,
//         isOnline: contact.status === "online",
//       }

//       setAllConversations(prev => [newConversation, ...prev])
//       setActiveConversation(newConversation)
//     }

//     setIsNewConversationMode(false)
//   }

//   // Função para cancelar modo nova conversa
//   const handleCancelNewConversation = () => {
//     setIsNewConversationMode(false)
//   }

//   // Funções para Novo Grupo
//   const handleNewGroup = () => {
//     setIsNewGroupMode(true)
//     setIsNewConversationMode(false)
//     setNewGroupStep(1)
//     setSelectedContacts([])
//     setGroupMembers([])
//     setGroupName("")
//   }

//   const handleCancelNewGroup = () => {
//     setIsNewGroupMode(false)
//     setNewGroupStep(1)
//     setSelectedContacts([])
//     setGroupMembers([])
//     setGroupName("")
//   }

//   const handleToggleContactSelection = (contact: Contact) => {
//     setSelectedContacts(prev => {
//       const isSelected = prev.find(c => c.id === contact.id)
//       if (isSelected) {
//         return prev.filter(c => c.id !== contact.id)
//       } else {
//         return [...prev, contact]
//       }
//     })
//   }

//   const handleNextStep = () => {
//     if (selectedContacts.length > 0) {
//       // Converte os contatos selecionados para GroupMember com role padrão "USER"
//       const members: GroupMember[] = selectedContacts.map(contact => ({
//         ...contact,
//         role: "USER" as const
//       }))
//       setGroupMembers(members)
//       setNewGroupStep(2)
//     }
//   }

//   const handlePrevStep = () => {
//     setNewGroupStep(1)
//   }

//   const handleRoleChange = (contactId: string, newRole: "USER" | "ADMIN") => {
//     setGroupMembers(prev =>
//       prev.map(member =>
//         member.id === contactId ? { ...member, role: newRole } : member
//       )
//     )
//   }

//   const handleCreateGroup = () => {
//     if (!groupName.trim() || groupMembers.length === 0) return

//     const newGroupConversation: Conversation = {
//       id: `group-${Date.now()}`,
//       name: groupName,
//       avatar: groupName.split(' ').map(word => word[0]).join('').toUpperCase(),
//       avatarColor: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
//       lastMessage: "Grupo criado",
//       time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
//       isGroup: true,
//     }

//     setAllConversations(prev => [newGroupConversation, ...prev])
//     setActiveConversation(newGroupConversation)
//     handleCancelNewGroup()
    
//     // Reset messages for the new group
//     setMessages([
//       {
//         id: "1",
//         text: `Grupo "${groupName}" criado com sucesso!`,
//         sender: "Sistema",
//         time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
//         isSent: false,
//       }
//     ])
//   }

//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: "1",
//       text: "Olá João, temos que finalizar o relatório do projeto Alpha até sexta-feira.",
//       sender: "Maria Costa",
//       time: "10:30",
//       isSent: false,
//     },
//     {
//       id: "2",
//       text: "Entendi. Qual parte cada um ficará responsável?",
//       sender: "Você",
//       time: "10:32",
//       isSent: true,
//     },
//     {
//       id: "3",
//       text: "Você pode cuidar da análise de dados. Carlos ficará com a parte escrita e eu com a revisão final.",
//       sender: "Maria Costa",
//       time: "10:33",
//       isSent: false,
//     },
//     {
//       id: "4",
//       text: "Precisamos também incluir os gráficos que o Pedro preparou.",
//       sender: "Maria Costa",
//       time: "10:34",
//       isSent: false,
//     },
//     {
//       id: "5",
//       text: "Perfeito! Vou começar a trabalhar na análise hoje à tarde.",
//       sender: "Você",
//       time: "10:35",
//       isSent: true,
//     },
//     {
//       id: "6",
//       text: "Ótimo! Lembrem-se de atualizar o progresso no Trello também.",
//       sender: "Carlos Santos",
//       time: "10:40",
//       isSent: false,
//     },
//   ])

//   const handleSendMessage = (text: string) => {
//     const newMessage: Message = {
//       id: Date.now().toString(),
//       text,
//       sender: "Você",
//       time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
//       isSent: true,
//     }
//     setMessages([...messages, newMessage])

//     // Simulate response
//     setTimeout(
//       () => {
//         const responses = [
//           "Ok, entendi!",
//           "Vou verificar isso.",
//           "Perfeito, obrigada!",
//           "Podemos discutir isso na próxima reunião.",
//           "Concordo com sua sugestão.",
//         ]
//         const randomResponse = responses[Math.floor(Math.random() * responses.length)]
//         const replyMessage: Message = {
//           id: (Date.now() + 1).toString(),
//           text: randomResponse,
//           sender: activeConversation.name,
//           time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
//           isSent: false,
//         }
//         setMessages((prev) => [...prev, replyMessage])
//       },
//       1000 + Math.random() * 2000,
//     )
//   }

//   return (
//     <div className={isDarkMode ? "dark" : ""}>
//       <div className="flex h-screen w-full overflow-hidden bg-background">
//         <Sidebar
//           conversations={filteredConversations}
//           activeConversation={activeConversation}
//           onConversationSelect={handleConversationSelect}
//           activeTab={activeTab}
//           onTabChange={handleTabChange}
//           isDarkMode={isDarkMode}
//           onThemeToggle={() => setIsDarkMode(!isDarkMode)}
//           user={user}
//           onProfileClick={() => setIsProfileModalOpen(true)}
//           // Props para modo nova conversa
//           isNewConversationMode={isNewConversationMode}
//           onNewConversation={handleNewConversation}
//           onCancelNewConversation={handleCancelNewConversation}
//           contacts={availableContacts}
//           onContactSelect={handleContactSelect}
//           // Props para modo novo grupo
//           isNewGroupMode={isNewGroupMode}
//           newGroupStep={newGroupStep}
//           selectedContacts={selectedContacts}
//           groupMembers={groupMembers}
//           groupName={groupName}
//           onNewGroup={handleNewGroup}
//           onCancelNewGroup={handleCancelNewGroup}
//           onToggleContactSelection={handleToggleContactSelection}
//           onNextStep={handleNextStep}
//           onPrevStep={handlePrevStep}
//           onRoleChange={handleRoleChange}
//           onGroupNameChange={setGroupName}
//           onCreateGroup={handleCreateGroup}
//         />
//         <ChatArea conversation={activeConversation} messages={messages} onSendMessage={handleSendMessage} />
//         <ProfileModal
//           isOpen={isProfileModalOpen}
//           onClose={() => setIsProfileModalOpen(false)}
//           user={user}
//           onSave={setUser}
//         />
//       </div>
//     </div>
//   )
// }



"use client"

import { useEffect, useState, useMemo } from "react"
import { Sidebar } from "@/components/sidebar"
import { ChatArea } from "@/components/chat-area"
import { ProfileModal } from "@/components/profile-modal"
import { useRouter } from "next/navigation"
import { apiService } from "@/services/api"

// Suas interfaces permanecem as mesmas...
export type UserType = "USER" | "MANAGER" | "ADMIN"
export type UserStatus = "online" | "away" | "busy" | "offline"

export interface User {
  id: string
  name: string
  email: string
  type: UserType
  status: UserStatus
  avatar: string
}

export interface Conversation {
  id: string
  name: string
  avatar: string
  avatarColor: string
  lastMessage: string
  time: string
  unreadCount?: number
  isGroup?: boolean
  isOnline?: boolean
}

export interface Message {
  id: string
  text: string
  sender: string
  time: string
  isSent: boolean
  senderId?: string
}

export interface Contact {
  id: string
  name: string
  email: string
  avatar: string
  avatarColor: string
  status: UserStatus
  type: UserType
}

export interface GroupMember extends Contact {
  role: "USER" | "ADMIN"
}

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      loadInitialData();
    }
  }, [router]);

  const [isDarkMode, setIsDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState<"chats" | "groups">("chats")
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isNewConversationMode, setIsNewConversationMode] = useState(false)
  const [isNewGroupMode, setIsNewGroupMode] = useState(false)
  const [newGroupStep, setNewGroupStep] = useState<1 | 2>(1)
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([])
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([])
  const [groupName, setGroupName] = useState("")

  const [user, setUser] = useState<User | null>(null)
  const [availableContacts, setAvailableContacts] = useState<Contact[]>([])
  const [allConversations, setAllConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)

  // Carrega dados iniciais da API
  const loadInitialData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Carrega usuário atual
      const userResponse = await apiService.getCurrentUser()
      setUser(userResponse.data)

      // Carrega conversas
      const conversationsResponse = await apiService.getConversations()
      setAllConversations(conversationsResponse.data)

      // Carrega contatos
      const contactsResponse = await apiService.getContacts()
      setAvailableContacts(contactsResponse.data)

      // Define conversa ativa inicial
      if (conversationsResponse.data.length > 0) {
        setActiveConversation(conversationsResponse.data[0])
      }

    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      setError('Erro ao carregar dados. Tente novamente.')
      
      // Se der erro de autenticação, redireciona para login
      if (err instanceof Error && err.message.includes('401')) {
        localStorage.removeItem('token')
        router.push('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  // Carrega mensagens quando a conversa ativa muda
  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.id)
    }
  }, [activeConversation])

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await apiService.getMessages(conversationId)
      setMessages(response.data)
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err)
      setError('Erro ao carregar mensagens.')
    }
  }

  // Filtra as conversas baseado na tab ativa
  const filteredConversations = useMemo(() => {
    return allConversations.filter(conversation => 
      activeTab === "chats" 
        ? !conversation.isGroup
        : conversation.isGroup
    )
  }, [activeTab, allConversations])

  const handleTabChange = (tab: "chats" | "groups") => {
    setActiveTab(tab)
  }

  const handleConversationSelect = async (conversation: Conversation) => {
    setActiveConversation(conversation)
  }

  // Função para iniciar nova conversa
  const handleNewConversation = () => {
    setIsNewConversationMode(true)
    setIsNewGroupMode(false)
  }

  // Função para selecionar um contato e criar nova conversa
  const handleContactSelect = async (contact: Contact) => {
    try {
      const response = await apiService.createConversation(contact.id)
      const newConversation = response.data

      setAllConversations(prev => [newConversation, ...prev])
      setActiveConversation(newConversation)
      setIsNewConversationMode(false)
      
    } catch (err) {
      console.error('Erro ao criar conversa:', err)
      setError('Erro ao criar conversa.')
    }
  }

  // Função para cancelar modo nova conversa
  const handleCancelNewConversation = () => {
    setIsNewConversationMode(false)
  }

  // Funções para Novo Grupo
  const handleNewGroup = () => {
    setIsNewGroupMode(true)
    setIsNewConversationMode(false)
    setNewGroupStep(1)
    setSelectedContacts([])
    setGroupMembers([])
    setGroupName("")
  }

  const handleCancelNewGroup = () => {
    setIsNewGroupMode(false)
    setNewGroupStep(1)
    setSelectedContacts([])
    setGroupMembers([])
    setGroupName("")
  }

  const handleToggleContactSelection = (contact: Contact) => {
    setSelectedContacts(prev => {
      const isSelected = prev.find(c => c.id === contact.id)
      if (isSelected) {
        return prev.filter(c => c.id !== contact.id)
      } else {
        return [...prev, contact]
      }
    })
  }

  const handleNextStep = () => {
    if (selectedContacts.length > 0) {
      const members: GroupMember[] = selectedContacts.map(contact => ({
        ...contact,
        role: "USER" as const
      }))
      setGroupMembers(members)
      setNewGroupStep(2)
    }
  }

  const handlePrevStep = () => {
    setNewGroupStep(1)
  }

  const handleRoleChange = (contactId: string, newRole: "USER" | "ADMIN") => {
    setGroupMembers(prev =>
      prev.map(member =>
        member.id === contactId ? { ...member, role: newRole } : member
      )
    )
  }

  const handleCreateGroup = async () => {
    if (!groupName.trim() || groupMembers.length === 0) return

    try {
      const groupData = {
        name: groupName,
        members: groupMembers.map(member => ({
          id: member.id,
          role: member.role
        }))
      }

      const response = await apiService.createGroup(groupData)
      const newGroupConversation = response.data

      setAllConversations(prev => [newGroupConversation, ...prev])
      setActiveConversation(newGroupConversation)
      handleCancelNewGroup()
      
      // Mensagem inicial do sistema
      setMessages([
        {
          id: "system-" + Date.now(),
          text: `Grupo "${groupName}" criado com sucesso!`,
          sender: "Sistema",
          time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
          isSent: false,
        }
      ])

    } catch (err) {
      console.error('Erro ao criar grupo:', err)
      setError('Erro ao criar grupo.')
    }
  }

  const handleSendMessage = async (text: string) => {
    if (!activeConversation) return

    try {
      // Envia mensagem para API
      const response = await apiService.sendMessage(activeConversation.id, text)
      const newMessage = response.data

      // Atualiza mensagens localmente
      setMessages(prev => [...prev, newMessage])

      // Atualiza última mensagem na lista de conversas
      setAllConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversation.id
            ? { ...conv, lastMessage: text, time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) }
            : conv
        )
      )

    } catch (err) {
      console.error('Erro ao enviar mensagem:', err)
      setError('Erro ao enviar mensagem.')
    }
  }

  const handleUpdateProfile = async (updatedUser: User) => {
    try {
      const response = await apiService.updateUser(updatedUser)
      setUser(response.data)
      setIsProfileModalOpen(false)
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err)
      setError('Erro ao atualizar perfil.')
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button 
            onClick={loadInitialData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar
          conversations={filteredConversations}
          activeConversation={activeConversation}
          onConversationSelect={handleConversationSelect}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isDarkMode={isDarkMode}
          onThemeToggle={() => setIsDarkMode(!isDarkMode)}
          user={user}
          onProfileClick={() => setIsProfileModalOpen(true)}
          isNewConversationMode={isNewConversationMode}
          onNewConversation={handleNewConversation}
          onCancelNewConversation={handleCancelNewConversation}
          contacts={availableContacts}
          onContactSelect={handleContactSelect}
          isNewGroupMode={isNewGroupMode}
          newGroupStep={newGroupStep}
          selectedContacts={selectedContacts}
          groupMembers={groupMembers}
          groupName={groupName}
          onNewGroup={handleNewGroup}
          onCancelNewGroup={handleCancelNewGroup}
          onToggleContactSelection={handleToggleContactSelection}
          onNextStep={handleNextStep}
          onPrevStep={handlePrevStep}
          onRoleChange={handleRoleChange}
          onGroupNameChange={setGroupName}
          onCreateGroup={handleCreateGroup}
        />
        
        {activeConversation ? (
          <ChatArea 
            conversation={activeConversation} 
            messages={messages} 
            onSendMessage={handleSendMessage} 
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Selecione uma conversa para começar</p>
          </div>
        )}
        
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={user}
          onSave={handleUpdateProfile}
        />
      </div>
    </div>
  )
}


