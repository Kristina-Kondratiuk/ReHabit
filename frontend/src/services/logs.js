import API from "./api";

const extractErrorMessage = (error) => {
  return error?.response?.data?.message || error?.message || "Nie udało się zapisać wykonania nawyku.";
};

export const getLogs = async (month) => {
  try {
    const res = await API.get("/logs", {
      params: { month },
    });

    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const completeHabitForDate = async (habitId, date) => {
  try {
    const res = await API.post(`/logs/${habitId}/complete`, { date });
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const uncompleteHabitForDate = async (habitId, date) => {
  try {
    const res = await API.delete(`/logs/${habitId}/complete`, {
      data: { date },
    });

    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};
