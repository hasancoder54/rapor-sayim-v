import { useState } from "react";

export default function Home() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const correctPassword = "A1B2C3TA";

  async function fetchMembers() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/members");
      if (!res.ok) throw new Error("Veri alınamadı.");
      const data = await res.json();
      setMembers(data.members);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (password === correctPassword) {
      setAuthorized(true);
      fetchMembers();
    } else {
      setError("Şifre yanlış!");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #00111f, #003366)",
      color: "white",
      fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: 20,
    }}>
      <h1 style={{marginBottom: 20}}>TA | Turkish Armed Forces</h1>
      {!authorized ? (
        <form onSubmit={handleSubmit} style={{display:"flex", flexDirection:"column", gap:"10px", maxWidth:"300px", width:"100%"}}>
          <input
            type="password"
            placeholder="Şifreyi giriniz"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{padding: "10px", borderRadius: "10px", border: "none"}}
          />
          <button type="submit" style={{
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#004080",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer"
          }}>Giriş Yap</button>
          {error && <p style={{color:"red"}}>{error}</p>}
        </form>
      ) : (
        <div style={{width:"100%", maxWidth:"900px"}}>
          <h2>Asteğmen Rolündeki Üyeler (Maks 300 kişi)</h2>
          {loading && <p>Yükleniyor...</p>}
          {error && <p style={{color:"red"}}>{error}</p>}
          <div style={{display:"flex", flexWrap:"wrap", gap:"15px", marginTop:"15px"}}>
            {members.length === 0 && !loading && <p>Üye bulunamadı veya rol boş.</p>}
            {members.map((m) => (
              <div key={m.userId} style={{
                backgroundColor: "#002244",
                borderRadius: "15px",
                padding: "15px",
                minWidth: "250px",
                boxShadow: "0 0 10px rgba(0,0,0,0.5)",
              }}>
                <p><b>Kullanıcı Adı:</b> {m.username}</p>
                <p><b>Nickname:</b> {m.nickname || "-"}</p>
                <p><b>Role Geçiş:</b> {m.daysInRole} gün önce</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
