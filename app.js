const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const db = require('./database/db');
const User = require('./models/user');
const Group = require('./models/group');
const UserGroup = require('./models/usergroup');
const Message = require('./models/chat')

const app = express();

const signupRoute = require('./routes/signupRoute');
const loginRoute = require('./routes/loginRoute');
const chatAppRoute = require('./routes/chatAppRoute');
const groupmessageRoute = require('./routes/groupMessageRoute');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({ origin: "http://127.0.0.1:5500", credentials: true }));

// Define associations between models
User.hasMany(Message);
Message.belongsTo(User);

Group.belongsTo(User,{as:'admin'})



User.belongsToMany(Group, { through: UserGroup, as: 'groups' });
Group.belongsToMany(User, { through: UserGroup, as: 'users' });

// Sync the database
db.sync()
  .then(() => {
    console.log('Database synchronized successfully.');
    app.listen(3000, () => {
      console.log('Server started on port 3000.');
    });
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

// Routes
app.use(signupRoute);
app.use(loginRoute);
app.use(chatAppRoute);
app.use(groupmessageRoute);
