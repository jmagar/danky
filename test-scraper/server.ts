// server.ts
import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
const port = 3000;

app.use(express.json());

// MCP Protocol handler 
app.post('/mcp', async (req, res) => {
  const { name, parameters } = req.body;

  if (name === 'scrape') {
    const { url } = parameters;
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);
      const html = await page.content();
      await browser.close();
      res.json({ html });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(400).json({ error: 'Invalid function name' });
  }
});

app.listen(port, () => {
  console.log(`MCP Server listening at http://localhost:${port}`);
});