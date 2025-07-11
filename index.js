const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = 10000; // Atau port lainnya

app.use(express.json());

app.all('*', async (req, res) => {
  const apiUrl = `https://api.sofascore.com/api/v1${req.originalUrl}`; // Menggabungkan URL API dengan path dari request

  try {
    const apiResponse = await fetch(apiUrl, {
      method: req.method,
      headers: {
        ...req.headers, // Menyalin headers dari request asli
        // Tambahkan headers lainnya jika diperlukan (misalnya, Authorization)
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined, // Menambahkan body request jika bukan GET
    });

    if (!apiResponse.ok) {
      // Handle error dari API eksternal
      const errorData = await apiResponse.json().catch(() => ({ error: 'API error' }));
      return res.status(apiResponse.status).json(errorData);
    }

    const data = await apiResponse.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

