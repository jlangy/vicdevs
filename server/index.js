const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const app = express();

// Setting up CORS
const corsOptions = {
	origin: '*',
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS',
	preflightContinue: true,
	optionsSuccessStatus: 204,
	exposedHeaders: 'x-auth-token'
};

app.use(cors(corsOptions));

// Connect to database
connectDB();

// Init middleware
app.use(helmet());
app.use(xss());
app.use(express.json({ extended: false, limit: '10kb' }));
app.use(express.static('./server/static/build'));

// Routes
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/static/build/index.html'));
});
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
