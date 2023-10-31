import React, { useEffect } from 'react';
import './style.css'
import axios from 'axios';
import Navbar from './Navbar';
 
const Booking = () => {
  useEffect(() => {
    // setMinDateTime();
    fetchRooms();
    fetchEmployees();
  }, []);
 
  async function clearFunction() {
    await fetchRooms();
    await fetchEmployees();
    document.getElementById('starttime').value = '';
    document.getElementById('endtime').value = '';
    document.getElementById('errorDisplay').textContent = '';
  }
 
  async function fetchRooms() {
    try {
      const response = await axios.get('http://127.0.0.1:3112/getRooms');
      let rooms = response.data.sort((a, b) => a.room.localeCompare(b.room));
      const selectElement = document.getElementById('roomId');
      while (selectElement.firstChild) {
        selectElement.removeChild(selectElement.firstChild);
      }
      const defaultOption = document.createElement('option');
      defaultOption.selected = true;
      defaultOption.value = "";
      defaultOption.textContent = " -- Select a Room -- ";
      selectElement.appendChild(defaultOption);
      rooms.forEach((room) => {
        const optionElement = document.createElement('option');
        optionElement.value = room.roomId;
        optionElement.textContent = room.room;
        selectElement.appendChild(optionElement);
      });
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  }
 
  async function fetchEmployees() {
    try {
      const response = await axios.get('http://127.0.0.1:3112/getEmployees');
      let employees = response.data.sort((a, b) => {
        const idA = a.employeeId;
        const idB = b.employeeId;
        const numA = parseInt(idA.match(/\d+/)[0]);
        const numB = parseInt(idB.match(/\d+/)[0]);
        if (numA < numB) return -1;
        if (numA > numB) return 1;
        return idA.localeCompare(idB);
      });
      const selectElement = document.getElementById('employeeId');
      while (selectElement.firstChild) {
        selectElement.removeChild(selectElement.firstChild);
      }
      const defaultOption = document.createElement('option');
      defaultOption.selected = true;
      defaultOption.value = "";
      defaultOption.textContent = " -- Select your Employee ID -- ";
      selectElement.appendChild(defaultOption);
      employees.forEach((employee) => {
        const optionElement = document.createElement('option');
        optionElement.value = employee.employeeId;
        optionElement.textContent = employee.employeeId;
        selectElement.appendChild(optionElement);
      });
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  }
 
  async function insertFunction() {
    if (!validateDateTime()) {
      return;
    }
    const roomId = document.getElementById('roomId').value;
    const startTime = document.getElementById('starttime').value;
    const endTime = document.getElementById('endtime').value;
    const employeeId = document.getElementById('employeeId').value;
    if (!roomId || !employeeId || !startTime || !endTime) {
      document.getElementById('errorDisplay').textContent = 'All fields are required';
      return;
    }
    const formData = {
      roomId,
      startTime,
      endTime,
      employeeId
    };
 
    try {
      const response = await axios.post('http://127.0.0.1:3112/insertBooking', formData);
      if (response.status === 200) {
        clearFunction();
        window.location.href = 'http://localhost:3000';
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        document.getElementById('errorDisplay').textContent = error.response.data.message;
      } else {
        console.error('Error:', error);
      }
    }
  }
  function setMinDateTime() {
     const now = new Date();
     const year = now.getFullYear();
     const month = String(now.getMonth() + 1).padStart(2, '0');
     const day = String(now.getDate()).padStart(2, '0');
     const hour = String(now.getHours()).padStart(2, '0');
     const minute = String(now.getMinutes()).padStart(2, '0');
     const dateTime = `${year}-${month}-${day}T${hour}:${minute}`;
     document.getElementById('starttime').min = dateTime;
     document.getElementById('endtime').min = dateTime;
  }
  function validateDateTime() {
     const startTime = new Date(document.getElementById('starttime').value);
     const endTime = new Date(document.getElementById('endtime').value);
     if (endTime <= startTime) {
      document.getElementById('errorDisplay').textContent = '"End time should be after start time."';
      return false;
     }
     const diffInHours = (endTime - startTime) / (1000 * 60 * 60);
     if (diffInHours > 30) {
      document.getElementById('errorDisplay').textContent = "Meeting can't be more than 30 hours ";
      return false;
     }
     return true
  }
 
  return (
    <div className="align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <Navbar />
      <div className="container my-5">
        <div className="row gx-5">
          <div className="col-12 col-md-6 col-lg-6">
            <div className="bg-white p-4 rounded shadow">
              <h1>MEETING BOOKING</h1>
              <form id="bookingForm">
                <div className="mb-3">
                  <label className="form-label" htmlFor="roomId">Room</label>
                  <select id="roomId" className="form-select" name="roomId">
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="employeeId">Employee ID</label>
                  <select id="employeeId" className="form-select" name="employeeId">
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="starttime">Start Time</label>
                  <input id="starttime" className="form-control" type="datetime-local" name="starttime" required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="endtime">End Time</label>
                  <input id="endtime" className="form-control" type="datetime-local" name="endtime" />
                </div>
                <label id="errorDisplay" style={{ color: 'red' }}></label>
                <div className="row gx-2 gy-3">
                  <div className="col">
                    <button type="button" className="btn btn-primary w-100" onClick={insertFunction}>Insert</button>
                  </div>
                  <div className="col">
                    <button type="button" className="btn btn-primary w-100" onClick={clearFunction}>Clear</button>
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