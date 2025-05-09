const dotenv = require("dotenv");
dotenv.config({ path: __dirname + '/.env' }); // force-load .env

console.log("✅ ENV FILE LOADED");
console.log("🔐 Loaded key:", process.env.OPENAI_API_KEY);
console.log("🧪 Mock Mode:", process.env.MOCK_MODE);


const express = require('express');
const cors = require('cors');
const openaiRoutes = require('./routes/openai');
console.log("🔐 Loaded key:", process.env.OPENAI_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/openai', openaiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
