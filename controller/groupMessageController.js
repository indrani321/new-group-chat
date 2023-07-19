const path = require('path');
const db = require('../database/db');
const Group = require('../models/group');
const User = require('../models/user');
const UserGroup = require('../models/usergroup');




async function saveGroup(req, res,next) {
  try {
    const { groupname, participants, created_by } = req.body;

    
    const group = await Group.create({ groupname: groupname, created_by: created_by });
    const user = await User.findOne({
      where: {
        name: created_by
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await group.setAdmin(user);
    const UserObjects = await User.findAll({
      where: {
        name: participants
      }
    });
    console.log('Group:', group);
    console.log('UserObjects:', UserObjects);
    await group.addUsers(UserObjects);
    console.log('Group after adding users:', group);
    
    res.json({ success: true, group });
  } catch (error) {
    console.error('Error creating group:', error);
    res.json({ success: false, error });
  }
}

async function getGroup(req, res,next) {
  try {
    const groupData = await UserGroup.findAll();

    if (!groupData || groupData.length === 0) {
      return res.status(404).json({ error: 'No group data found' });
    }

    res.json({ groupData });
  } catch (error) {
    console.error('Error occurred while retrieving group data:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

async function getGroupName(req, res,next) {
  try {
    const groupName = await Group.findAll();
    

    if (!groupName || groupName.length === 0) {
      return res.status(404).json({ error: 'No group data found' });
    }

    res.json({ groupName });
  } catch (error) {
    console.error('Error occurred while retrieving group data:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
async function getGroupPage(req, res,next){
const groupId = req.params.groupId;
    
    res.sendFile(path.join(__dirname, '../views/groupChat.html'));
}



async function getGroupmembers(req, res,next) {
  try {
    const groupId = req.params.groupId;
    console.log(groupId)
    const group = await Group.findByPk(groupId, {
      include: {
        model: User,
        as: 'users',
        attributes: ['id','name'],
      },
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    const group_id = group.id;
    const adminId = group.adminId;
    const members = group.users.map(user => ({
      id: user.id,
      name: user.name,
      
    }));
    
    res.status(200).json({ members, group_id,adminId});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  saveGroup,
  getGroup,
  getGroupName,
  getGroupmembers,
  getGroupPage,
};
