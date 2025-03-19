import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function About() {
  let navigate = useNavigate();

  useEffect(() => {
    callAboutPage();
  }, []); // ✅ Keeping dependency array empty

  const callAboutPage = async () => {
    try {
      const res = await fetch("/about", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      // ✅ Correct status check
      if (!res.ok) {
        throw new Error(data.error || "Unauthorized Access");
      }
    } catch (err) {
      console.error("Error:", err.message);
      navigate("/Loginscreen"); // ✅ Redirect user if not authenticated
    }
  };

  return (
    <div>
      <h1>About</h1>
    </div>
  );
}
