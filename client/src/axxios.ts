import axios from 'axios'

if (!import.meta.env.VITE_API_URL) throw new Error('VITE_API_URL needed')

const axxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL as string,
});

export default axxios