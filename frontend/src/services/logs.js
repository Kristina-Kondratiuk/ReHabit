import API from "./api";

export const getLogs = async (month) => {
  const res = await API.get("/logs", {
    params: { month },
  });

  return res.data;
};

export const completeHabitForDate = async (habitId, date) => {
  const res = await API.post(`/logs/${habitId}/complete`, { date });
  return res.data;
};

export const uncompleteHabitForDate = async (habitId, date) => {
  const res = await API.delete(`/logs/${habitId}/complete`, {
    data: { date },
  });

  return res.data;
};
