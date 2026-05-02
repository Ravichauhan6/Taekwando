export const getToken = () => localStorage.getItem("adminToken");
export const setToken = (token: string) => localStorage.setItem("adminToken", token);
export const removeToken = () => localStorage.removeItem("adminToken");

export const isAuthenticated = () => !!getToken();
