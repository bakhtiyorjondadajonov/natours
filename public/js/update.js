import axios from 'axios';
import { showAlert } from './alerts';
export const updateUserData = async function (name, email) {
  try {
    const result = await axios({
      method: 'patch',
      url: `http://127.0.0.1:3000/api/v1/users/updateMe`,
      data: {
        name,
        email,
      },
    });
    console.log('result: ', result);
    if (result.data.status === 'success') {
      showAlert('success', 'Your data is updated!');
      setTimeout(() => {
        location.assign('/me');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
export const updateUserPassword = async function (
  currentPassword,
  password,
  passwordConfirm
) {
  try {
    const result = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:3000/api/v1/users/updateMyPassword',
      data: {
        currentPassword,
        password,
        passwordConfirm,
      },
    });
    if (result.data.status === 'success') {
      showAlert('success', 'Your password is updated');
      setTimeout(() => {
        location.assign('/me');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error);
  }
};
export const updateUserSettings = async function (type, data) {
  const url =
    type === 'data'
      ? `http://127.0.0.1:3000/api/v1/users/updateMe`
      : `http://127.0.0.1:3000/api/v1/users/updateMyPassword`;
  try {
    const result = await axios({
      method: 'patch',
      url,
      data,
    });

    if (result.data.status === 'success') {
      showAlert('success', `Your ${type.toUpperCase()} is updated!`);
      setTimeout(() => {
        location.assign('/me');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
