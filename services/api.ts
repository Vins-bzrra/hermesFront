import { Contact, Conversation, Message, User } from "@/app/page";

// services/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface ApiResponse<T> {
  data: T;
  status: number;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro na requisição');
    }

    return {
      data,
      status: response.status,
    };
  }

  // Auth
  async login(credentials: { email: string; password: string }) {
    return this.request<{token:string}>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Users
  async getCurrentUser() {
    return this.request<User>('/users/me');
  }

  async updateUser(userData: Partial<User>) {
    return this.request<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Conversations
  async getConversations() {
    return this.request<Conversation[]>('/conversations');
  }

  async getConversation(id: string) {
    return this.request<Conversation>(`/conversations/${id}`);
  }

  async createConversation(contactId: string) {
    return this.request<Conversation>('/conversations', {
      method: 'POST',
      body: JSON.stringify({ contactId }),
    });
  }

  // Messages
  async getMessages(conversationId: string) {
    return this.request<Message[]>(`/conversations/${conversationId}/messages`);
  }

  async sendMessage(conversationId: string, text: string) {
    return this.request<Message>(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  // Contacts
  async getContacts() {
    return this.request<Contact[]>('/contacts');
  }

  // Groups
  async createGroup(groupData: {
    name: string;
    members: Array<{ id: string; role: 'USER' | 'ADMIN' }>;
  }) {
    return this.request<Conversation>('/groups', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
  }
}

export const apiService = new ApiService();