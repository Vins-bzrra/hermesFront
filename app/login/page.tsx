"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/services/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Usa o apiService para fazer login - agora tipado corretamente
      const response = await apiService.login({ email, password });
      
      // Agora response.data é do tipo { token: string; user?: User }
      const {token} = response.data;
      
      // Verifica se o token existe na resposta
      if (!token) {
        throw new Error("Token não recebido do servidor");
      }
      
      // Armazena o token JWT retornado pela API
      localStorage.setItem("token", token);

      // Redireciona para a Home
      router.push("/");

    } catch (err) {
      console.error("Erro no login:", err);
      
      // Limpa qualquer token existente em caso de erro
      localStorage.removeItem("token");
      
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--card-bg)]">
      <form
        onSubmit={handleLogin}
        className="bg-[var(--surface-bg)] shadow-lg rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4"
      >
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] text-center">Entrar</h1>

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 rounded-md border border-gray-300 bg-[var(--input-bg)] text-[var(--text-primary)]"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-2 rounded-md border border-gray-300 bg-[var(--input-bg)] text-[var(--text-primary)]"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-[var(--accent)] text-white py-2 rounded-md hover:opacity-90 transition"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <a
          href="/login/forgot"
          className="text-sm text-[var(--text-secondary)] text-center hover:underline"
        >
          Esqueceu a senha?
        </a>
      </form>
    </div>
  );
}
