import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";

import { collection, getDocs } from "firebase/firestore";

import { db } from "./firebase/firebase";

import { auth } from "./firebase/firebase";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import Stitching from "./pages/Stitching";
import Summary from "./pages/Summary";
import Turpai from "./pages/Turpai";
import Ironing from "./pages/Ironing";
import Stock from "./pages/Stock";
import Advances from "./pages/Advances";
import Reports from "./pages/Reports";
import Workers from "./pages/Workers";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const querySnapshot = await getDocs(collection(db, "users"));

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          if (data.email === currentUser.email) {
            setRole(data.role);
          }
        });
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!user) {
    return <Login />;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard role={role} />} />

        {role === "owner" && (
          <Route path="/stitching" element={<Stitching />} />
        )}

        {role === "owner" && <Route path="/summary" element={<Summary />} />}

        <Route path="/turpai" element={<Turpai />} />

        <Route path="/ironing" element={<Ironing />} />

        <Route path="/stock" element={<Stock />} />

        {role === "owner" && <Route path="/advances" element={<Advances />} />}

        {role === "owner" && <Route path="/reports" element={<Reports />} />}

        <Route path="/workers" element={<Workers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
