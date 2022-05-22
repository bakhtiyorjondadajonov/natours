import { login } from './login';
import { logout } from './login';
import { displayMap } from './mapbox';

import '@babel/polyfill';
//------Log in form
const loginForm = document.querySelector('.form');
if (loginForm) {
  document.querySelector('.form').addEventListener('submit', function (e) {
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
