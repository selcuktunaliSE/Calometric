import axios from "axios";

// iOS Simulator:
export const api = axios.create({ baseURL: "http://localhost:3001" });
// Android Emu kullanırsan: baseURL: "http://10.0.2.2:3001"
