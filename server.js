const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
dotenv.config({ path: './config.env' });
const DB = process.env.DB.replace('<password>', process.env.DB_PSW);
mongoose
  .connect(DB)
  .then(() => console.log('Database connection is successful!'));

const port = process.env.port || 8000;
app.listen(port, '127.0.0.1', () => {
  console.log(`Server is running on port ${port}`);
});
