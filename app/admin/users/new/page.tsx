// "use client"

// import { useEffect, useState, useRef, useCallback } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { 
//   ArrowLeft, 
//   Save, 
//   User,
//   Mail,
//   Shield,
//   Key,
//   Eye,
//   EyeOff,
//   CheckCircle,
//   XCircle,
//   UserPlus
// } from "lucide-react"
// import { apiService } from "@/services/api"
// import type { User as Users, UserType } from "@/app/page"

// // Interface para os dados de criação do usuário
// export interface CreateUserRequest {
//   name: string
//   email: string
//   role: UserType
//   password: string
//   clientId: string
// }

// interface CreateUserFormData {
//   name: string
//   email: string
//   confirmEmail: string
//   role: UserType
//   password: string
//   confirmPassword: string
//   clientId: string
// }

// export default function NewUserPage() {
//   const router = useRouter()
//   const [currentUser, setCurrentUser] = useState<Users | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState<string | null>(null)
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
//   // Refs para os valores atuais e timeouts
//   const formDataRef = useRef<CreateUserFormData>({
//     name: "",
//     email: "",
//     confirmEmail: "",
//     role: "USER" as UserType,
//     password: "",
//     confirmPassword: "",
//     clientId: ""
//   })
  
//   const emailTimeoutRef = useRef<NodeJS.Timeout | null>(null)
//   const passwordTimeoutRef = useRef<NodeJS.Timeout | null>(null)

//   // Refs para scroll
//   const messagesRef = useRef<HTMLDivElement>(null)

//   // Estado do formulário
//   const [formData, setFormData] = useState<CreateUserFormData>({
//     name: "",
//     email: "",
//     confirmEmail: "",
//     role: "USER" as UserType,
//     password: "",
//     confirmPassword: "",
//     clientId: ""
//   })

//   // Estado de validação
//   const [errors, setErrors] = useState<{
//     name?: string
//     email?: string
//     confirmEmail?: string
//     role?: string
//     password?: string
//     confirmPassword?: string
//   }>({})

//   // Atualiza a ref quando o estado muda
//   useEffect(() => {
//     formDataRef.current = formData
//   }, [formData])

//   useEffect(() => {
//     const token = localStorage.getItem("token")
//     if (!token) {
//       router.push("/login")
//       return
//     }

//     loadCurrentUser()
//   }, [router])

//   // Efeito para fazer scroll até as mensagens quando houver sucesso OU erro
//   useEffect(() => {
//     if ((success || error) && messagesRef.current) {
//       setTimeout(() => {
//         messagesRef.current?.scrollIntoView({ 
//           behavior: 'smooth', 
//           block: 'center' 
//         })
//       }, 100)
//     }
//   }, [success, error])

//   // Cleanup dos timeouts
//   useEffect(() => {
//     return () => {
//       if (emailTimeoutRef.current) {
//         clearTimeout(emailTimeoutRef.current)
//       }
//       if (passwordTimeoutRef.current) {
//         clearTimeout(passwordTimeoutRef.current)
//       }
//     }
//   }, [])

//   const loadCurrentUser = async () => {
//     try {
//       setLoading(true)
//       setError(null)
      
//       console.log('🔄 Carregando usuário atual...')
//       const userResponse = await apiService.getCurrentUser()
//       const userData = userResponse.data

//       // Verifica se é ADMIN
//       if (userData.role !== "ADMIN") {
//         console.warn('❌ Usuário não é ADMIN, redirecionando...')
//         router.push("/")
//         return
//       }

//       setCurrentUser(userData)
      
//       // Preenche o clientId no formulário
//       setFormData(prev => ({
//         ...prev,
//         clientId: userData.clientId
//       }))

//     } catch (err) {
//       console.error('Erro ao carregar dados:', err)
      
//       if (err instanceof Error && err.message.includes('401')) {
//         localStorage.removeItem('token')
//         router.push('/login')
//         return
//       }
      
//       setError('Erro ao carregar dados do usuário')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const validateForm = (): boolean => {
//     const newErrors: typeof errors = {}

