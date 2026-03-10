const app = require('./app');
const db = require('./config/database'); // Initialize DB

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
