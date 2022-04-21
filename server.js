const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
//HANDLING UNCOUGHT EXCEPTION
process.on('uncaughtException', (err) => {
  console.log(err.name);
  console.log(err.message);
  console.log('UNCOUGHT EXCEPTION 💥 SHUTTING DOWN...');
  process.exit(1);
});
dotenv.config({ path: './config.env' });
const DB = process.env.DB.replace('<password>', process.env.DB_PSW);
mongoose
  .connect(DB)
  .then(() => console.log('Database connection is successful!'));

const port = process.env.port || 8000;
const server = app.listen(port, '127.0.0.1', () => {
  console.log(`Server is running on port ${port}`);
});
//---- HANDLING UNHANDLED REJECTIONS ------- //
process.on('unhandledRejection', (err) => {
  console.log(err.name);
  console.log(err.message);
  console.log(`UHANDELED REJECTION 😵😵 💥 SHUTTING DOWN...`);

  server.close(process.exit(1));
});
