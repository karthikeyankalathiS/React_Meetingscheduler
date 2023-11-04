import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchRooms, fetchEmployees } from "../Service/api";

const FilterForm = ({ applyFilter, setShowFilterWindow }) => {
    const [employeeId, setEmployeeId] = useState("");
    const [roomId, setRoomId] = useState("");
    const [employees, setEmployees] = useState([]);
    const [searchType, setSearchType] = useState("date");
    const [employeeValue, setEmployeeValue] = useState("");
    const [roomValue, setRoomValue] = useState("");
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState(""); // Add error state

    useEffect(() => {
        fetchRooms(setRooms);
        fetchEmployees(setEmployees);
    }, []);

    const resetState = () => {
        setEmployeeId("");
        setRoomId("");
        setEmployeeValue("");
        setRoomValue("");
        setError("");
    };

    const handleFilterSubmit = async (e) => {
        e.preventDefault();

        let payload = {};
        let endpoint = "http://127.0.0.1:3112/filteredData";

        if (searchType === "date") {
            const startDate = document.getElementById("startTime").value;
            const endDate = document.getElementById("endTime").value;

            if (new Date(startDate) > new Date(endDate)) {
                setError("End Date should be after Start Date");
                return;
            }

            payload = { startDate, endDate };
        } else if (searchType === "employeeId") {
            payload = { employeeId: employeeValue };
        } else if (searchType === "roomId") {
            const roomId = parseInt(roomValue, 10);
            payload = { roomId };
        }

        try {
            const response = await axios.post(endpoint, payload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            applyFilter(response.data);
            setShowFilterWindow(false);
            resetState(); // Reset the state after applying the filter
        } catch (error) {
            console.error("Error making axios request:", error.message);
        }
    };

    return (
        <div>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleFilterSubmit}>
                <div className="form-group">
                    <label htmlFor="filterType" style={{ color: "white" }}>
                        Search By:
                    </label>
                    <select
                        className="form-control"
                        id="filterType"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option value="date">Date</option>
                        <option value="employeeId">Employee ID</option>
                        <option value="roomId">Room ID</option>
                    </select>
                </div>
                {searchType === "date" ? (
                    <>
                        <div className="form-group">
                            <label htmlFor="startTime" style={{ color: "white" }}>
                                Start Date
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                id="startTime"
                                placeholder="Select start date"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="endTime" style={{ color: "white" }}>
                                End Date
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                id="endTime"
                                placeholder="Select end date"
                            />
                        </div>
                    </>
                ) : searchType === "roomId" ?  (
                    <div className="form-group">
                        <div className="mb-3">
                            <label className="form-label" style={{ color: "white" }} htmlFor="roomId">
                                Room
                            </label>
                            <select
                                id="roomId"
                                className="form-select"
                                name="roomId"
                                value={roomId}
                                onChange={(e) => {setRoomValue(e.target.value);setRoomId(e.target.value)}}
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
                    </div>
                ):(
                    <div className="form-group">
                        <div className="mb-3">
                            <label className="form-label" style={{ color: "white" }} htmlFor="employeeId">
                                Employee ID
                            </label>
                            <select
                                id="employeeId"
                                className="form-select"
                                name="employeeId"
                                value={employeeId}
                                onChange={(e) => {
                                    setEmployeeId(e.target.value);
                                    setEmployeeValue(e.target.value);
                                }}
                            >
                                <option value="" disabled>
                                    -- Select your Employee ID --
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
                    </div>
                )}

                <button type="submit" className="btn btn-primary">
                    Apply Filter
                </button>
            </form>
        </div>
    );
};

export default FilterForm;
