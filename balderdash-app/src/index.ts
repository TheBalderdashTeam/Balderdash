import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const port = 3000;

// Serve static files (like index.html)
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
