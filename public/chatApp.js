function parseJwt(token) {
  if (!token) {
    throw new Error('Invalid token');
  }
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

function outputUserJoined(username) {
  const userlist = document.getElementById('userlist');
  let user = document.createElement('li');
  user.textContent = `${username} joined.`;
  userlist.appendChild(user);
}

function getCurrentTime() {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return time;
}
async function updateLocalStorageWithMessages() {
  try {
    const response = await axios.get('/show-chat');
    const messages = response.data;
    const lastTenMessages = messages.slice(-10); 

    
    localStorage.setItem('lastTenMessages', JSON.stringify(lastTenMessages));
  } catch (error) {
    console.error('Error retrieving messages:', error);
  }
  
}


document.getElementById('add-chat').addEventListener('click', addChat);

 async function addChat(event) {
  event.preventDefault();

  const msg = document.getElementById('msg').value;
  const token = sessionStorage.getItem("token");
  const user = parseJwt(token);

  const obj = {
    message: msg,
    userId: user.userId,
    name: user.name
  };
  try {
    let response = await axios.post(
      "/add-chat",
      obj,
      { headers: { Authorization: token } }
    );
    document.getElementById("msg").value = '';
    
    
    updateLocalStorageWithMessages();
  } catch (err) {
    console.log(err);
  }
}

window.addEventListener('DOMContentLoaded', async () => {

  

  
  let token = localStorage.getItem("token");
  const decode = parseJwt(token);
  const name = decode.username;
  outputUserJoined(name);

  const chatForm = document.getElementById('chat-form');
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    const currentTime = getCurrentTime();
    outputMessage({ message: msg, sender: name });
    document.getElementById('msg').value = '';
    document.getElementById('msg').focus();
  });

  window.addEventListener('storage', (event) => {
    if (event.key === 'loggedInUsers') {
      const loggedInUsers = JSON.parse(event.newValue);
      updateUsersList(loggedInUsers);
    }
  });

  function updateUsersList(loggedInUsers) {
    const userlist = document.getElementById('userlist');
    userlist.innerHTML = '';

    for (const username of loggedInUsers) {
      outputUserJoined(username);
    }
  }

  const loggedInUsers = JSON.parse(localStorage.getItem('loggedInUsers')) || [];
  updateUsersList(loggedInUsers);
  loggedInUsers.push(name);
  localStorage.setItem('loggedInUsers', JSON.stringify(loggedInUsers));

  document.getElementById('log').addEventListener('click', () => {
    const loggedInUsers = JSON.parse(localStorage.getItem('loggedInUsers')) || [];
    const index = loggedInUsers.indexOf(name);
    if (index > -1) {
      loggedInUsers.splice(index, 1);
      localStorage.setItem('loggedInUsers', JSON.stringify(loggedInUsers));
    }

    window.location.href = '/login';
  });

  
  function displayMessages() {
    const storedMessages = JSON.parse(localStorage.getItem('lastTenMessages')) || [];
  
    
    const messageList = document.getElementById('message-list');
    messageList.innerHTML = '';
  
    storedMessages.forEach(message => {
      const listItem = document.createElement('li');
      listItem.setAttribute('id', `message-item-${message.id}`);
      listItem.innerHTML = `<strong>${message.name}:</strong> ${message.message}`;
      messageList.appendChild(listItem);
    });
  }
  

  displayMessages();
  
  
  setInterval(displayMessages, 1000);
  
});

document.getElementById('group-chat').addEventListener('click', showPopup);
  document.getElementById('group-chat').addEventListener('click', createGroup);
  document.getElementById('close').addEventListener('click', hidePopup);

function showPopup() {
    var popup = document.getElementById("popup");
    popup.style.display = "block";
  }

  

  function hidePopup() {
    var popup = document.getElementById("popup");
    popup.style.display = "none";
  }


async function createGroup() {
console.log("hello")

  var checkboxOptions = document.getElementById("checkboxOptions");
  checkboxOptions.innerHTML = ''; 

  try {
    const response = await axios.get('/get-user'); 
    const users = response.data;
    
    users.forEach(function(user) {
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "users";
      checkbox.value = user.name;
    

      var label = document.createElement("label");
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(user.name));

      checkboxOptions.appendChild(label);
    });
  } catch (error) {
    console.error('Error retrieving users:', error);
  }
}

async function displayGroupNames() {
  try {
    const response = await axios.get("/get-group");
    

    if (response.status === 200) {
      const participationData = response.data;
      const groupData = participationData.groupData;
      //console.log(groupData);
      const token = sessionStorage.getItem("token");
      const user = parseJwt(token);
      const userId = user.userId;
      //console.log(userId)

      const associatedGroupData = groupData.filter(group => group.userId === userId);
      
      const groupIds = associatedGroupData.map(group => group.groupId);
      
      const groupNamesResponse = await axios.get("/get-group-name");
      
      const groupNamesData = groupNamesResponse.data;
      
      const groupContainer = document.getElementById("group-icon");
      groupContainer.innerHTML = "";

      groupIds.forEach(groupId => {
        const group = groupNamesData.groupName.find(group => group.id == groupId);
        
        if (group) {
          const button = document.createElement("button");
          button.textContent = group.groupname;
          button.classList.add("group-button");
            button.id = group.group_id;
            button.style.margin = "5px";
            button.style.padding = "10px";
            button.style.backgroundColor = "red";
            button.style.color = "black";
            button.style.fontWeight = 'bold';
            button.style.border = "none";
            button.style.borderRadius = '8px'
            button.style.cursor = "pointer";
            button.style.float = "right";

            button.addEventListener("mouseenter", () => {
              button.style.backgroundColor = "blue";
            });

            button.addEventListener("mouseleave", () => {
              button.style.backgroundColor = "red";
            });

            button.addEventListener("click", () => {
              handleGroupButtonClick(group.id, group.groupname);
            });

          groupContainer.appendChild(button);
        }
      });
    } else {
      console.error("Failed to retrieve user participation data");
    }
  } catch (error) {
    console.error("Error occurred while retrieving user participation data", error);
  }
}

displayGroupNames();

function handleGroupButtonClick(groupId, groupName) {
  
  fetch(`/groups/${groupId}/members`)
    .then(response => response.json())
    .then(data => {
      const members = data.members;
      
      
      const group_id = data.group_id;
      const adminId = data.adminId;
      sessionStorage.setItem('groupMembers', JSON.stringify(members));
      sessionStorage.setItem('Admin', JSON.stringify(adminId));
      sessionStorage.setItem('Group_Id', JSON.stringify(group_id));
      window.location.href = `/group-chat/${groupId}+${groupName}`;
      console.log('Group Members:', members);
      // showMembers();
    })
    .catch(error => console.error('Error retrieving group members:', error));
}



