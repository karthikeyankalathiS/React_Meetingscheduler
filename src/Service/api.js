import axios from 'axios';
 
export const fetchRooms = async (setRooms) => {
  try {
    const response = await axios.get("http://127.0.0.1:3112/getRooms");
    const sortedRooms = response.data.sort((a, b) => a.room.localeCompare(b.room));
    setRooms(sortedRooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
  }
};
 
export const fetchEmployees = async (setEmployees) => {
  try {
    const response = await axios.get("http://127.0.0.1:3112/getEmployees");
    // Sorting logic here
    setEmployees(response.data);
  } catch (error) {
    console.error("Error fetching employees:", error);
  }
};
 
export const insertBooking = async (formData) => {
  return axios.post("http://127.0.0.1:3112/insertBooking", formData);
};
