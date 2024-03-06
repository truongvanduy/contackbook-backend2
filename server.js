const app = require('./app');
const config = require('./app/config');

// Start the server
const PORT = config.app.port || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
