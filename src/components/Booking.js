import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "./style.css";

const Booking = () => {
  const [rooms, setRooms] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setMinDateTime();
    fetchRooms();
    fetchEmployees();
  }, []);

  const setMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    const dateTime = `${year}-${month}-${day}T${hour}:${minute}`;
    setStartTime(dateTime);
    setEndTime(dateTime);
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:3112/getRooms");
      const sortedRooms = response.data.sort((a, b) =>
        a.room.localeCompare(b.room)
      );
      setRooms(sortedRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:3112/getEmployees");
      const sortedEmployees = response.data.sort((a, b) => {
        const idA = a.employeeId;
        const idB = b.employeeId;
        const numA = parseInt(idA.match(/\d+/)[0]);
        const numB = parseInt(idB.match(/\d+/)[0]);
        return numA - numB || idA.localeCompare(idB);
      });
      setEmployees(sortedEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const clearFunction = async () => {
    await fetchRooms();
    await fetchEmployees();
    setRoomId("");
    setEmployeeId("");
    setError("");
  };

  const validateDateTime = () => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (end <= start) {
      setError("End time should be after start time.");
      return false;
    }
    const diffInHours = (end - start) / (1000 * 60 * 60);
    if (diffInHours > 30) {
      setError("Meeting can't be more than 30 hours.");
      return false;
    }
    return true;
  };

  const insertFunction = async () => {
    if (!validateDateTime()) return;
    if (!roomId || !employeeId || !startTime || !endTime) {
      setError("All fields are required");
      return;
    }
    const formData = { roomId, startTime, endTime, employeeId };
    try {
      const response = await axios.post(
        "http://127.0.0.1:3112/insertBooking",
        formData
      );
      if (response.status === 200) {
        await clearFunction();
        window.location.href = "http://localhost:3000";
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message);
      } else {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div
      className="align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <Navbar />
      <div className="container my-5">
        <div className="row gx-5">
          <div className="col-12 col-md-6 col-lg-6">
            <div className="bg-white p-4 rounded shadow">
              <h1>MEETING BOOKING</h1>
              <form id="bookingForm">
                <div className="mb-3">
                  <label className="form-label" htmlFor="roomId">
                    Room
                  </label>
                  <select
                    id="roomId"
                    className="form-select"
                    name="roomId"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                  >
                    <option value="" disabled>
                      {" "}
                      -- Select a Room --{" "}
                    </option>
                    {rooms.map((room) => (
                      <option key={room.roomId} value={room.roomId}>
                        {room.room}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="employeeId">
                    Employee ID
                  </label>
                  <select
                    id="employeeId"
                    className="form-select"
                    name="employeeId"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                  >
                    <option value="" disabled>
                      {" "}
                      -- Select your Employee ID --{" "}
                    </option>
                    {employees.map((employee) => (
                      <option
                        key={employee.employeeId}
                        value={employee.employeeId}
                      >
                        {employee.employeeId}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="starttime">
                    Start Time
                  </label>
                  <input
                    id="starttime"
                    className="form-control"
                    type="datetime-local"
                    name="starttime"
                    // value={startTime}
                    min={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="endtime">
                    End Time
                  </label>
                  <input
                    id="endtime"
                    className="form-control"
                    type="datetime-local"
                    name="endtime"
                    // value={endTime}
                    min={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
                <label style={{ color: "red" }}>{error}</label>
                <div className="row gx-2 gy-3">
                  <div className="col">
                    <button
                      type="button"
                      className="btn btn-primary w-100"
                      onClick={insertFunction}
                    >
                      Insert
                    </button>
                  </div>
                  <div className="col">
                    <button
                      type="button"
                      className="btn btn-primary w-100"
                      onClick={clearFunction}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;