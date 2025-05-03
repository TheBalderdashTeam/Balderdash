import express, { Express, Request, Response } from "express";

const app = express();
const port = 4321;

app.get('/', (req: Request, res: Response) => {
    res.send('Home page');
})

app.listen(port, () => {
    console.log(`Running on ${port}`);
})