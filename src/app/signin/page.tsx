"use client";
import { signIn } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const [showLyra, setShowLyra] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      console.error("SignIn Error:", error);
    }
  }, [searchParams]);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => setShowLyra(true), 3000);
  };
  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowLyra(false);
  };

  const handleSignIn = async () => {
    console.log("Initiating Google Sign In...");
    try {
      const callbackUrl = searchParams.get("callbackUrl") || "https://airtable-clone-alpha-six.vercel.app/";
      console.log("Using callback URL:", callbackUrl);
      
      const result = await signIn("google", { 
        callbackUrl,
        redirect: true,
      });
      console.log("Sign In Result:", result);
    } catch (error) {
      console.error("Sign In Error:", error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#111112",
        color: "#fff",
      }}
    >
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1
          style={{
            fontFamily: "'Montserrat', 'Futura', 'Arial Black', Arial, sans-serif",
            fontSize: "4rem",
            fontWeight: 900,
            letterSpacing: 2,
            textShadow: "0 4px 32px rgba(0,0,0,0.4)",
            marginBottom: showLyra ? "1.5rem" : "2.5rem",
            textAlign: "center",
            cursor: "pointer",
            transition: "margin-bottom 0.3s",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Airtable Clone
        </h1>
        {showLyra && (
          <span
            style={{
              fontFamily: "'Montserrat', 'Futura', 'Arial Black', Arial, sans-serif",
              fontSize: "2.2rem",
              fontWeight: 700,
              color: "#fff",
              textShadow: "0 0 16px #00eaff, 0 0 32px #00eaff, 0 0 48px #00eaff",
              letterSpacing: 1,
              animation: "lyra-glow 1.5s infinite alternate",
              marginBottom: "1.5rem",
              transition: "opacity 0.3s",
            }}
          >
            Lyra Trial
          </span>
        )}
      </div>
      <button
        onClick={handleSignIn}
        style={{
          background: "#fff",
          color: "#111112",
          border: "none",
          borderRadius: 10,
          padding: "1.1rem 2.8rem",
          fontSize: "1.3rem",
          fontWeight: 700,
          boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
          cursor: "pointer",
          transition: "background 0.2s, color 0.2s",
          marginTop: "1.5rem",
        }}
      >
        Sign in with Google
      </button>
      <style>{`
        @keyframes lyra-glow {
          from { text-shadow: 0 0 16px #00eaff, 0 0 32px #00eaff, 0 0 48px #00eaff; }
          to { text-shadow: 0 0 32px #00eaff, 0 0 64px #00eaff, 0 0 96px #00eaff; }
        }
      `}</style>
    </div>
  );
} 