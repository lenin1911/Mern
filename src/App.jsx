import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import "./App.css";

function App() {
  const [user, setUser] = useState(undefined); // undefined = still loading
  const [view, setView] = useState("login");

  // Firebase keeps session alive automatically — just listen for changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); // null if logged out, user object if logged in
    });
    return unsubscribe; // cleanup listener on unmount
  }, []);

  // Show nothing while Firebase checks existing session
  if (user === undefined) {
    return (
      <div className="page">
        <div className="loading-spinner" />
      </div>
    );
  }

  // Logged in → Dashboard
  if (user) {
    return <Dashboard user={user} />;
  }

  // Not logged in → Login or Signup
  return (
    <div className="page">
      <div className="bg-grid" />
      <div className="bg-glow" />
      {view === "login" ? (
        <Login onSwitch={() => setView("signup")} />
      ) : (
        <Signup onSwitch={() => setView("login")} />
      )}
    </div>
  );
}

export default App;
