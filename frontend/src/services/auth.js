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

export const register = async (username, email, password) => {
  try {
    const res = await API.post("/auth/register", {
      username,
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
