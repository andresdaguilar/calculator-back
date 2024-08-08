const express = require('express');
const sequelize = require('./v1/config/db');
const routes = require('./v1/routes');
const setupSwagger = require('./v1/config/swagger');
const cors = require('cors');
const serveless = require('serverless-http');

require('dotenv').config();

const app = express();

app.use(cors({
  origin: '*', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, 
}));

app.get('/ping', (req, res) => {
  res.send('pong');
})

app.use(express.json());
app.use('/api/v1', routes);

setupSwagger(app);

const PORT = process.env.PORT || 8000;

const force = false;
sequelize.sync({force: force}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})