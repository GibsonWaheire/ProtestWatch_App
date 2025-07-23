import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Login({ setAlertMsg }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) navigate("/");
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setAlertMsg && setAlertMsg("Login successful!");
      navigate("/");
    } catch (error) {
      setAlertMsg && setAlertMsg(error.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-6 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Login</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="Password" />
      <button type="submit" className="btn">Login</button>
    </form>
  );
}

export default Login;
