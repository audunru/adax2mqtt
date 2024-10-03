import "dotenv/config";

import express, { Request, Response } from "express";

import { ContentType, getContent } from "../adax-api/content";
import { EnergyType, getEnergyLog } from "../adax-api/energy";

const app = express();
const port = process.env.PORT ?? 3000;

app.get(
  "/api/v1/content",
  async (_req: Request, res: Response<ContentType>) => {
    const content = await getContent();

    res.json(content);
  },
);

app.get(
  "/api/v1/energy/:roomId",
  async (req: Request, res: Response<EnergyType>) => {
    const content = await getEnergyLog(parseInt(req.params.roomId, 10));

    res.json(content);
  },
);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
