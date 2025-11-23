// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { 
//   Users, 
//   Settings, 
//   ArrowLeft, 
//   UserPlus, 
//   Shield,
//   Search,
//   MoreVertical,
//   Mail,
//   Calendar,
//   CheckCircle,
//   XCircle
// } from "lucide-react"
// import { apiService } from "@/services/api"
// import type { User, UserType, Contact } from "@/app/page"

// // Mock data - será substituído pela API
// const mockUsers: Contact[] = [
//   {
//     id: 1,
//     name: "João Silva",
//     email: "joao@empresa.com",
//     role: "USER",
//     status: "ACTIVE",
//     clientId: "client-1",
//     clientName: "Empresa A",
//     lastLoginAt: new Date().toISOString(),
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     avatar: "JS",
//     avatarColor: "#FF6B6B"
//   },
//   {
//     id: 2,
//     name: "Maria Santos",
//     email: "maria@empresa.com",
//     role: "ADMIN",
//     status: "ACTIVE",
//     clientId: "client-1",
//     clientName: "Empresa A",
//     lastLoginAt: new Date().toISOString(),
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     avatar: "MS",
//     avatarColor: "#4ECDC4"
//   },
//   {
//     id: 3,
//     name: "Pedro Oliveira",
//     email: "pedro@empresa.com",
//     role: "MANAGER",
//     status: "INACTIVE",
//     clientId: "client-1",
//     clientName: "Empresa A",
//     lastLoginAt: new Date().toISOString(),
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     avatar: "PO",
//     avatarColor: "#45B7D1"
//   },
//   {
//     id: 4,
//     name: "Ana Costa",
//     email: "ana@empresa.com",
//     role: "USER",
//     status: "INACTIVE",
//     clientId: "client-1",
//     clientName: "Empresa A",
//     lastLoginAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     avatar: "AC",
//     avatarColor: "#96CEB4"
//   },
//   {
//     id: 5,
//     name: "Carlos Souza",
//     email: "carlos@empresa.com",
//     role: "USER",
//     status: "ACTIVE",
//     clientId: "client-1",
//     clientName: "Empresa A",
//     lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     avatar: "CS",
//     avatarColor: "#FFEAA7"
//   }
// ]

// export default function AdminPage() {
//   const router = useRouter()
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [users, setUsers] = useState<Contact[]>(mockUsers)

//   useEffect(() => {
//     const token = localStorage.getItem("token")
//     if (!token) {
//       router.push("/login")
//       return
//     }

//     loadInitialData()
//   }, [router])

//   const loadInitialData = async () => {
//     try {
//       setLoading(true)
//       setError(null)
      
//       console.log('🔄 Carregando usuário da API...')
//       const userResponse = await apiService.getCurrentUser()
//       const currentUser = userResponse.data

//       // Verifica se é ADMIN
//       if (currentUser.role !== "ADMIN") {
//         console.warn('❌ Usuário não é ADMIN, redirecionando...')
//         router.push("/")
//         return
//       }

//       setUser(currentUser)

//     } catch (err) {
//       console.error('Erro ao carregar dados admin:', err)
      
//       // Se for erro de autenticação, redireciona para login
//       if (err instanceof Error && err.message.includes('401')) {
//         localStorage.removeItem('token')
//         router.push('/login')
//         return
//       }
      
//       setError('Erro ao carregar painel administrativo')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const filteredUsers = users.filter(user =>
//     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "online": return "bg-green-500"
//       case "away": return "bg-yellow-500"
//       case "busy": return "bg-red-500"
//       default: return "bg-gray-400"
//     }
//   }

//   const getStatusText = (status: string) => {
//     switch (status) {
//       case "online": return "Online"
//       case "away": return "Ausente"
//       case "busy": return "Ocupado"
//       default: return "Offline"
//     }
//   }

//   const getStatusBadge = (status: string) => {
//     const baseClasses = "flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium"
//     switch (status) {
//       case "online":
//         return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`
//       case "away":
//         return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`
//       case "busy":
//         return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`
//       default:
//         return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300`
//     }
//   }

//   const getRoleBadge = (role: string) => {
//     const baseClasses = "px-2 py-1 text-xs rounded-full font-medium"
//     switch (role) {
//       case "ADMIN":
//         return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300`
//       case "MANAGER":
//         return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`
//       default:
//         return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300`
//     }
//   }

//   const getActiveBadge = (status: string) => {
//     const isActive = status !== "INACTIVE" // Consideramos ativo se não estiver offline
//     const baseClasses = "flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium"
    
//     if (isActive) {
//       return (
//         <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`}>
//           <CheckCircle className="h-3 w-3" />
//           Ativo
//         </span>
//       )
//     } else {
//       return (
//         <span className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300`}>
//           <XCircle className="h-3 w-3" />
//           Inativo
//         </span>
//       )
//     }
//   }