//     // Validação do nome
//     if (!formData.name.trim()) {
//       newErrors.name = 'Nome completo é obrigatório'
//     } else if (formData.name.trim().length < 3) {
//       newErrors.name = 'Nome deve ter pelo menos 3 caracteres'
//     }

//     // Validação do email
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     if (!formData.email) {
//       newErrors.email = 'Email é obrigatório'
//     } else if (!emailRegex.test(formData.email)) {
//       newErrors.email = 'Email inválido'
//     }

//     // Validação da confirmação de email
//     if (!formData.confirmEmail) {
//       newErrors.confirmEmail = 'Confirmação de email é obrigatória'
//     } else if (formData.email !== formData.confirmEmail) {
//       newErrors.confirmEmail = 'Os emails não coincidem'
//     }

//     // Validação da senha
//     if (!formData.password) {
//       newErrors.password = 'Senha é obrigatória'
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'A senha deve ter pelo menos 6 caracteres'
//     }

//     // Validação da confirmação de senha
//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = 'Confirmação de senha é obrigatória'
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'As senhas não coincidem'
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   // Função para validar email com debounce
//   const validateEmailDebounce = useCallback(() => {
//     if (emailTimeoutRef.current) {
//       clearTimeout(emailTimeoutRef.current)
//     }

//     emailTimeoutRef.current = setTimeout(() => {
//       const currentData = formDataRef.current
      
//       // Verifica se ambos os campos têm valor
//       if (currentData.email && currentData.confirmEmail) {
//         if (currentData.email !== currentData.confirmEmail) {
//           setErrors(prev => ({
//             ...prev,
//             confirmEmail: 'Os emails não coincidem'
//           }))
//         } else {
//           // Remove o erro quando os emails coincidem
//           setErrors(prev => ({
//             ...prev,
//             confirmEmail: undefined
//           }))
//         }
//       }
//     }, 1500) // Aumentei para 1500ms (1.5 segundos)
//   }, [])

//   // Função para validar senha com debounce
//   const validatePasswordDebounce = useCallback(() => {
//     if (passwordTimeoutRef.current) {
//       clearTimeout(passwordTimeoutRef.current)
//     }

//     passwordTimeoutRef.current = setTimeout(() => {
//       const currentData = formDataRef.current
      
//       // Verifica se ambos os campos têm valor
//       if (currentData.password && currentData.confirmPassword) {
//         if (currentData.password !== currentData.confirmPassword) {
//           setErrors(prev => ({
//             ...prev,
//             confirmPassword: 'As senhas não coincidem'
//           }))
//         } else {
//           // Remove o erro quando as senhas coincidem
//           setErrors(prev => ({
//             ...prev,
//             confirmPassword: undefined
//           }))
//         }
//       }
//     }, 1500) // Aumentei para 1500ms (1.5 segundos)
//   }, [])

//   // Função para validar email quando o usuário sai do campo
//   const validateEmailOnBlur = useCallback(() => {
//     // Cancela o timeout pendente
//     if (emailTimeoutRef.current) {
//       clearTimeout(emailTimeoutRef.current)
//       emailTimeoutRef.current = null
//     }
    
//     const currentData = formDataRef.current
    
//     // Verifica se ambos os campos têm valor
//     if (currentData.email && currentData.confirmEmail) {
//       if (currentData.email !== currentData.confirmEmail) {
//         setErrors(prev => ({
//           ...prev,
//           confirmEmail: 'Os emails não coincidem'
//         }))
//       } else {
//         setErrors(prev => ({
//           ...prev,
//           confirmEmail: undefined
//         }))
//       }
//     }
//   }, [])

//   // Função para validar senha quando o usuário sai do campo
//   const validatePasswordOnBlur = useCallback(() => {
//     // Cancela o timeout pendente
//     if (passwordTimeoutRef.current) {
//       clearTimeout(passwordTimeoutRef.current)
//       passwordTimeoutRef.current = null
//     }
    
//     const currentData = formDataRef.current
    
//     // Verifica se ambos os campos têm valor
//     if (currentData.password && currentData.confirmPassword) {
//       if (currentData.password !== currentData.confirmPassword) {
//         setErrors(prev => ({
//           ...prev,
//           confirmPassword: 'As senhas não coincidem'
//         }))
//       } else {
//         setErrors(prev => ({
//           ...prev,
//           confirmPassword: undefined
//         }))
//       }
//     }
//   }, [])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (!validateForm()) {
//       return
//     }

//     try {
//       setSaving(true)
//       setError(null)
//       setSuccess(null)

//       console.log('📝 Criando novo usuário...', formData)
      
//       // Prepara os dados para criação do usuário
//       const userData: CreateUserRequest = {
//         name: formData.name.trim(),
//         email: formData.email.trim(),
//         role: formData.role,
//         password: formData.password,
//         clientId: formData.clientId
//       }

//       // Chamada real da API para criar o usuário
//       await apiService.createUser(userData)
      
//       // Mensagem de sucesso
//       setSuccess(`Usuário "${formData.name}" criado com sucesso!`)
      
//       // Limpa todos os campos do formulário
//       setFormData({
//         name: "",
//         email: "",
//         confirmEmail: "",
//         role: "USER" as UserType,
//         password: "",
//         confirmPassword: "",
//         clientId: formData.clientId // Mantém o clientId
//       })
      
//       // Limpa os erros
//       setErrors({})

//     } catch (err: any) {
//       console.error('Erro ao criar usuário:', err)
      
//       let errorMessage = 'Erro ao criar usuário. Tente novamente.'
      
//       if (err instanceof Error) {
//         if (err.message.includes('409')) {
//           errorMessage = 'Este email já está em uso por outro usuário.'
//         } else if (err.message.includes('400')) {
//           errorMessage = 'Dados inválidos. Verifique as informações.'
//         } else if (err.message.includes('401')) {
//           errorMessage = 'Sem permissão para criar usuários.'
//         }
//       }
      
//       setError(errorMessage)
//     } finally {
//       setSaving(false)
//     }
//   }

//   const handleInputChange = (field: keyof typeof formData, value: string) => {
//     setFormData(prev => {
//       const updated = {
//         ...prev,
//         [field]: value
//       }
      
//       // Atualiza a ref imediatamente
//       formDataRef.current = updated
//       return updated
//     })
    
//     // Limpa o erro do campo quando o usuário começa a digitar
//     if (errors[field as keyof typeof errors]) {
//       setErrors(prev => ({
//         ...prev,
//         [field]: undefined
//       }))
//     }

//     // Dispara validação com debounce para emails
//     if (field === 'email' || field === 'confirmEmail') {
//       validateEmailDebounce()
//     }

//     // Dispara validação com debounce para senhas
//     if (field === 'password' || field === 'confirmPassword') {
//       validatePasswordDebounce()
//     }
//   }

//   const clearMessages = () => {
//     setError(null)
//     setSuccess(null)
//   }

//   if (error && !loading) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center bg-background">
//         <div className="text-center max-w-md">
//           <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
//             <User className="h-6 w-6 text-destructive" />
//           </div>
//           <h3 className="text-lg font-semibold text-foreground mb-2">Erro ao carregar</h3>
//           <p className="text-muted-foreground mb-4">{error}</p>
//           <div className="flex gap-3 justify-center">
//             <Button 
//               onClick={loadCurrentUser}
//               className="bg-purple-600 hover:bg-purple-700"
//             >
//               Tentar Novamente
//             </Button>
//             <Button 
//               variant="outline"
//               onClick={() => router.push('/admin')}
//             >
//               Voltar
//             </Button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (loading) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center bg-background">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
//           <p className="mt-4 text-muted-foreground">Carregando...</p>
//         </div>
//       </div>
//     )
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
//                 onClick={() => router.push("/admin")}
//                 className="h-8 w-8"
//               >
//                 <ArrowLeft className="h-4 w-4" />
//               </Button>
//               <div className="flex items-center gap-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 text-white">
//                   <UserPlus className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <h1 className="text-2xl font-bold text-card-foreground">Cadastrar Novo Usuário</h1>
//                   <p className="text-sm text-muted-foreground">
//                     Crie uma nova conta de usuário no sistema
//                   </p>
//                 </div>
//               </div>
//             </div>
//             {/* Botão removido do header conforme solicitado */}
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto px-6 py-8">
//         <div className="max-w-2xl mx-auto">
//           {/* Container das mensagens com ref para scroll */}
//           <div ref={messagesRef} className="mb-6">
//             {/* Mensagens de Feedback */}
//             {success && (
//               <div className="bg-green-50 border border-green-200 rounded-lg p-4 dark:bg-green-900/20 dark:border-green-800 mb-4">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2 text-green-800 dark:text-green-300">
//                     <CheckCircle className="h-5 w-5" />
//                     <span className="font-medium">{success}</span>
//                   </div>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={clearMessages}
//                     className="h-6 w-6 text-green-800 hover:text-green-900"
//                   >
//                     <XCircle className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             )}

//             {error && (
//               <div className="bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-900/20 dark:border-red-800 mb-4">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2 text-red-800 dark:text-red-300">
//                     <XCircle className="h-5 w-5" />
//                     <span className="font-medium">{error}</span>
//                   </div>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={clearMessages}
//                     className="h-6 w-6 text-red-800 hover:text-red-900"
//                   >
//                     <XCircle className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </div>

//           <Card>
//             <CardHeader>
//               <CardTitle>Informações do Usuário</CardTitle>
//               <CardDescription>
//                 Preencha os dados para criar uma nova conta de usuário
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Nome Completo */}
//                 <div className="space-y-2">
//                   <Label htmlFor="name">
//                     <div className="flex items-center gap-2">
//                       <User className="h-4 w-4" />
//                       Nome Completo *
//                     </div>
//                   </Label>
//                   <Input
//                     id="name"
//                     value={formData.name}
//                     onChange={(e) => handleInputChange('name', e.target.value)}
//                     placeholder="Digite o nome completo"
//                     className={errors.name ? "border-red-500" : ""}
//                   />
//                   {errors.name && (
//                     <p className="text-sm text-red-500">{errors.name}</p>
//                   )}
//                 </div>

