const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const chatRouter = require('./routes/chatRouter'); 
const authRouter = require('./modules/auth/authRouter');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/chat', chatRouter);
app.use('/api/auth', authRouter); 

app.get('/', (req, res) => res.send('Server is running'));

module.exports = app;