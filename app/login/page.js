"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase/client.js";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
    }
  };

  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#1a1512",
    color: "#f8f4ec",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  };

  const formStyle = {
    backgroundColor: "#262220",
    padding: "3rem",
    borderRadius: "12px",
    border: "1px solid rgba(38, 34, 32, 0.15)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
    maxWidth: "450px",
    width: "100%",
  };

  const titleStyle = {
    fontSize: "2rem",
    fontWeight: "500",
    color: "#b8935a",
    marginBottom: "1.5rem",
    textAlign: "center",
    fontFamily: "Georgia, serif",
  };

  const inputGroupStyle = {
    marginBottom: "1.5rem",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
    color: "#5c554d",
    fontSize: "0.9rem",
    fontWeight: "500",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.875rem 1rem",
    backgroundColor: "#2a2622",
    border: "1px solid rgba(38, 34, 32, 0.3)",
    borderRadius: "6px",
    color: "#f8f4ec",
    fontSize: "1rem",
    fontFamily: "Inter, sans-serif",
    transition: "all 0.2s ease",
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.875rem",
    backgroundColor: "#b5573b",
    color: "#f8f4ec",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  const errorStyle = {
    color: "#b5573b",
    fontSize: "0.9rem",
    marginTop: "1rem",
    textAlign: "center",
  };

  const linkStyle = {
    color: "#b8935a",
    textDecoration: "none",
    fontWeight: "500",
  };

  return (
    <div style={pageStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h1 style={titleStyle}>Log In</h1>

        <div style={inputGroupStyle}>
          <label htmlFor="email" style={labelStyle}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
            placeholder="your.email@example.com"
          />
        </div>

        <div style={inputGroupStyle}>
          <label htmlFor="password" style={labelStyle}>
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={buttonStyle}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        {error && <p style={errorStyle}>{error}</p>}

        <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem" }}>
          Don't have an account?{' '}
          <a href="/signup" style={linkStyle}>Sign up</a>
        </p>
      </form>
    </div>
  );
}
