import { login } from './login';
import { logout } from './login';
import { displayMap } from './mapbox';
import {
  updateUserData,
  updateUserPassword,
  updateUserSettings,
} from './update';
import '@babel/polyfill';
//------Log in form
const loginForm = document.querySelector('.form--login');
if (loginForm) {
  document
    .querySelector('.form--login')
    .addEventListener('submit', function (e) {
      e.preventDefault();
      // DOM elements related to  login
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      login(email, password);
    });
}

//-----------MAPBOX JS--------------//
// DOM elements related to  mapbox
const mapContainer = document.getElementById('map');
if (mapContainer) {
  const locations = JSON.parse(mapContainer.dataset.locations);
  displayMap(locations);
}
//Logging out

const logOutBtn = document.querySelector('.nav__el--logout');
if (logOutBtn) {
  logOutBtn.addEventListener('click', function (e) {
    e.preventDefault();
    logout();
  });
}
//UPDATING USER DATA
const userForm = document.querySelector('.form-user-data');

if (userForm) {
  userForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;

    const email = document.getElementById('email').value;
    const data = {
      name,
      email,
    };
    updateUserSettings('data', data);
    // updateUserData(name, email);
  });
}
//UPDATE USER PASSWORD
const userSettingsForm = document.querySelector('.form-user-settings');
if (userSettingsForm) {
  userSettingsForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const currentPassword = document.getElementById('password-current').value;
    console.log('currentPassword: ', currentPassword);

    const password = document.getElementById('password').value;

    const passwordConfirm = document.getElementById('password-confirm').value;
    const data = {
      currentPassword,
      password,
      passwordConfirm,
    };
    updateUserSettings('password', data);
    // updateUserPassword(currentPassword, password, passwordConfirm);
  });
}
