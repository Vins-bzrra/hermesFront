"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => setSent(true), 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--card-bg)]">
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--surface-bg)] shadow-lg rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4"
      >
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] text-center">
          Recuperar senha
        </h1>

        {sent ? (
          <p className="text-[var(--text-secondary)] text-center">
            Se o e-mail existir, enviamos instruções para recuperação.
          </p>
        ) : (
          <>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2 rounded-md border border-gray-300 bg-[var(--input-bg)] text-[var(--text-primary)]"
            />

            <button
              type="submit"
              className="bg-[var(--accent)] text-white py-2 rounded-md hover:opacity-90 transition"
            >
              Enviar
            </button>
          </>
        )}
      </form>
    </div>
  );
}
