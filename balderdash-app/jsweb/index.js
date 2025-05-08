import express from "express";
import path from 'path';
import { fileURLToPath } from 'url'; // Import the utility function

const app = express();
const port = 8080;

// Get the directory of the current module file (index.js) in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static('public'));

app.use(express.static(path.join(__dirname)));

app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve('public', 'index.html'));
});

app.listen(port, () => {
  console.log(`WebServer running at http://localhost:${port}`);
});

