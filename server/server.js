import app from './src/app.js';
import { config } from './src/config.js';

// On Vercel the exported app is invoked as a serverless function.
if (!process.env.VERCEL) {
  app.listen(config.port, () => console.log(`Nexus AI API listening on http://localhost:${config.port}`));
}
export default app;
