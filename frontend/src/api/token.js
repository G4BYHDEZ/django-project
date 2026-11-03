const ACCESS_KEY = import.meta.env.VITE_LOCAL_STORAGE_ITEM_NAME || 'TOKEN';
const REFRESH_KEY = `${ACCESS_KEY}_REFRESH`;

export const getToken = () => window.localStorage.getItem(ACCESS_KEY);
export const getRefreshToken = () => window.localStorage.getItem(REFRESH_KEY);

export function setTokens(access, refresh) {
  window.localStorage.setItem(ACCESS_KEY, access);
  if (refresh) window.localStorage.setItem(REFRESH_KEY, refresh);
}

export function setAccessToken(access) {
  window.localStorage.setItem(ACCESS_KEY, access);
}

export function removeToken() {
  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
}