//   const formatLastLogin = (dateString: string) => {
//     try {
//       const date = new Date(dateString)
//       const now = new Date()
//       const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
      
//       if (diffDays === 0) return "Hoje"
//       if (diffDays === 1) return "Ontem"
//       if (diffDays < 7) return `${diffDays} dias atrás`
//       return date.toLocaleDateString('pt-BR')
//     } catch {
//       return "Nunca"
//     }
//   }

//   const handleEditUser = (userId: number) => {
//     // Implementar edição de usuário
//     console.log('Editar usuário:', userId)
//   }

//   const handleCreateUser = () => {
//     // Implementar criação de usuário
//     console.log('Criar novo usuário')
//   }

//   if (error) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center bg-background">
//         <div className="text-center max-w-md">
//           <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
//             <Shield className="h-6 w-6 text-destructive" />
//           </div>
//           <h3 className="text-lg font-semibold text-foreground mb-2">Erro ao carregar</h3>
//           <p className="text-muted-foreground mb-4">{error}</p>
//           <Button 
//             onClick={loadInitialData}
//             className="bg-purple-600 hover:bg-purple-700"
//           >
//             Tentar Novamente
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   if (loading) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center bg-background">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
//           <p className="mt-4 text-muted-foreground">Carregando painel administrativo...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!user) {
//     return null
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header Fixo */}
//       <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => router.push("/")}
//                 className="h-8 w-8"
//               >
//                 <ArrowLeft className="h-4 w-4" />
//               </Button>
//               <div className="flex items-center gap-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 text-white">
//                   <Shield className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <h1 className="text-2xl font-bold text-card-foreground">Painel de Administração</h1>
//                   <p className="text-sm text-muted-foreground">
//                     Gerencie usuários e configurações do sistema
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
//                 ADMIN
//               </Badge>
//               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-xs font-semibold text-white">
//                 {user.name?.charAt(0) || "A"}
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto px-6 py-8">
//         {/* Abas Principais */}
//         <div className="bg-card rounded-lg border border-border">
//           <Tabs defaultValue="users" className="w-full">
//             <div className="border-b border-border">
//               <div className="px-6">
//                 <TabsList className="h-12 bg-transparent p-0">
//                   <TabsTrigger 
//                     value="users" 
//                     className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none h-12 px-4"
//                   >
//                     <Users className="h-4 w-4" />
//                     Gestão de Usuários
//                   </TabsTrigger>
//                   <TabsTrigger 
//                     value="settings" 
//                     className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none h-12 px-4"
//                   >
//                     <Settings className="h-4 w-4" />
//                     Configurações
//                   </TabsTrigger>
//                 </TabsList>
//               </div>
//             </div>

//             <div className="p-6">
//               {/* Tab: Gestão de Usuários */}
//               <TabsContent value="users" className="space-y-6 m-0">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h2 className="text-2xl font-bold tracking-tight">Gestão de Usuários</h2>
//                     <p className="text-muted-foreground">
//                       Gerencie contas de usuário e permissões do sistema
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <div className="relative w-64">
//                       <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                       <Input 
//                         placeholder="Pesquisar usuários..." 
//                         className="pl-9"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                       />
//                     </div>
//                     <Button 
//                       className="bg-purple-600 hover:bg-purple-700"
//                       onClick={handleCreateUser}
//                     >
//                       <UserPlus className="h-4 w-4 mr-2" />
//                       Novo Usuário
//                     </Button>
//                   </div>
//                 </div>

//                 <Card>
//                   <CardHeader className="pb-3">
//                     <CardTitle>Lista de Usuários</CardTitle>
//                     <CardDescription>
//                       {filteredUsers.length} usuários encontrados
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent className="p-0">
//                     <div className="border-t border-border">
//                       {filteredUsers.map((user) => (
//                         <div key={user.id} className="flex items-center justify-between p-4 border-b border-border hover:bg-sidebar-accent transition-colors">
//                           <div className="flex items-center gap-4 flex-1">
//                             <div className="relative">
//                               <div
//                                 className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white"
//                                 style={{ background: user.avatarColor }}
//                               >
//                                 {user.avatar}
//                               </div>
//                               {/* <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`} /> */}
//                             </div>
                            
//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-center gap-2 mb-1">
//                                 <h3 className="font-semibold text-foreground truncate">{user.name}</h3>
//                                 <span className={getRoleBadge(user.role)}>
//                                   {user.role}
//                                 </span>
//                                 {getActiveBadge(user.status)}
//                               </div>
//                               <p className="text-sm text-muted-foreground truncate mb-2">{user.email}</p>
//                               <div className="flex items-center gap-4">
//                                 <div className="flex items-center gap-1 text-xs text-muted-foreground">
//                                   <Calendar className="h-3 w-3" />
//                                   Último login: {formatLastLogin(user.lastLoginAt)}
//                                 </div>
//                                 <div className="flex items-center gap-1 text-xs text-muted-foreground">
//                                   <Mail className="h-3 w-3" />
//                                   {user.clientName}
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
                          
