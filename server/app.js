const express = require('express');
const cors = require('cors');
const path = require('path');

const db = require("./models")
const initial = require("./config/db.init");

const app = express();

var corsOptions = {
    origin: process.env.URL_CLIENT
  };

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//For test
/*db.sequelize.sync().then(() => {
  console.log("db connection success")
}).catch((err) => {
  console.log(err.message)
})*/

//For dev
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});
app.use('/images', express.static(path.join(__dirname, 'images')));

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/article.routes')(app);
require('./routes/comment.routes')(app);
require('./routes/like.routes')(app)

module.exports = app;