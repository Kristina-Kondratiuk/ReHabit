import API from "./api";

export const getHabits = async () => {
  const res = await API.get("/habits");
  return res.data;
};

export const createHabit = async (habit) => {
  const res = await API.post("/habits", habit);
  return res.data;
};

export const updateHabit = async (id, updatedData) => {
    const res = await API.put(`/habits/${id}`, updatedData);
    return res.data;
}

export const deleteHabit = async (id) => {
    const res = await API.delete(`/habits/${id}`);
    return res.data;
}