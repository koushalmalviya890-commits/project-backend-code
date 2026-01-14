const app = require('./app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT;

(async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
})();