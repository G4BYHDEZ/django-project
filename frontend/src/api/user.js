import { getRefreshToken, setAccessToken } from './token.js';

const API_URL = import.meta.env.VITE_BASE_API_URL || 'http://127.0.0.1:8000';

async function readResponse(response, fallback) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = Object.values(data).flat().find((value) => typeof value === 'string');
    throw new Error(message || fallback);
  }
  return data;
}

export async function loginApi(formData) {
  const response = await fetch(`${API_URL}/api/v1/auth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  return readResponse(response, 'Correo o contraseña incorrectos.');
}

export async function registerApi(formData) {
  const response = await fetch(`${API_URL}/api/v1/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  return readResponse(response, 'No se pudo crear la cuenta.');
}

export async function getMeApi(token) {
  let response = await fetch(`${API_URL}/api/v1/auth/me/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status === 401 && getRefreshToken()) {
    const refreshResponse = await fetch(`${API_URL}/api/v1/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: getRefreshToken() }),
    });
    if (refreshResponse.ok) {
      const refreshed = await refreshResponse.json();
      setAccessToken(refreshed.access);
      response = await fetch(`${API_URL}/api/v1/auth/me/`, {
        headers: { Authorization: `Bearer ${refreshed.access}` },
      });
    }
  }
  return readResponse(response, 'No se pudo recuperar la sesión.');
}

export async function getCapitalApi(token, countryCode) {
  const response = await fetch(`${API_URL}/api/v1/soap/capital/${countryCode}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return readResponse(response, 'El servicio SOAP no está disponible.');
}
