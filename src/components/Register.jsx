import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Register({ setAlertMsg }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) navigate("/");
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setAlertMsg && setAlertMsg("Registration successful!");
      navigate("/");
    } catch (error) {
      setAlertMsg && setAlertMsg(error.message);
    }
  };

  return (
    <form onSubmit={handleRegister} className="p-6 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Register</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="Password" />
      <button type="submit" className="btn">Register</button>
    </form>
  );
}

export default Register;
