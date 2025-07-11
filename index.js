// pages/api/[...path].js
export default async function handler(req, res) {
  const { path } = req.query;
  const apiUrl = `https://api.sofascore.com/api/v1/${path.join('/')}`; // Ganti dengan URL API Anda

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
