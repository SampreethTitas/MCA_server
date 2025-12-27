import app from './app.js';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
connectDB();


const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
