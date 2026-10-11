export const AUTH_CREDENTIALS = {
  get username() {
    return process.env.ADMIN_USERNAME || '';
  },
  get password() {
    return process.env.ADMIN_PASSWORD || '';
  },
};

export const AUTH_COOKIE_NAME = 'pulseguard_session_v1';
export const AUTH_STORAGE_KEY = 'pulseguard_authenticated_user';
