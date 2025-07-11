const http = require('http');
const https = require('https');
const url = require('url');

const server = http.createServer(async (req, res) => {
  try {
    // Mendapatkan URL API dan path
    const parsedUrl = url.parse(req.url, true);
    const apiUrl = `https://api.sofascore.com/api/v1${parsedUrl.path}`; // Ganti dengan URL API Anda

    // Membuat request ke API eksternal
    const apiRequest = https.request(apiUrl, {
      method: req.method,
      headers: req.headers,
    }, (apiResponse) => {
      let data = '';

      apiResponse.on('data', (chunk) => {
        data += chunk;
      });

      apiResponse.on('end', () => {
        res.writeHead(apiResponse.statusCode, apiResponse.headers);
        res.end(data);
      });
    });

    // Menangani error
    apiRequest.on('error', (error) => {
      console.error('Error forwarding request:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to forward request' }));
    });

    // Menulis data request ke API eksternal
    req.on('data', (chunk) => {
      apiRequest.write(chunk);
    });

    req.on('end', () => {
      apiRequest.end();
    });

  } catch (error) {
    console.error('Error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});


const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

