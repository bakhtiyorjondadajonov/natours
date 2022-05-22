import axios from 'axios';
import { showAlert } from './alerts';
export const login = async function (email, password) {
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
      showAlert('success', 'You are logged in.');
      setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

export const logout = async function () {
  try {
    const result = await axios.get('http://127.0.0.1:3000/api/v1/users/logout');
    if (result.data.status === 'success') {
      showAlert('success', 'You are logged out');
      setTimeout(() => {
        location.assign('/login');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', 'Error logging out! Try again.');
  }
};
