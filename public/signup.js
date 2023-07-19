const sign = document.getElementById('submit');

sign.addEventListener('click', AddUser);

async function AddUser(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phno = document.getElementById('phno').value;
  const password = document.getElementById('password').value;

  if (name === '' || email === '' || password === '' || phno === '') {
    window.alert('Please enter all fields');
    return; 
  }

  const obj = {
    name: name,
    email: email,
    phno: phno,
    password: password,
  };

  try {
    const response = await axios.post('/signup', obj);
    console.log(response.data.newSignUp);
    if (response.status === 201) {
      alert('Successfully signed up');
      window.location.href = '/';
    } else {
      alert('User already exists, Please Login');
    }
  } catch (err) {
    if (err.response && err.response.status === 400) {
      alert('User already exists, Please Login');
    } else {
      console.log(err);
    }
  }
}
