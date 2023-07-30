const submit = document.getElementById('submit');

submit.addEventListener("click", AleradyUser);

async function AleradyUser(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const obj = {
    email: email,
    password: password,
  };
  
  try {
    const response = await axios.post(
      "http://16.171.131.88:80/login", obj
    );
    alert(response.data.message);
    localStorage.setItem('token',response.data.token);
    sessionStorage.setItem('token',response.data.token);
    window.location.href="/chat/";
  } catch (err) {
    console.log(err);
    document.getElementById("err").innerText = err.response.data.message;
    document.getElementById("err").style.color = "red";
  }
}

