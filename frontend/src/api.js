import axios from 'axios';

//export const API_BASE_URL = 'http://localhost:8080/api';
export const API_BASE_URL = 'https://dynamicnfc.ca/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

/* const api = axios.create({
  baseURL: 'https://3.128.244.219:8080/api',
}); */

export async function createUser(formData) {
  const resp = await api.post('/users/upload', formData);
  return resp.data;
}

export async function updateUser(id, formData) {
  // Use POST for multipart updates - some browsers/servers handle multipart+PUT awkwardly.
  const resp = await api.post(`/users/${id}/upload`, formData);
  return resp.data;
}

export async function getUser(id) {
  const resp = await api.get(`/users/${id}`);
  return resp.data;
}

export async function listUsers() {
  const resp = await api.get('/users');
  return resp.data;
}

export default api;
