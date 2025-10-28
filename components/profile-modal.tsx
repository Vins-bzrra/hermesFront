"use client"

import { useState, useRef } from "react"
import { X, Camera, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { User } from "@/app/page"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
  onSave: (user: User) => void
}

export function ProfileModal({ isOpen, onClose, user, onSave }: ProfileModalProps) {
  const [formData, setFormData] = useState(user)
  const [avatarPreview, setAvatarPreview] = useState(user.avatar)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        // Para simplicidade, vamos usar as iniciais por enquanto
        // Em uma aplicação real, você faria upload da imagem
        const newInitials = formData.name.split(' ').map(n => n[0]).join('').toUpperCase()
        setAvatarPreview(newInitials)
        setFormData(prev => ({ ...prev, avatar: newInitials }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({ ...prev, name }))
    // Atualiza as iniciais do avatar automaticamente
    const newInitials = name.split(' ').map(n => n[0]).join('').toUpperCase()
    setAvatarPreview(newInitials)
    setFormData(prev => ({ ...prev, avatar: newInitials }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-card-foreground">Editar Perfil</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Avatar Section */}
        <div className="mb-6 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-400 text-2xl font-semibold text-white">
              {avatarPreview}
            </div>
            <Button
              size="icon"
              onClick={handleAvatarClick}
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-purple-600 hover:bg-purple-700"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <p className="text-sm text-muted-foreground">Clique na câmera para alterar a foto</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Nome
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Digite seu nome"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled
              className="w-full bg-muted text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">Email não pode ser alterado</p>
          </div>

          {/* Informações não editáveis */}
          <div className="rounded-lg border border-border p-3">
            <h4 className="text-sm font-medium text-card-foreground mb-2">Informações da Conta</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo:</span>
                <span className="font-medium">{formData.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      formData.status === "online"
                        ? "bg-green-500"
                        : formData.status === "away"
                          ? "bg-yellow-500"
                          : formData.status === "busy"
                            ? "bg-red-500"
                            : "bg-gray-400"
                    }`}
                  />
                  {formData.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-purple-600 hover:bg-purple-700">
            Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  )
}