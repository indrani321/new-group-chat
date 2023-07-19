function parseJwt(token) {
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
  
  
  document.addEventListener('DOMContentLoaded', async () => {
    
    
    function showMembers() {
      const groupMembers = sessionStorage.getItem('groupMembers');
      const admin = sessionStorage.getItem('Admin');
      const group_id = sessionStorage.getItem('Group_Id');
      const token = sessionStorage.getItem('token');
      const loggedInUserId = parseJwt(token).userId;
    
      const members = JSON.parse(groupMembers);
      const Admin = JSON.parse(admin);
      const Group_Id = JSON.parse(group_id);
    
      const memberList = document.getElementById('groupuserlist');
      members.forEach(member => {
        const listItem = document.createElement('li');
        listItem.textContent = member.name;
        if (member.id === Admin) {
          listItem.textContent += ' (Admin)';
          listItem.style.fontWeight = 'bold';
        }
    
        const button = document.createElement('button');
        const makeAdmin = document.createElement('button');
        button.textContent = 'Delete User';
        button.id = `deleteButton_${member.id}`;
        makeAdmin.textContent = 'Make ADMIN';
        makeAdmin.id = `deleteButton_${member.id}`;
    
        button.addEventListener('click', () => { handleDeleteUser(member.id, Group_Id); });
        makeAdmin.addEventListener('click', () => { handleMakeAdmin(member.id, Group_Id); });
    
        listItem.appendChild(button);
        listItem.appendChild(makeAdmin);
        memberList.appendChild(listItem);
      });
    
      if (loggedInUserId === Admin) {
        const inviteButton = document.createElement('button');
        inviteButton.textContent = 'Invite User';
        inviteButton.id = 'inviteButton';
        inviteButton.addEventListener('click', () => { handleInviteUser(Group_Id); });
    
        memberList.appendChild(inviteButton);
      }
    }
    
    showMembers();
    
    async function handleDeleteUser(userId, Group_Id) {
      const token = sessionStorage.getItem('token');
      const loggedInUserId = parseJwt(token).userId;
      const adminId = parseInt(sessionStorage.getItem('Admin'), 10);
    
      if (loggedInUserId === adminId) {
        try {
          const response = await axios.delete(`/groups/${Group_Id}/delete/${userId}`);
          console.log(response.data.message);
          console.log(`User with ID ${userId} deleted`);
    
          // Remove the user from session storage
          const groupMembers = JSON.parse(sessionStorage.getItem('groupMembers'));
          const updatedMembers = groupMembers.filter(member => member.id !== userId);
          sessionStorage.setItem('groupMembers', JSON.stringify(updatedMembers));
    
          const deleteButton = document.getElementById(`deleteButton_${userId}`);
          const listItem = deleteButton.parentNode;
          listItem.parentNode.removeChild(listItem);
        } catch (error) {
          console.error(error.response.data.message);
        }
      } else {
        console.log('You are not an admin');
        alert('You are not an admin');
      }
    }
  });