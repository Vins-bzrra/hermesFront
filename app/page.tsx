"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import { Sidebar } from "@/components/sidebar"
import { ChatArea } from "@/components/chat-area"
import { ProfileModal } from "@/components/profile-modal"
import { useRouter } from "next/navigation"
import { apiService } from "@/services/api"

// Suas interfaces permanecem as mesmas...
export type UserType = "USER" | "MANAGER" | "ADMIN"
export type UserStatus = "online" | "away" | "busy" | "offline"
export type ConversationType = "PRIVATE" | "GROUP";
export type ConversationStatus = "ACTIVE" | "DISABLED"


export interface User {
  id: number
  name: string
  email: string
  role: UserType
  status: string
  clientId: string
  clientName: string
  lastLoginAt: string
  createdAt: string
  updatedAt: string
  avatar?: string
}

export interface Conversation {
  id: number
  name: string
  avatar: string
  avatarColor: string
  lastMessage: string
  time: string
  unreadCount?: number
  isGroup?: boolean
  isOnline?: boolean
  messages?: Message[]
}

export interface Message {
  id: number 
  conversationId: number 
  senderId: number
  senderName: string
  content: string
  status: string
  createdAt: string
  text?: string
  sender?: string
  time?: string
  isSent?: boolean
}

export interface Contact {
  id: number
  name: string
  email: string
  role: UserType
  status: string
  clientId: string
  clientName: string
  lastLoginAt: string
  createdAt: string
  updatedAt: string
  // Campos para compatibilidade com componentes existentes
  avatar?: string
  avatarColor?: string
  // type?: UserType
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

  // Usaremos uma ref para controlar quais conversas já carregaram mensagens
  const loadedConversationsRef = useRef<Set<number>>(new Set());