//                 {/* Email e Confirmação de Email */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="email">
//                       <div className="flex items-center gap-2">
//                         <Mail className="h-4 w-4" />
//                         Email *
//                       </div>
//                     </Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={formData.email}
//                       onChange={(e) => handleInputChange('email', e.target.value)}
//                       onBlur={validateEmailOnBlur}
//                       placeholder="usuario@empresa.com"
//                       className={errors.email ? "border-red-500" : ""}
//                     />
//                     {errors.email && (
//                       <p className="text-sm text-red-500">{errors.email}</p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="confirmEmail">
//                       <div className="flex items-center gap-2">
//                         <Mail className="h-4 w-4" />
//                         Confirmar Email *
//                       </div>
//                     </Label>
//                     <Input
//                       id="confirmEmail"
//                       type="email"
//                       value={formData.confirmEmail}
//                       onChange={(e) => handleInputChange('confirmEmail', e.target.value)}
//                       onBlur={validateEmailOnBlur}
//                       placeholder="Confirme o email"
//                       className={errors.confirmEmail ? "border-red-500" : ""}
//                     />
//                     {errors.confirmEmail && (
//                       <p className="text-sm text-red-500">{errors.confirmEmail}</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Função */}
//                 <div className="space-y-2">
//                   <Label htmlFor="role">
//                     <div className="flex items-center gap-2">
//                       <Shield className="h-4 w-4" />
//                       Função *
//                     </div>
//                   </Label>
//                   <Select 
//                     value={formData.role} 
//                     onValueChange={(value: UserType) => handleInputChange('role', value)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="USER">Usuário</SelectItem>
//                       <SelectItem value="MANAGER">Gerente</SelectItem>
//                       <SelectItem value="ADMIN">Administrador</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Senha e Confirmação de Senha */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="password">
//                       <div className="flex items-center gap-2">
//                         <Key className="h-4 w-4" />
//                         Senha *
//                       </div>
//                     </Label>
//                     <div className="relative">
//                       <Input
//                         id="password"
//                         type={showPassword ? "text" : "password"}
//                         value={formData.password}
//                         onChange={(e) => handleInputChange('password', e.target.value)}
//                         onBlur={validatePasswordOnBlur}
//                         placeholder="Digite a senha"
//                         className={errors.password ? "border-red-500" : ""}
//                       />
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                         onClick={() => setShowPassword(!showPassword)}
//                       >
//                         {showPassword ? (
//                           <EyeOff className="h-4 w-4" />
//                         ) : (
//                           <Eye className="h-4 w-4" />
//                         )}
//                       </Button>
//                     </div>
//                     {errors.password && (
//                       <p className="text-sm text-red-500">{errors.password}</p>
//                     )}
//                     <p className="text-xs text-muted-foreground">
//                       A senha deve ter pelo menos 6 caracteres
//                     </p>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="confirmPassword">
//                       <div className="flex items-center gap-2">
//                         <Key className="h-4 w-4" />
//                         Confirmar Senha *
//                       </div>
//                     </Label>
//                     <div className="relative">
//                       <Input
//                         id="confirmPassword"
//                         type={showConfirmPassword ? "text" : "password"}
//                         value={formData.confirmPassword}
//                         onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
//                         onBlur={validatePasswordOnBlur}
//                         placeholder="Confirme a senha"
//                         className={errors.confirmPassword ? "border-red-500" : ""}
//                       />
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                       >
//                         {showConfirmPassword ? (
//                           <EyeOff className="h-4 w-4" />
//                         ) : (
//                           <Eye className="h-4 w-4" />
//                         )}
//                       </Button>
//                     </div>
//                     {errors.confirmPassword && (
//                       <p className="text-sm text-red-500">{errors.confirmPassword}</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Informações da Empresa (somente leitura) */}
//                 {currentUser && (
//                   <div className="space-y-4 pt-4 border-t">
//                     <div className="space-y-2">
//                       <Label>Empresa Vinculada</Label>
//                       <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
//                         <p className="font-medium">{currentUser.clientName}</p>
//                         <p className="text-xs mt-1">ID da Empresa: {currentUser.clientId}</p>
//                         <p className="text-xs text-muted-foreground/70 mt-2">
//                           O novo usuário será criado nesta empresa automaticamente
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Ações do Formulário */}
//                 <div className="flex justify-between items-center pt-6">
//                   <Button
//                     variant="outline"
//                     type="button"
//                     onClick={() => router.push('/admin')}
//                   >
//                     <ArrowLeft className="h-4 w-4 mr-2" />
//                     Cancelar
//                   </Button>
                  
