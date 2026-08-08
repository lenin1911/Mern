import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./Login";
import Dashboard from "./Dashboard";
import "./App.css";

function App() {
  const [user, setUser] = useState(undefined); // undefined = still loading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, []);

  // Loading state while Firebase checks session
  if (user === undefined) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fa" }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  // Logged in → Dashboard
  if (user) {
    return <Dashboard user={user} />;
  }

  // Not logged in → Marketing landing page (Login contains both login + signup modals)
  return <Login />;
}

export default App;
