import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // ✅ Corrigido: era "hanleEmail" (typo), agora "handleEmail"
  const handleEmail = async () => {
    if (!email || !password) return;
    setLoading(true);
    setMessage(null);

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else if (isSignUp) {
      setMessage({
        type: "success",
        text: "Confirme seu email para continuar!",
      });
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://dynamic-habits.vercel.app",
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          {/* ✅ Corrigido: aspas fechadas corretamente em Bebas_Neue' */}
          <span className="font-['Bebas_Neue'] text-5xl text-white tracking-widest">
            DYNAMIC
          </span>
          <span className="font-['Bebas_Neue'] text-5xl text-[#ff6b35] tracking-widest">
            HABITS
          </span>
          <p className="text-[#333] text-xs font-mono mt-2 tracking-widest">
            SEUS HÁBITOS. QUALQUER DISPOSITIVO.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-6">
          <h2 className="text-[#888] text-sm font-mono tracking-widest mb-6 text-center">
            {isSignUp ? "CRIAR CONTA" : "ENTRAR"}
          </h2>

          {/* Botão Google */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold text-sm py-3 rounded-xl mb-4 hover:bg-gray-100 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
            Continuar com Google
          </button>

          {/* Divisor */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#1e1e1e]" />
            <span className="text-[#333] text-xs font-mono">OU</span>
            <div className="flex-1 h-px bg-[#1e1e1e]" />
          </div>

          {/* Campos */}
          <div className="flex flex-col gap-3 mb-4">
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-sm text-[#ccc] outline-none focus:border-[#444] transition-colors placeholder:text-[#333]"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEmail()}
              className="bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-sm text-[#ccc] outline-none focus:border-[#444] transition-colors placeholder:text-[#333]"
            />
          </div>

          {/* Mensagem erro/sucesso */}
          {message && (
            <div
              className={`text-xs font-mono px-3 py-2 rounded-lg mb-4 ${
                message.type === "error"
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "bg-green-500/10 text-green-400 border border-green-500/20"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Botão entrar/criar */}
          <button
            onClick={handleEmail}
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-black transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{ background: "#ff6b35" }}
          >
            {loading ? "Aguarde..." : isSignUp ? "Criar conta" : "Entrar"}
          </button>

          {/* Alternar modo */}
          <button
            onClick={() => {
              setIsSignUp((o) => !o);
              setMessage(null);
            }}
            className="w-full mt-4 text-xs text-[#333] hover:text-[#555] transition-colors font-mono"
          >
            {isSignUp ? "Já tem conta? Entrar" : "Não tem conta? Criar agora"}
          </button>
        </div>
      </div>
    </div>
  );
}