//                           <div className="flex items-center gap-2">
//                             <Button variant="outline" size="sm">
//                               Editar
//                             </Button>
//                             <Button variant="ghost" size="icon">
//                               <MoreVertical className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
                    
//                     {filteredUsers.length === 0 && (
//                       <div className="p-8 text-center text-muted-foreground">
//                         <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
//                         <p>Nenhum usuário encontrado</p>
//                         <p className="text-sm mt-1">Tente ajustar os termos da pesquisa</p>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               {/* Tab: Configurações */}
//               <TabsContent value="settings" className="space-y-6 m-0">
//                 <div>
//                   <h2 className="text-2xl font-bold tracking-tight">Configurações do Sistema</h2>
//                   <p className="text-muted-foreground">
//                     Configure parâmetros gerais da aplicação
//                   </p>
//                 </div>

//                 <div className="grid gap-6">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Configurações Gerais</CardTitle>
//                       <CardDescription>
//                         Configurações básicas do ConnectApp
//                       </CardDescription>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <div className="text-sm text-muted-foreground">
//                         Painel de configurações em desenvolvimento...
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Segurança</CardTitle>
//                       <CardDescription>
//                         Configurações de segurança e privacidade
//                       </CardDescription>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <div className="text-sm text-muted-foreground">
//                         Configurações de segurança em desenvolvimento...
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </TabsContent>
//             </div>
//           </Tabs>
//         </div>
//       </main>
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Users, 
  Settings, 
  ArrowLeft, 
  UserPlus, 
  Shield,
  Search,
  MoreVertical,
  Mail,
  Calendar,
  CheckCircle,
  XCircle
} from "lucide-react"
import { apiService } from "@/services/api"
import type { User, UserType, Contact } from "@/app/page"

