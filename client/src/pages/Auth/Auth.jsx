import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { login, register } = useAuth();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await login({ email, password });
        toast.success("Login successful");
      } else {
        await register({ name, email, password, confirmPassword });
        toast.success("Account created successfully");
      }
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    backgroundColor: "#f8f9fb",
    border: "1.5px solid #e2e6ea",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#1a1d23",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    transition: "all 0.15s ease",
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f4f6f8",
      padding: "20px",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      <div style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        width: "100%",
        maxWidth: "420px",
        padding: "40px 36px",
      }}>
        {/* Logo + Title */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "52px",
            height: "52px",
            backgroundColor: "#2d5be3",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-1H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-1h7z"/>
            </svg>
          </div>

          <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#1a1d23", margin: "0 0 6px", letterSpacing: "-0.4px" }}>
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>
          <p style={{ fontSize: "13.5px", color: "#6b7280", margin: 0 }}>
            {isLogin ? "Sign in to continue to Classroom" : "Get started with Classroom"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Name — register only */}
          {!isLogin && (
            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px", letterSpacing: "0.1px" }}>
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#2d5be3"}
                onBlur={e => e.target.style.borderColor = "#e2e6ea"}
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px", letterSpacing: "0.1px" }}>
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#2d5be3"}
              onBlur={e => e.target.style.borderColor = "#e2e6ea"}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px", letterSpacing: "0.1px" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ ...inputStyle, paddingRight: "42px" }}
                onFocus={e => e.target.style.borderColor = "#2d5be3"}
                onBlur={e => e.target.style.borderColor = "#e2e6ea"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9ca3af",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#374151"}
                onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password — register only */}
          {!isLogin && (
            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#374151", marginBottom: "6px", letterSpacing: "0.1px" }}>
                Confirm Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ ...inputStyle, paddingRight: "42px" }}
                  onFocus={e => e.target.style.borderColor = "#2d5be3"}
                  onBlur={e => e.target.style.borderColor = "#e2e6ea"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#9ca3af",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "#374151"}
                  onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}
                >
                  {showConfirmPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px 0",
              backgroundColor: "#2d5be3",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              marginTop: "8px",
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2349c4"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#2d5be3"}
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Toggle link */}
        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "13.5px", color: "#6b7280" }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggleForm}
            style={{
              background: "none",
              border: "none",
              color: "#2d5be3",
              fontWeight: "600",
              cursor: "pointer",
              padding: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
            onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;