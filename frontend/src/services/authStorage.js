const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const authStorage = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser() {
    const user = localStorage.getItem(USER_KEY);

    return user ? JSON.parse(user) : null;
  },

  saveSession({ token, user }) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};