const login = async function (email, password) {
  try {
    const result = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    if (result.data.status == 'success') {
      alert('You are logged in.');
      setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    alert(error.response.data.message);
  }
};
document.querySelector('.form').addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
