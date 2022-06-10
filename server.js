const mongoose = require('mongoose');
const dotenv = require('dotenv');
//HANDLING UNCOUGHT EXPECTATION
process.on('uncaughtException', (err) => {
  console.log('UNCOUGHT EXPECTATION 💥 SHUTTING DOWN...');
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: './config.env' });
const app = require('./app');
const DB = process.env.DB.replace('<password>', process.env.DB_PSW);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Database connection is successful!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
//---- HANDLING UNHANDLED REJECTIONS ------- //
process.on('unhandledRejection', (err) => {
  console.log(`UHANDELED REJECTION 😵😵 💥 SHUTTING DOWN...`);
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
