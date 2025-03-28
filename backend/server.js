const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const Session = require('./models/Session');

require('dotenv').config();
const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

// Cron job to toggle session activation every minute
cron.schedule('* * * * *', async () => {
  const now = new Date();
  await Session.updateMany(
    { startTime: { $lte: now }, endTime: { $gte: now }, isActive: false },
    { isActive: true }
  );
  await Session.updateMany(
    { endTime: { $lt: now }, isActive: true },
    { isActive: false }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
