import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔐 LOGIN FUNCTION
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.success) {
        alert("Login Successful ✅");
        localStorage.setItem("adminToken", data.token);
        navigate("/admin-panel");
      } else {
        alert(data.message || "Login failed ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 FORGOT PASSWORD
  const handleForgotPassword = async () => {
    if (!form.email) {
      return alert("Enter email first");
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: form.email })
      });

      const data = await res.json();
      alert(data.message || "Reset link sent (check backend console)");
    } catch (err) {
      alert("Error sending reset link");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-950">
      
      <div className="w-full max-w-md p-8 bg-gray-900 border border-gray-800 shadow-xl rounded-2xl">

        {/* Title */}
        <h2 className="mb-6 text-2xl font-bold text-center text-white">
          Admin Login 🔐
        </h2>

        <form onSubmit={handleLogin}>
          
          {/* Email */}
          <div className="mb-4">
            <label className="block mb-1 text-sm text-gray-400">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              required
              className="w-full px-4 py-3 text-white placeholder-gray-500 transition-all bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-transparent"
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="block mb-1 text-sm text-gray-400">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="w-full px-4 py-3 text-white placeholder-gray-500 transition-all bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-transparent"
            />
          </div>

          {/* Forgot Password */}
          <div className="mb-5 text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-crimson-400 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-white transition-all rounded-xl bg-crimson-600 hover:bg-crimson-700"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Footer */}
        <p className="mt-6 text-xs text-center text-gray-500">
          Helping Hands Admin Panel
        </p>

      </div>
    </div>
  );
}