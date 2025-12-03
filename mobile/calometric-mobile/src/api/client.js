import axios from "axios";

// Backend adresin: eğer emülatör ile çalışıyorsan:
// Android Emulator: http://10.0.2.2:4000
// iOS Simulator: http://localhost:4000
const API_BASE_URL = "http://10.0.2.2:4000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export default api;