//                   <div className="flex gap-3">
//                     <Button
//                       variant="outline"
//                       type="button"
//                       onClick={() => {
//                         // Limpar formulário
//                         setFormData({
//                           name: "",
//                           email: "",
//                           confirmEmail: "",
//                           role: "USER" as UserType,
//                           password: "",
//                           confirmPassword: "",
//                           clientId: formData.clientId
//                         })
//                         setErrors({})
//                         clearMessages()
//                       }}
//                     >
//                       Limpar Formulário
//                     </Button>
//                     <Button 
//                       type="submit"
//                       disabled={saving}
//                       className="bg-purple-600 hover:bg-purple-700"
//                     >
//                       <Save className="h-4 w-4 mr-2" />
//                       {saving ? "Cadastrando..." : "Cadastrar Usuário"}
//                     </Button>
//                   </div>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>

//           {/* Informações Importantes */}
//           <div className="mt-6 grid gap-4">
//             <Card>
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-sm">Informações Importantes</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-2">
//                 <ul className="space-y-2 text-sm text-muted-foreground">
//                   <li className="flex items-start gap-2">
//                     <div className="h-1.5 w-1.5 rounded-full bg-purple-600 mt-1.5"></div>
//                     <span>O novo usuário receberá um email com as credenciais de acesso (se configurado)</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <div className="h-1.5 w-1.5 rounded-full bg-purple-600 mt-1.5"></div>
//                     <span>Usuários com função "Administrador" terão acesso total ao sistema</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <div className="h-1.5 w-1.5 rounded-full bg-purple-600 mt-1.5"></div>
//                     <span>Certifique-se de que o email informado é válido e acessível pelo usuário</span>
//                   </li>
//                 </ul>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }


