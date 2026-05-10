const API_URL = "http://localhost:5000";

export const getApiUrl = (path) => `${API_URL}${path}`;
export const getUploadUrl = (path) => path ? `${API_URL}${path}` : null;

export default API_URL;
