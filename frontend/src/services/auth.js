import API from "./api";

const extractErrorMessage = (error) => {
  const fallback = "Something went wrong";
  return error?.response?.data?.message || error?.message || fallback;
};

export const setAuthToken = (token) => {
  global.token = token;
};

export const login = async (email, password) => {
  try {
    const res = await API.post("/auth/login", {
      email,
      password,
    });

    if (res.data?.token) {
      setAuthToken(res.data.token);
    }

    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

/**
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {string | null} [photoUri]
 */
export const register = async (username, email, password, photoUri = null) => {
  try {
    const res = await API.post("/auth/register", {
      username,
      email,
      password,
      photoUri,
    });

    if (res.data?.token) {
      setAuthToken(res.data.token);
    }

    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

/**
 * @param {string | null} photoUri
 */
export const updateProfilePhoto = async (photoUri) => {
  try {
    const res = await API.patch("/auth/me/photo", {
      photoUri,
    });

    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

/**
 * @param {{ username?: string; email?: string }} profile
 */
export const updateProfile = async (profile) => {
  try {
    const res = await API.patch("/auth/me", profile);

    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
