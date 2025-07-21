"use client";
import { signIn } from "next-auth/react";

export default function SignInPage() {
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
      <h1
        style={{
          fontFamily: "'Montserrat', 'Futura', 'Arial Black', Arial, sans-serif",
          fontSize: "4rem",
          fontWeight: 900,
          letterSpacing: 2,
          textShadow: "0 4px 32px rgba(0,0,0,0.4)",
          marginBottom: "2.5rem",
          textAlign: "center",
        }}
      >
        Airtable Clone
      </h1>
      <button
        onClick={() => signIn("google")}
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
    </div>
  );
} 