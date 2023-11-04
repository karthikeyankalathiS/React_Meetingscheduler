import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { setMinDateTime } from "../Service/utils";
import { fetchRooms, fetchEmployees, insertBooking } from "../Service/api";
import { validateDateTime } from "../Service/Validations";
import { useNavigate } from "react-router-dom";
 
import "./style.css";
 
const Booking = () => {
  const [rooms, setRooms] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
 
  useEffect(() => {
    setMinDateTime(setStartTime, setEndTime);
    fetchRooms(setRooms);
    fetchEmployees(setEmployees);
  }, []);
 
  const clearFunction = async () => {
    await fetchRooms(setRooms);
    await fetchEmployees(setEmployees);
    setRoomId("");
    setEmployeeId("");
    setError("");
  };
 
  const insertFunction = async () => {
    if (!validateDateTime(startTime, endTime, setError)) return;
 
    const formData = { roomId, startTime, endTime, employeeId };
    try {
      const response = await insertBooking(formData);
      if (response.status === 200) {
        await clearFunction();
        navigate('/', {
          state: { message: 'Booking added successfully', type: 'success' }
        });
       
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
                      className="btn btn-primary w-100 d-flex justify-content-center"
                      onClick={insertFunction}
                    >
                      Insert
                    </button>
                  </div>
                  <div className="col">
                    <button
                      type="button"
                      className="btn btn-primary w-100 d-flex justify-content-center"
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