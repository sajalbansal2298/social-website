import axios from 'axios';

const baseDomain = 'this.example.com';
const baseURL = `https://${baseDomain}/api/v1`;

export default axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
