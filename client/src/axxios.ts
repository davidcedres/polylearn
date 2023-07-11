import axios from 'axios'

if (!import.meta.env.VITE_API_URL) throw new Error('VITE_API_URL needed')

let getToken: undefined | (() => Promise<string | null>) = undefined

export const setGetToken = (gt: () => Promise<string | null>) => {
    getToken = gt
}

const axxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL as string,
});

axxios.interceptors.request.use(async (config) => {
    if (!getToken) throw new Error('Axios not configured')
    const token = await getToken();
    config.headers.Authorization = token;
    return config;
});

export default axxios