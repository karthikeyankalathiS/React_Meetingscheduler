import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

function Update({ showModal, setShowModal, fetchAllData, selectedMeetingId,activePath,updateRoomId,updateStartTime,updateEndTime,updateEmployeeId,updateError,setUpdateEmployeeId,setUpdateRoomId,setUpdateStartTime,setUpdateEndTime,setUpdateError }) {
  const [rooms, setRooms] = useState([]);
  const [employees, setEmployees] = useState([]);


  useEffect(() => {
    fetchRooms();
    fetchEmployees();
  }, []); 


  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:3112/getRooms");
      let fetchedRooms = response.data;
      fetchedRooms = fetchedRooms.sort((a, b) => a.room.localeCompare(b.room));
      setRooms(fetchedRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };
 
 
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:3112/getEmployees");
      let fetchedEmployees = response.data;
      fetchedEmployees = fetchedEmployees.sort((a, b) => {
        const numA = parseInt(a.employeeId.match(/\d+/), 10);
        const numB = parseInt(b.employeeId.match(/\d+/), 10);
 
        if (numA < numB) return -1;
        if (numA > numB) return 1;
        return a.employeeId.localeCompare(b.employeeId);
      });
      setEmployees(fetchedEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
 
  const update = async () => {
    const updatedData = {
      roomId: updateRoomId,
      startTime: updateStartTime,
      endTime: updateEndTime,
      employeeId: updateEmployeeId,
    };
 
    console.log(updatedData);
    console.log(selectedMeetingId);
    setUpdateError("")
 
    try {
      const response = await axios.put(
        `http://127.0.0.1:3112/update/${selectedMeetingId}`,
        updatedData
      );
      if (response.data ) {
        toast.success('Update successful', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          console.log('Update success')
          setShowModal(false);
       
       
      } else {
       
        setShowModal(false);
        await fetchAllData(activePath);
      }
    } catch (error) {
     
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Error updating booking: " + error.message;
      setUpdateError(errorMessage);
    }
  };
 
  return (
    <div
          className={`modal fade ${showModal ? "show" : ""}`}
          style={{ display: showModal ? "block" : "none" }}
          tabIndex="-1"
          aria-labelledby="updateModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="updateModalLabel">
                  Update Meeting
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    setShowModal(false);
                    setUpdateError("");
                  }}
                 
                >
                  X
                </button>
              </div>
              <div className="modal-body">
                <form id="bookingForm">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="roomId">
                      Room
                    </label>
                    <select
                      id="roomId"
                      className="form-select"
                      name="roomId"
                      value={updateRoomId}
                      onChange={(e) => setUpdateRoomId(e.target.value)}
                    >
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
                      value={updateEmployeeId}
                      onChange={(e) => setUpdateEmployeeId(e.target.value)}
                    >
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
                      value={updateStartTime}
                      onChange={(e) => setUpdateStartTime(e.target.value)}
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
                      value={updateEndTime}
                      onChange={(e) => setUpdateEndTime(e.target.value)}
                    />
                  </div>
                  {updateError && (
                    <div style={{ color: "red" }}>{updateError}</div>
                  )}
                </form>
              </div>
              <div className="modal-footer">
              <button
                  type="button"
                  className="btn btn-close"
                  style={{ color: "black" }}
                  data-dismiss="modal"
                  onClick={() => {
                    setShowModal(false);
                    setUpdateError("");
                  }}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={update}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
  );
}

export default Update;