// app/admin/users/new/page.tsx
"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ArrowLeft, 
  Save, 
  User,
  Mail,
  Shield,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  UserPlus
} from "lucide-react"
import { apiService } from "@/services/api"
import type { User as Users, UserType } from "@/app/page"

// Interface para os dados de criação do usuário
export interface CreateUserRequest {
  name: string
  email: string
  role: UserType
  password: string
  clientId: string
}

interface CreateUserFormData {
  name: string
  email: string
  confirmEmail: string
  role: UserType
  password: string
  confirmPassword: string
  clientId: string
}

export default function NewUserPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<Users | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Estado unificado para mostrar/esconder ambas as senhas
  const [showPasswords, setShowPasswords] = useState(false)
  
  // Refs para os valores atuais e timeouts
  const formDataRef = useRef<CreateUserFormData>({
    name: "",
    email: "",
    confirmEmail: "",
    role: "USER" as UserType,
    password: "",
    confirmPassword: "",
    clientId: ""
  })
  
  const emailTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const passwordTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Refs para scroll
  const messagesRef = useRef<HTMLDivElement>(null)

  // Estado do formulário
  const [formData, setFormData] = useState<CreateUserFormData>({
    name: "",
    email: "",
    confirmEmail: "",
    role: "USER" as UserType,
    password: "",
    confirmPassword: "",
    clientId: ""
  })

  // Estado de validação
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    confirmEmail?: string
    role?: string
    password?: string
    confirmPassword?: string
  }>({})

  // Atualiza a ref quando o estado muda
  useEffect(() => {
    formDataRef.current = formData
  }, [formData])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    loadCurrentUser()
  }, [router])

  // Efeito para fazer scroll até as mensagens quando houver sucesso OU erro
  useEffect(() => {
    if ((success || error) && messagesRef.current) {
      setTimeout(() => {
        messagesRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
      }, 100)
    }
  }, [success, error])

  // Cleanup dos timeouts
  useEffect(() => {
    return () => {
      if (emailTimeoutRef.current) {
        clearTimeout(emailTimeoutRef.current)
      }
      if (passwordTimeoutRef.current) {
        clearTimeout(passwordTimeoutRef.current)
      }
    }
  }, [])

  const loadCurrentUser = async () => {
    try {
      setLoading(true)
      setError(null)
      
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
      
      // Preenche o clientId no formulário
      setFormData(prev => ({
        ...prev,
        clientId: userData.clientId
      }))

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

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    // Validação do nome
    if (!formData.name.trim()) {
      newErrors.name = 'Nome completo é obrigatório'
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres'
    }

    // Validação do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    // Validação da confirmação de email
    if (!formData.confirmEmail) {
      newErrors.confirmEmail = 'Confirmação de email é obrigatória'
    } else if (formData.email !== formData.confirmEmail) {
      newErrors.confirmEmail = 'Os emails não coincidem'
    }

    // Validação da senha
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres'
    }

    // Validação da confirmação de senha
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Função para validar email com debounce
  const validateEmailDebounce = useCallback(() => {
    if (emailTimeoutRef.current) {
      clearTimeout(emailTimeoutRef.current)
    }

    emailTimeoutRef.current = setTimeout(() => {
      const currentData = formDataRef.current
      
      // Verifica se ambos os campos têm valor
      if (currentData.email && currentData.confirmEmail) {
        if (currentData.email !== currentData.confirmEmail) {
          setErrors(prev => ({
            ...prev,
            confirmEmail: 'Os emails não coincidem'
          }))
        } else {
          // Remove o erro quando os emails coincidem
          setErrors(prev => ({
            ...prev,
            confirmEmail: undefined
          }))
        }
      }
    }, 1500) // Aumentei para 1500ms (1.5 segundos)
  }, [])

  // Função para validar senha com debounce
  const validatePasswordDebounce = useCallback(() => {
    if (passwordTimeoutRef.current) {
      clearTimeout(passwordTimeoutRef.current)
    }

    passwordTimeoutRef.current = setTimeout(() => {
      const currentData = formDataRef.current
      
      // Verifica se ambos os campos têm valor
      if (currentData.password && currentData.confirmPassword) {
        if (currentData.password !== currentData.confirmPassword) {
          setErrors(prev => ({
            ...prev,
            confirmPassword: 'As senhas não coincidem'
          }))
        } else {
          // Remove o erro quando as senhas coincidem
          setErrors(prev => ({
            ...prev,
            confirmPassword: undefined
          }))
        }
      }
    }, 1500) // Aumentei para 1500ms (1.5 segundos)
  }, [])

  // Função para validar email quando o usuário sai do campo
  const validateEmailOnBlur = useCallback(() => {
    // Cancela o timeout pendente
    if (emailTimeoutRef.current) {
      clearTimeout(emailTimeoutRef.current)
      emailTimeoutRef.current = null
    }
    
    const currentData = formDataRef.current
    
    // Verifica se ambos os campos têm valor
    if (currentData.email && currentData.confirmEmail) {
      if (currentData.email !== currentData.confirmEmail) {
        setErrors(prev => ({
          ...prev,
          confirmEmail: 'Os emails não coincidem'
        }))
      } else {
        setErrors(prev => ({
          ...prev,
          confirmEmail: undefined
        }))
      }
    }
  }, [])

  // Função para validar senha quando o usuário sai do campo
  const validatePasswordOnBlur = useCallback(() => {
    // Cancela o timeout pendente
    if (passwordTimeoutRef.current) {
      clearTimeout(passwordTimeoutRef.current)
      passwordTimeoutRef.current = null
    }
    
    const currentData = formDataRef.current
    
    // Verifica se ambos os campos têm valor
    if (currentData.password && currentData.confirmPassword) {
      if (currentData.password !== currentData.confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'As senhas não coincidem'
        }))
      } else {
        setErrors(prev => ({
          ...prev,
          confirmPassword: undefined
        }))
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      console.log('📝 Criando novo usuário...', formData)
      
      // Prepara os dados para criação do usuário
      const userData: CreateUserRequest = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        password: formData.password,
        clientId: formData.clientId
      }

      // Chamada real da API para criar o usuário
      await apiService.createUser(userData)
      
      // Mensagem de sucesso
      setSuccess(`Usuário "${formData.name}" criado com sucesso!`)
      
      // Limpa todos os campos do formulário
      setFormData({
        name: "",
        email: "",
        confirmEmail: "",
        role: "USER" as UserType,
        password: "",
        confirmPassword: "",
        clientId: formData.clientId // Mantém o clientId
      })
      
      // Limpa os erros
      setErrors({})

    } catch (err: any) {
      console.error('Erro ao criar usuário:', err)
      
      let errorMessage = 'Erro ao criar usuário. Tente novamente.'
      
      if (err instanceof Error) {
        if (err.message.includes('409')) {
          errorMessage = 'Este email já está em uso por outro usuário.'
        } else if (err.message.includes('400')) {
          errorMessage = 'Dados inválidos. Verifique as informações.'
        } else if (err.message.includes('401')) {
          errorMessage = 'Sem permissão para criar usuários.'
        }
      }
      
      setError(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: value
      }
      
      // Atualiza a ref imediatamente
      formDataRef.current = updated
      return updated
    })
    
    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }

    // Dispara validação com debounce para emails
    if (field === 'email' || field === 'confirmEmail') {
      validateEmailDebounce()
    }

    // Dispara validação com debounce para senhas
    if (field === 'password' || field === 'confirmPassword') {
      validatePasswordDebounce()
    }
  }

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  // Função para alternar a visibilidade das senhas
  const toggleShowPasswords = () => {
    setShowPasswords(!showPasswords)
  }

  if (error && !loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <User className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Erro ao carregar</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={loadCurrentUser}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Tentar Novamente
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/admin')}
            >
              Voltar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
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
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-card-foreground">Cadastrar Novo Usuário</h1>
                  <p className="text-sm text-muted-foreground">
                    Crie uma nova conta de usuário no sistema
                  </p>
                </div>
              </div>
            </div>
            {/* Botão removido do header conforme solicitado */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Container das mensagens com ref para scroll */}
          <div ref={messagesRef} className="mb-6">
            {/* Mensagens de Feedback */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 dark:bg-green-900/20 dark:border-green-800 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-300">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">{success}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearMessages}
                    className="h-6 w-6 text-green-800 hover:text-green-900"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-900/20 dark:border-red-800 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-red-800 dark:text-red-300">
                    <XCircle className="h-5 w-5" />
                    <span className="font-medium">{error}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearMessages}
                    className="h-6 w-6 text-red-800 hover:text-red-900"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações do Usuário</CardTitle>
              <CardDescription>
                Preencha os dados para criar uma nova conta de usuário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome Completo */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Nome Completo *
                    </div>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Digite o nome completo"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Email e Confirmação de Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email *
                      </div>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onBlur={validateEmailOnBlur}
                      placeholder="usuario@empresa.com"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmEmail">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Confirmar Email *
                      </div>
                    </Label>
                    <Input
                      id="confirmEmail"
                      type="email"
                      value={formData.confirmEmail}
                      onChange={(e) => handleInputChange('confirmEmail', e.target.value)}
                      onBlur={validateEmailOnBlur}
                      placeholder="Confirme o email"
                      className={errors.confirmEmail ? "border-red-500" : ""}
                    />
                    {errors.confirmEmail && (
                      <p className="text-sm text-red-500">{errors.confirmEmail}</p>
                    )}
                  </div>
                </div>

                {/* Função */}
                <div className="space-y-2">
                  <Label htmlFor="role">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Função *
                    </div>
                  </Label>
                  <Select 
                    value={formData.role} 
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

                {/* Senha e Confirmação de Senha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        Senha *
                      </div>
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPasswords ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        onBlur={validatePasswordOnBlur}
                        placeholder="Digite a senha"
                        className={errors.password ? "border-red-500" : ""}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={toggleShowPasswords}
                      >
                        {showPasswords ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      A senha deve ter pelo menos 6 caracteres
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        Confirmar Senha *
                      </div>
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPasswords ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        onBlur={validatePasswordOnBlur}
                        placeholder="Confirme a senha"
                        className={errors.confirmPassword ? "border-red-500" : ""}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={toggleShowPasswords}
                      >
                        {showPasswords ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Informações da Empresa (somente leitura) */}
                {currentUser && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label>Empresa Vinculada</Label>
                      <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                        <p className="font-medium">{currentUser.clientName}</p>
                        <p className="text-xs mt-1">ID da Empresa: {currentUser.clientId}</p>
                        <p className="text-xs text-muted-foreground/70 mt-2">
                          O novo usuário será criado nesta empresa automaticamente
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ações do Formulário */}
                <div className="flex justify-between items-center pt-6">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => router.push('/admin')}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => {
                        // Limpar formulário
                        setFormData({
                          name: "",
                          email: "",
                          confirmEmail: "",
                          role: "USER" as UserType,
                          password: "",
                          confirmPassword: "",
                          clientId: formData.clientId
                        })
                        setErrors({})
                        clearMessages()
                      }}
                    >
                      Limpar Formulário
                    </Button>
                    <Button 
                      type="submit"
                      disabled={saving}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Cadastrando..." : "Cadastrar Usuário"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Informações Importantes */}
          <div className="mt-6 grid gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Informações Importantes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-600 mt-1.5"></div>
                    <span>O novo usuário receberá um email com as credenciais de acesso (se configurado)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-600 mt-1.5"></div>
                    <span>Usuários com função "Administrador" terão acesso total ao sistema</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-600 mt-1.5"></div>
                    <span>Certifique-se de que o email informado é válido e acessível pelo usuário</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}