// Função para gerar cor aleatória para o avatar
const getRandomColor = () => {
  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
    "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Função para mapear status da API
const mapApiStatusToAppStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'ACTIVE': 'ACTIVE',
    'INACTIVE': 'INACTIVE',
    'online': 'ACTIVE',
    'offline': 'INACTIVE',
    'away': 'INACTIVE',
    'busy': 'INACTIVE'
  }
  return statusMap[status] || 'INACTIVE'
}

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<Contact[]>([])
  const [usersLoading, setUsersLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    loadInitialData()
  }, [router])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Carregando usuário da API...')
      const userResponse = await apiService.getCurrentUser()
      const currentUser = userResponse.data

      // Verifica se é ADMIN
      if (currentUser.role !== "ADMIN") {
        console.warn('❌ Usuário não é ADMIN, redirecionando...')
        router.push("/")
        return
      }

      setUser(currentUser)

      // Agora que temos o usuário, carregamos a lista de usuários
      await loadUsers(currentUser.clientId)

    } catch (err) {
      console.error('Erro ao carregar dados admin:', err)
      
      // Se for erro de autenticação, redireciona para login
      if (err instanceof Error && err.message.includes('401')) {
        localStorage.removeItem('token')
        router.push('/login')
        return
      }
      
      setError('Erro ao carregar painel administrativo')
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async (clientId: string) => {
    try {
      setUsersLoading(true)
      console.log('🔄 Carregando lista de usuários...')
      
      if (!clientId) {
        throw new Error('ClientId não disponível')
      }
      
      // Carrega os contatos usando o clientId fornecido
      const contactsResponse = await apiService.getContacts(clientId)
      
      // Transforma os dados da API para o formato esperado pelo componente
      const formattedContacts: Contact[] = contactsResponse.data.map(contact => ({
        ...contact,
        // Gera um avatar baseado nas iniciais do nome
        avatar: contact.avatar || getInitials(contact.name),
        // Gera uma cor de avatar aleatória ou usa uma padrão
        avatarColor: contact.avatarColor || getRandomColor(),
        // Mapeia o status se necessário
        status: mapApiStatusToAppStatus(contact.status),
        // Garante que role está no formato correto
        role: contact.role as UserType
      }))
      
      setUsers(formattedContacts)
    } catch (err) {
      console.error('Erro ao carregar usuários:', err)
      setError('Erro ao carregar lista de usuários.')
    } finally {
      setUsersLoading(false)
    }
  }

  // Função para obter iniciais do nome
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500"
      case "away": return "bg-yellow-500"
      case "busy": return "bg-red-500"
      default: return "bg-gray-400"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "online": return "Online"
      case "away": return "Ausente"
      case "busy": return "Ocupado"
      default: return "Offline"
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium"
    switch (status) {
      case "online":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`
      case "away":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`
      case "busy":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300`
    }
  }

  const getRoleBadge = (role: string) => {
    const baseClasses = "px-2 py-1 text-xs rounded-full font-medium"
    switch (role) {
      case "ADMIN":
        return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300`
      case "MANAGER":
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300`
    }
  }

  const getActiveBadge = (status: string) => {
    const isActive = status !== "INACTIVE"
    const baseClasses = "flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium"
    
    if (isActive) {
      return (
        <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`}>
          <CheckCircle className="h-3 w-3" />
          Ativo
        </span>
      )
    } else {
      return (
        <span className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300`}>
          <XCircle className="h-3 w-3" />
          Inativo
        </span>
      )
    }
  }

  const formatLastLogin = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) return "Hoje"
      if (diffDays === 1) return "Ontem"
      if (diffDays < 7) return `${diffDays} dias atrás`
      return date.toLocaleDateString('pt-BR')
    } catch {
      return "Nunca"
    }
  }

  const handleEditUser = (userId: number) => {
    // Implementar edição de usuário
    console.log('Editar usuário:', userId)
  }

  const handleCreateUser = () => {
    // Implementar criação de usuário
    console.log('Criar novo usuário')
  }

  const handleRefreshUsers = () => {
    if (user?.clientId) {
      loadUsers(user.clientId)
    }
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Erro ao carregar</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button 
            onClick={loadInitialData}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Tentar Novamente
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando painel administrativo...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Fixo */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/")}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 text-white">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-card-foreground">Painel de Administração</h1>
                  <p className="text-sm text-muted-foreground">
                    Gerencie usuários e configurações do sistema
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                ADMIN
              </Badge>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-xs font-semibold text-white">
                {user.name?.charAt(0) || "A"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Abas Principais */}
        <div className="bg-card rounded-lg border border-border">
          <Tabs defaultValue="users" className="w-full">
            <div className="border-b border-border">
              <div className="px-6">
                <TabsList className="h-12 bg-transparent p-0">
                  <TabsTrigger 
                    value="users" 
                    className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none h-12 px-4"
                  >
                    <Users className="h-4 w-4" />
                    Gestão de Usuários
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings" 
                    className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none h-12 px-4"
                  >
                    <Settings className="h-4 w-4" />
                    Configurações
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <div className="p-6">
              {/* Tab: Gestão de Usuários */}
              <TabsContent value="users" className="space-y-6 m-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Gestão de Usuários</h2>
                    <p className="text-muted-foreground">
                      Gerencie contas de usuário e permissões do sistema
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        placeholder="Pesquisar usuários..." 
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button 
                      variant="outline"
                      onClick={handleRefreshUsers}
                      disabled={usersLoading}
                    >
                      {usersLoading ? "Carregando..." : "Atualizar"}
                    </Button>
                    <Button 
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={handleCreateUser}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Novo Usuário
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Lista de Usuários</CardTitle>
                    <CardDescription>
                      {usersLoading ? "Carregando usuários..." : `${filteredUsers.length} usuários encontrados`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    {usersLoading ? (
                      <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Carregando lista de usuários...</p>
                      </div>
                    ) : (
                      <div className="border-t border-border">
                        {filteredUsers.map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-4 border-b border-border hover:bg-sidebar-accent transition-colors">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="relative">
                                <div
                                  className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white"
                                  style={{ background: user.avatarColor }}
                                >
                                  {user.avatar}
                                </div>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-foreground truncate">{user.name}</h3>
                                  <span className={getRoleBadge(user.role)}>
                                    {user.role}
                                  </span>
                                  {getActiveBadge(user.status)}
                                </div>
                                <p className="text-sm text-muted-foreground truncate mb-2">{user.email}</p>
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    Último login: {formatLastLogin(user.lastLoginAt)}
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Mail className="h-3 w-3" />
                                    {user.clientName}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" onClick={() => router.push(`/admin/users/${user.id}/edit`)}>
                                Editar
                              </Button>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {!usersLoading && filteredUsers.length === 0 && (
                      <div className="p-8 text-center text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p>Nenhum usuário encontrado</p>
                        <p className="text-sm mt-1">Tente ajustar os termos da pesquisa</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Configurações */}
              <TabsContent value="settings" className="space-y-6 m-0">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Configurações do Sistema</h2>
                  <p className="text-muted-foreground">
                    Configure parâmetros gerais da aplicação
                  </p>
                </div>

                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configurações Gerais</CardTitle>
                      <CardDescription>
                        Configurações básicas do ConnectApp
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Painel de configurações em desenvolvimento...
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Segurança</CardTitle>
                      <CardDescription>
                        Configurações de segurança e privacidade
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Configurações de segurança em desenvolvimento...
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  )
}