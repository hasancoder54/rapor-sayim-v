import fetch from "node-fetch";

const GROUP_ID = 3529061;
const ROLE_ID = 24274463; // Asteğmen rolü
const MAX_MEMBERS = 300;

export default async function handler(req, res) {
  try {
    const apiUrl = `https://groups.roblox.com/v1/groups/${GROUP_ID}/roles`;
    const rolesRes = await fetch(apiUrl);
    if (!rolesRes.ok) return res.status(500).json({error: "Gruplar alınamadı."});
    const rolesData = await rolesRes.json();
    const role = rolesData.roles.find(r => r.id === ROLE_ID);
    if (!role) return res.status(404).json({error: "Rol bulunamadı."});

    const membersUrl = `https://groups.roblox.com/v1/groups/${GROUP_ID}/roles/${ROLE_ID}/users?limit=1000`;
    const membersRes = await fetch(membersUrl);
    if (!membersRes.ok) return res.status(500).json({error: "Üyeler alınamadı."});
    const membersData = await membersRes.json();

    // Sadece 300 üyeye kadar alıyoruz
    let members = membersData.data.slice(0, MAX_MEMBERS);

    // daysInRole hesaplama için şu anki tarih
    const now = new Date();

    members = members.map(m => {
      let joinedDate = new Date(m.joined);
      let diffTime = Math.abs(now - joinedDate);
      let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return {
        userId: m.user.userId,
        username: m.user.username,
        nickname: m.nickname || null,
        daysInRole: diffDays
      };
    });

    res.status(200).json({members});
  } catch (error) {
    res.status(500).json({error: error.message || "Bilinmeyen hata"});
  }
}
