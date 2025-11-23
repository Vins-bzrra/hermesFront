// app/admin/users/[id]/edit/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { 
  ArrowLeft, 
  Save, 
  User,
  Mail,
  Building,
  Shield,
  CheckCircle,
  XCircle
} from "lucide-react"
import { apiService } from "@/services/api"
import type { User as Users, Contact, UserType } from "@/app/page"

// Função para gerar cor aleatória para o avatar
const getRandomColor = () => {
  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
    "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [currentUser, setCurrentUser] = useState<Users | null>(null)
  const [user, setUser] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    loadInitialData()
  }, [router, userId])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Primeiro carrega o usuário atual para verificar se é ADMIN
      console.log('🔄 Carregando usuário atual...')
      const userResponse = await apiService.getCurrentUser()
      const userData = userResponse.data

      // Verifica se é ADMIN
      if (userData.role !== "ADMIN") {
        console.warn('❌ Usuário não é ADMIN, redirecionando...')
        router.push("/")
        return
      }

      setCurrentUser(userData)

      // Agora carrega os dados do usuário a ser editado
      await loadUserData()

    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      
      if (err instanceof Error && err.message.includes('401')) {
        localStorage.removeItem('token')
        router.push('/login')
        return
      }
      
      setError('Erro ao carregar dados do usuário')
    } finally {
      setLoading(false)
    }
  }

  const loadUserData = async () => {
    try {
      console.log('🔄 Carregando dados do usuário...', userId)
      
      // Usa a requisição específica para buscar o usuário pelo ID
      const userResponse = await apiService.getUser(userId)
      const userData = userResponse.data
      
      if (!userData) {
        throw new Error('Usuário não encontrado')
      }
  
      // Formata os dados do usuário
      const formattedUser: Contact = {
        ...userData,
        avatar: userData.avatar || getInitials(userData.name),
        avatarColor: userData.avatar || getRandomColor(),
        // Garante que temos todos os campos necessários
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: userData.status,
        clientId: userData.clientId,
        clientName: userData.clientName,
        lastLoginAt: userData.lastLoginAt,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt
      }
      
      setUser(formattedUser)
  
    } catch (err) {
      console.error('Erro ao carregar usuário:', err)
      
      if (err instanceof Error && err.message.includes('404')) {
        setError('Usuário não encontrado.')
      } else if (err instanceof Error && err.message.includes('401')) {
        setError('Sem permissão para visualizar este usuário.')
      } else {
        setError('Erro ao carregar dados do usuário.')
      }
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

  const handleSave = async () => {
    if (!user) return

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      console.log('💾 Salvando alterações do usuário...', user)
      
      // Aqui você precisará implementar a chamada API para atualizar o usuário
      // Por enquanto, vamos simular a atualização
      // await apiService.updateUser(user.id, user)
      
      // Simulando um delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess('Alterações salvas com sucesso!')
      
      // Redireciona de volta após 2 segundos
      setTimeout(() => {
        router.push('/admin')
      }, 2000)

    } catch (err) {
      console.error('Erro ao salvar usuário:', err)
      setError('Erro ao salvar alterações.')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof Contact, value: any) => {
    if (user) {
      setUser({
        ...user,
        [field]: value
      })
    }
  }

  const handleStatusToggle = (active: boolean) => {
    if (user) {
      setUser({
        ...user,
        status: active ? 'ACTIVE' : 'INACTIVE'
      })
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

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return "Data inválida"
    }
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <User className="h-6 w-6 text-destructive" />
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
          <p className="mt-4 text-muted-foreground">Carregando dados do usuário...</p>
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
                onClick={() => router.push("/admin")}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 text-white">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-card-foreground">Editar Usuário</h1>
                  <p className="text-sm text-muted-foreground">
                    Modifique os dados do usuário
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-6 max-w-4xl mx-auto">
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 dark:bg-green-900/20 dark:border-green-800">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-300">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">{success}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-900/20 dark:border-red-800">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-300">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Dados principais do usuário
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full text-lg font-semibold text-white"
                  style={{ background: user.avatarColor }}
                >
                  {user.avatar}
                </div>
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={user.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Função
                    </div>
                  </Label>
                  <Select 
                    value={user.role} 
                    onValueChange={(value: UserType) => handleInputChange('role', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">Usuário</SelectItem>
                      <SelectItem value="MANAGER">Gerente</SelectItem>
                      <SelectItem value="ADMIN">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientName">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Empresa
                    </div>
                  </Label>
                  <Input
                    id="clientName"
                    value={user.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status e Configurações */}
          <Card>
            <CardHeader>
              <CardTitle>Status e Configurações</CardTitle>
              <CardDescription>
                Controle o status e permissões do usuário
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="status">Status do Usuário</Label>
                  <p className="text-sm text-muted-foreground">
                    {user.status === 'ACTIVE' ? 'Usuário ativo no sistema' : 'Usuário inativo no sistema'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${user.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-600'}`}>
                    {user.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                  </span>
                  <Switch
                    checked={user.status === 'ACTIVE'}
                    onCheckedChange={handleStatusToggle}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Data de Criação</Label>
                  <div className="text-sm text-muted-foreground p-2 bg-muted rounded-md">
                    {formatDate(user.createdAt)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Última Atualização</Label>
                  <div className="text-sm text-muted-foreground p-2 bg-muted rounded-md">
                    {formatDate(user.updatedAt)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Último Login</Label>
                <div className="text-sm text-muted-foreground p-2 bg-muted rounded-md">
                  {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Nunca fez login'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Sistema */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Sistema</CardTitle>
              <CardDescription>
                Dados técnicos e identificadores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ID do Cliente</Label>
                  <div className="text-sm text-muted-foreground p-2 bg-muted rounded-md font-mono">
                    {user.clientId}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Função Atual</Label>
                  <div className={getRoleBadge(user.role)}>
                    {user.role}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={() => router.push('/admin')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para a Lista
            </Button>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push('/admin')}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}