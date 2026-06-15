import API from "./api";

const extractErrorMessage = (error) => {
  return error?.response?.data?.message || error?.message || "Nie udało się pobrać statystyk.";
};

export const getStatistics = async () => {
  try {
    const res = await API.get("/statistics");
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
