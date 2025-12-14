// import { Contact, Conversation, Message, User } from "@/app/page";

// // services/api.ts
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// interface ApiResponse<T> {
//   data: T;
//   status: number;
// }

// class ApiService {
//   private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
//     const token = localStorage.getItem('token');
    
//     const config: RequestInit = {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': token ? `Bearer ${token}` : '',
//         ...options.headers,
//       },
//       ...options,
//     };

//     const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || 'Erro na requisição');
//     }

//     return {
//       data,
//       status: response.status,
//     };
//   }

//   // Auth
//   async login(credentials: { email: string; password: string }) {
//     return this.request<{token:string}>('/auth/login', {
//       method: 'POST',
//       body: JSON.stringify(credentials),
//     });
//   }

//   // Users
//   async getCurrentUser() {
//     return this.request<User>('/users/me');
//   }

//   async getUser(id: string) {
//     return this.request<User>(`/users/${id}`);
//   }

//   async updateUser(userData: Partial<User>) {
//     return this.request<User>('/users/profile', {
//       method: 'PUT',
//       body: JSON.stringify(userData),
//     });
//   }

//   // Conversations
//   async getConversations() {
//     return this.request<Conversation[]>('/conversations');
//   }

//   async getConversation(id: string) {
//     return this.request<Conversation>(`/conversations/${id}`);
//   }

//   async createConversation(participantId: number) {
//     return this.request<Conversation>('/conversations', {
//       method: 'POST',
//       body: JSON.stringify({
//         title: '', // Pode ser vazio, será preenchido pelo backend
//         type: 'PRIVATE',
//         participants: [
//           { id: participantId, role: 'USER' } // Role é ignorada em conversas privadas
//         ]
//       }),
//     });
//   }

//   // Messages
//   async getMessages(conversationId: number) {
//     return this.request<Message[]>(`/conversations/${conversationId}/messages`);
//   }

//   async sendMessage(conversationId: number, text: string) {
//     return this.request<Message>(`/conversations/${conversationId}/messages`, {
//       method: 'POST',
//       body: JSON.stringify({ text }),
//     });
//   }

//   // Contacts
//   async getContacts(clientId: string) {
//     return this.request<Contact[]>(`/users/client/${clientId}`);
//   }

//   // Groups
//   async createGroup(groupData: {
//     title: string;
//     type: string;
//     participants: Array<{ id: number; role: 'USER' | 'ADMIN' }>;
//   }) {
//     return this.request<Conversation>('/conversations', {
//       method: 'POST',
//       body: JSON.stringify(groupData),
//     });
//   }
// }

// export const apiService = new ApiService();


import { UpdateUserRequest } from "@/app/admin/users/[id]/edit/page";
import { CreateUserRequest } from "@/app/admin/users/new/page";
import { Contact, Conversation, Message, User } from "@/app/page";

// services/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface ApiResponse<T> {
  data: T;
  status: number;
}

// Interfaces para atualização de usuário
// interface UpdateUserRequest {
//   name: string;
//   email: string;
//   role: string;
//   status: string;
//   password: string;
// }

interface UpdatePasswordRequest {
  password: string;
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
    
    // Para respostas sem conteúdo (204 No Content)
    if (response.status === 204) {
      return {
        data: {} as T,
        status: response.status,
      };
    }

    if (response.status === 201) {
      return {
        data: {} as T,
        status: response.status,
      };
    }

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
    return this.request<{token: string}>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Users
  async createUser(userData: CreateUserRequest) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request<User>('/users/me');
  }

  async getUser(id: string) {
    return this.request<User>(`/users/${id}`);
  }

  async updateUser(userData: Partial<User>) {
    return this.request<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Admin - Update user as admin
  async updateUserAsAdmin(id: string, userData: UpdateUserRequest) {
    return this.request(`/user/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Admin - Update user password
  async updateUserPassword(id: string, passwordData: UpdatePasswordRequest) {
    return this.request(`/users/${id}/password`, {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  // Conversations
  async getConversations() {
    return this.request<Conversation[]>('/conversations');
  }

  async getConversation(id: string) {
    return this.request<Conversation>(`/conversations/${id}`);
  }

  async createConversation(participantId: number) {
    return this.request<Conversation>('/conversations', {
      method: 'POST',
      body: JSON.stringify({
        title: '', // Pode ser vazio, será preenchido pelo backend
        type: 'PRIVATE',
        participants: [
          { id: participantId, role: 'USER' } // Role é ignorada em conversas privadas
        ]
      }),
    });
  }

  // Messages
  async getMessages(conversationId: number) {
    return this.request<Message[]>(`/conversations/${conversationId}/messages`);
  }

  async sendMessage(conversationId: number, text: string) {
    return this.request<Message>(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  // Contacts
  async getContacts(clientId: string) {
    return this.request<Contact[]>(`/users/client/${clientId}`);
  }

  // Groups
  async createGroup(groupData: {
    title: string;
    type: string;
    participants: Array<{ id: number; role: 'USER' | 'ADMIN' }>;
  }) {
    return this.request<Conversation>('/conversations', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
  }
}

export const apiService = new ApiService();