  // Função para ordenar mensagens por data (mais antigas primeiro - ORDEM CRESCENTE)
  const sortMessagesByDate = (messages: Message[]): Message[] => {
    return [...messages].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateA - dateB; // Ordem crescente: mais antigas primeiro
    });
  };

  // Função para processar mensagens do DTO (ajustar ordem e formatar)
  const processMessagesFromDTO = (messages: Message[]): Message[] => {
    if (!messages || messages.length === 0) return [];
    
    console.log('Mensagens antes da ordenação:', messages.map(m => ({
      id: m.id,
      content: m.content,
      createdAt: m.createdAt
    })));
    
    // Ordena as mensagens por data (mais antigas primeiro - ORDEM CRESCENTE)
    const sortedMessages = sortMessagesByDate(messages);
    
    console.log('Mensagens após ordenação:', sortedMessages.map(m => ({
      id: m.id,
      content: m.content,
      createdAt: m.createdAt
    })));
    
    // Adiciona campos formatados para cada mensagem
    return sortedMessages.map(message => ({
      ...message,
      text: message.content,
      sender: message.senderName,
      time: new Date(message.createdAt).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      isSent: message.senderId === user?.id
    }));
  };

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

      // Define conversa ativa inicial
      if (conversationsResponse.data.length > 0) {
        const initialConversation = conversationsResponse.data[0]
        setActiveConversation(initialConversation)
        
        // Se a conversa inicial já tem mensagens no DTO, usa elas
        if (initialConversation.messages && initialConversation.messages.length > 0) {
          console.log('Usando mensagens do DTO da conversa inicial:', initialConversation.id)
          const processedMessages = processMessagesFromDTO(initialConversation.messages)
          setMessages(processedMessages)
          loadedConversationsRef.current.add(initialConversation.id);
        } else {
          // Caso contrário, carrega as mensagens
          console.log('Carregando mensagens da API para conversa inicial:', initialConversation.id)
          loadMessages(initialConversation.id)
        }
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
      const conversationId = activeConversation.id;
      
      // Verifica se esta conversa já foi carregada anteriormente
      const hasBeenLoaded = loadedConversationsRef.current.has(conversationId);
      
      // Se a conversa tem mensagens do DTO e ainda não foi marcada como carregada
      if (activeConversation.messages && activeConversation.messages.length > 0 && !hasBeenLoaded) {
        console.log('Usando mensagens do DTO para conversa ativa:', conversationId)
        const processedMessages = processMessagesFromDTO(activeConversation.messages)
        setMessages(processedMessages)
        loadedConversationsRef.current.add(conversationId);
      } else {
        // Para todas as outras situações, carrega as mensagens da API
        // Isso inclui:
        // 1. Conversas sem mensagens no DTO
        // 2. Conversas que já foram carregadas antes (para atualizar as mensagens)
        console.log('Carregando mensagens da API para conversa ativa:', conversationId)
        loadMessages(conversationId)
      }
    }
  }, [activeConversation])

  const loadMessages = async (conversationId: number) => {
    try {
      const response = await apiService.getMessages(conversationId)
      // Processa as mensagens da API para garantir ordem e formatação consistentes
      const processedMessages = processMessagesFromDTO(response.data)
      setMessages(processedMessages)
      // Marca a conversa como carregada
      loadedConversationsRef.current.add(conversationId);
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
  const handleNewConversation = async () => {
    try {
      setLoading(true)
      
      // Verifica se temos o clientId do usuário logado
      if (!user?.clientId) {
        throw new Error('ClientId não disponível')
      }
      
      // Carrega os contatos usando o clientId do usuário logado
      const contactsResponse = await apiService.getContacts(user.clientId)
      
      // Transforma os dados da API para o formato esperado pelo componente
      const formattedContacts: Contact[] = contactsResponse.data.map(contact => ({
        ...contact,
        // Gera um avatar baseado na primeira letra do nome
        avatar: contact.avatar || contact.name.charAt(0),
        // Gera uma cor de avatar aleatória ou usa uma padrão
        avatarColor: contact.avatarColor || getRandomColor(),
        // Mapeia o status se necessário
        status: mapApiStatusToAppStatus(contact.status),
        // Mapeia role para type se necessário
        type: (contact.role as UserType) || 'USER'
      }))
      
      setAvailableContacts(formattedContacts)
      setIsNewConversationMode(true)
      setIsNewGroupMode(false)
    } catch (err) {
      console.error('Erro ao carregar contatos:', err)
      setError('Erro ao carregar lista de contatos.')
    } finally {
      setLoading(false)
    }
  }

  // Função auxiliar para gerar cor aleatória
const getRandomColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Função auxiliar para mapear status da API para o status do app
const mapApiStatusToAppStatus = (apiStatus: string): UserStatus => {
  const statusMap: Record<string, UserStatus> = {
    'ACTIVE': 'online',
    'INACTIVE': 'offline',
    'AWAY': 'away',
    'BUSY': 'busy'
  }
  return statusMap[apiStatus] || 'offline'
}

  // Função para selecionar um contato e criar nova conversa
  const handleContactSelect = async (contact: Contact) => {
    try {
      // Obter o ID do usuário atual
      const currentUserId = user?.id;
      
      if (!currentUserId) {
        throw new Error('Usuário não autenticado');
      }

      // Criar o objeto no formato que a API espera
      // const conversationData = {
      //   title: `Conversa com ${contact.name}`,
      //   type: "PRIVATE" as const,
      //   participantIds: [contact.id]
      // };

      const response = await apiService.createConversation(contact.id)
      const newConversation = response.data

      // Verifica se a conversa já existe na lista
      const existingConversationIndex = allConversations.findIndex(
        conv => conv.id === newConversation.id
      );

      if (existingConversationIndex !== -1) {
        // Se a conversa já existe, apenas ativa ela (não adiciona novamente)
        console.log('Conversa já existe, ativando:', newConversation.id);
        
        // Atualiza a conversa existente com quaisquer novas informações (como mensagens)
        const updatedConversations = [...allConversations];
        updatedConversations[existingConversationIndex] = {
          ...updatedConversations[existingConversationIndex],
          ...newConversation // Mantém dados existentes, atualiza com novos
        };
        
        setAllConversations(updatedConversations);
        setActiveConversation(updatedConversations[existingConversationIndex]);
        
        // Se a nova conversa trouxe mensagens, atualiza o estado de mensagens
        if (newConversation.messages && newConversation.messages.length > 0) {
          console.log('Usando mensagens do DTO da conversa existente');
          const processedMessages = processMessagesFromDTO(newConversation.messages)
          setMessages(processedMessages);
        }
        
        // Remove a conversa do conjunto de carregadas para forçar o recarregamento
        loadedConversationsRef.current.delete(newConversation.id);
        
      } else {
        // Se é uma conversa nova, adiciona no topo da lista
        console.log('Nova conversa criada:', newConversation.id);
        setAllConversations(prev => [newConversation, ...prev])
        setActiveConversation(newConversation)

        // Se a conversa trouxe mensagens, atualiza o estado de mensagens
        if (newConversation.messages && newConversation.messages.length > 0) {
          console.log('Usando mensagens do DTO da nova conversa');
          const processedMessages = processMessagesFromDTO(newConversation.messages)
          setMessages(processedMessages)
          loadedConversationsRef.current.add(newConversation.id);
        } else {
          console.log('Nova conversa sem mensagens, limpando estado');
          setMessages([])
        }
      }

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
  const handleNewGroup = async () => {
    try {
      setLoading(true)
      
      // Verifica se temos o clientId do usuário logado
      if (!user?.clientId) {
        throw new Error('ClientId não disponível')
      }
      
      // Carrega os contatos usando o clientId do usuário logado
      const contactsResponse = await apiService.getContacts(user.clientId)
      
      // Transforma os dados da API para o formato esperado pelo componente
      const formattedContacts: Contact[] = contactsResponse.data.map(contact => ({
        ...contact,
        avatar: contact.avatar || contact.name.charAt(0),
        avatarColor: contact.avatarColor || getRandomColor(),
        status: mapApiStatusToAppStatus(contact.status),
        type: (contact.role as UserType) || 'USER'
      }))
      
      setAvailableContacts(formattedContacts)
      setIsNewGroupMode(true)
      setIsNewConversationMode(false)
      setNewGroupStep(1)
      setSelectedContacts([])
      setGroupMembers([])
      setGroupName("")
    } catch (err) {
      console.error('Erro ao carregar contatos:', err)
      setError('Erro ao carregar lista de contatos.')
    } finally {
      setLoading(false)
    }
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

  const handleRoleChange = (contactId: number, newRole: "USER" | "ADMIN") => {
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
        title: groupName,
        type: "GROUP",
        participants: groupMembers.map(member => ({
          id: member.id,
          role: member.role
        }))
      }

      const response = await apiService.createGroup(groupData)
      const newGroupConversation = response.data

      setAllConversations(prev => [newGroupConversation, ...prev])
      setActiveConversation(newGroupConversation)
      
      // Se o grupo trouxe mensagens, atualiza o estado
      if (newGroupConversation.messages && newGroupConversation.messages.length > 0) {
        const processedMessages = processMessagesFromDTO(newGroupConversation.messages)
        setMessages(processedMessages)
      } else {
        setMessages([])
      }
      
      // Remove a conversa do conjunto de carregadas para forçar o recarregamento
      loadedConversationsRef.current.delete(newGroupConversation.id);
      
      handleCancelNewGroup()

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

      // Processa a nova mensagem para garantir formatação consistente
      const processedMessage = {
        ...newMessage,
        text: newMessage.content,
        sender: newMessage.senderName,
        time: new Date(newMessage.createdAt).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        isSent: newMessage.senderId === user?.id
      };

      // Atualiza mensagens localmente (adiciona ao final - ordem crescente)
      setMessages(prev => [...prev, processedMessage])

      // Atualiza última mensagem na lista de conversas
      setAllConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversation.id
            ? { 
                ...conv, 
                lastMessage: text, 
                time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
                // Se a conversa tem mensagens no estado, atualiza também
                messages: conv.messages ? [...conv.messages, processedMessage] : [processedMessage]
              }
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

  const handleAdminClick = () => {
    router.push("/admin")
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
          onAdminClick={handleAdminClick}
        />
        
        {activeConversation ? (
          <ChatArea 
            conversation={activeConversation} 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            currentUserId={user.id}
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