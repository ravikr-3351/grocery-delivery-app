const USER_STORAGE_KEY = 'user';

const parseUser = (rawValue) => {
  if (!rawValue) return null;

  try {
    const parsed = JSON.parse(rawValue);
    return parsed?.token ? parsed : null;
  } catch {
    return null;
  }
};

export const getStoredUser = () => {
  const sessionUser = parseUser(sessionStorage.getItem(USER_STORAGE_KEY));
  if (sessionUser) return sessionUser;

  // One-time migration from old localStorage auth to per-tab session storage.
  const legacyUser = parseUser(localStorage.getItem(USER_STORAGE_KEY));
  if (legacyUser) {
    sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(legacyUser));
    localStorage.removeItem(USER_STORAGE_KEY);
    return legacyUser;
  }

  return null;
};

export const setStoredUser = (user) => {
  if (!user) return;
  sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  localStorage.removeItem(USER_STORAGE_KEY);
};

export const clearStoredUser = () => {
  sessionStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
};
