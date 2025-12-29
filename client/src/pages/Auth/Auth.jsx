import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
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
        await register({ name, email, password, confirmPassword});
        toast.success("Account created successfully");
      }
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login to Classroom" : "Create Classroom Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl"
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 pr-10 bg-gray-800 border border-gray-700 rounded-xl"
              required
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </div>
          </div>

          {/* Confirm Password */}
          {!isLogin && (
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 bg-gray-800 border border-gray-700 rounded-xl"
                required
              />
              <div
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-xl"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggleForm}
            className="text-blue-500 font-semibold hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;
