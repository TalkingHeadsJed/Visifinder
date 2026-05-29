import { useEffect } from "react";

// Bounces every visitor at "/" to the live static VisiFinder landing page.
// (The React build is no longer the product — index.html is.)
export default function StaticRedirect({ to = "/visifinder-final.html" }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#1E3A5F",
      }}
    >
      <p>Loading VisiFinder…</p>
    </div>
  );
}
