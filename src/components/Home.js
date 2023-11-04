import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import "./style.css";
import Update from "./Update";
import { fetchRooms, fetchEmployees } from "../Service/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from "react-router-dom";
import FilterForm from "./FilterForm";

function Home() {
    const itemsPerPage = 10;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedMeetingId, setSelectedMeetingId] = useState(null);
    const [activePath, setActivePath] = useState('/home');
    const [updateRoomId, setUpdateRoomId] = useState("");
    const [updateStartTime, setUpdateStartTime] = useState("");
    const [updateEndTime, setUpdateEndTime] = useState("");
    const [updateEmployeeId, setUpdateEmployeeId] = useState("");
    const [updateError, setUpdateError] = useState("");
    const [showFilterWindow, setShowFilterWindow] = useState(false);
    

    const fetchAllData = async (path) => {
        try {
            const response = await axios.get(`http://127.0.0.1:3112${path}`);
            const datas = response.data.data;
            console.log(datas);
            setData(datas);
            setLoading(false);
            setCurrentPage(1);
            setActivePath(path);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    }

    async function getMeetingById(meetingId) {
        try {
            const response = await axios.get(`http://127.0.0.1:3112/getMeeting/${meetingId}`);
            if (response.status === 200) {
                const data = response.data;
                console.log('In Function getMeetingById : ', data);
                return data;
            } else {
                console.error('Failed to fetch meeting with status code: ', response.status);
                return null;
            }
        } catch (error) {
            console.error('Error fetching meeting: ', error);
            return null;
        }
    }


    let currentMeetingId = null;
    const updateButtonClick = async (meetingId) => {
        currentMeetingId = meetingId;
        const meeting = await getMeetingById(meetingId);
        await fetchRooms();
        await fetchEmployees();
        setUpdateEmployeeId(meeting.data.employeeId)
        setUpdateRoomId(meeting.data.roomId)
        setUpdateStartTime(meeting.data.startTime)
        setUpdateEndTime(meeting.data.endTime)
        console.log(meeting.data._id)

        setSelectedMeetingId(meetingId);
        setShowModal(true);
    };

    const deleteFunction = async (meetingId) => {
        if (window.confirm("Are you sure you want to delete this entry?")) {
            try {
                const response = await axios.delete(
                    `http://127.0.0.1:3112/delete/${meetingId}`
                );

                if (response.status === 200) {
                    toast.success('Deleted successfully', {
                        position: "top-center",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    await fetchAllData(activePath);
                } else {
                    alert("Failed to delete booking");
                }
            } catch (error) {
                console.error("Error deleting booking:", error);
                alert("Internal Server Error");
            }
        }
    };

    const toggleFilterWindow = () => {
        setShowFilterWindow(!showFilterWindow);
    };
    const applyFilter = (startDate, endDate, employeeId) => {
        if (startDate && endDate) {
            console.log('Selected start date:', startDate);
            console.log('Selected end date:', endDate);
        } else if (employeeId) {
            console.log('Selected end employeeid:',employeeId);
        }
    };
  
    

    const location = useLocation();
    useEffect(() => {

        fetchAllData("/home");
        if (location.state && location.state.message) {
            toast[location.state.type](location.state.message, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            location.state = {};
        }
    }, [location]);



    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsOnCurrentPage = data.slice(startIndex, endIndex);

    return (
        <div className="App">
            <Navbar />
            <ToastContainer />
            <div className="container mt-5">
                <h5 className="heading text-center text-white">MEETING <span style={{ color: "#0DF1DB" }}> DASHBOARD</span></h5>
                <div className="btn-group mb-3">
                    <button
                        className="fas fa-filter"
                        style={{
                            fontSize: "24px",
                            color: "rgb(13, 241, 219)",
                            border: "none",
                            background: "transparent",
                        }}
                        onClick={toggleFilterWindow}
                    ></button>
                </div>

                <div className={`filter-window ${showFilterWindow ? 'open' : ''}`}>
                    <button
                        type="button"
                        className="btn-close-home"
                        data-dismiss="modal"
                        aria-label="Close"
                        style={{ color: "white" }}
                        onClick={() => {
                            setShowFilterWindow(false);
                        }}

                    >
                        X
                    </button>
                    <div className="btn-group mb-3">
                        <button className={`btn btn-secondary ${activePath === '/home' ? 'active' : ''}`} onClick={() => { fetchAllData('/home'); setShowFilterWindow(false) }}>
                            All
                        </button>
                        <button className={`btn btn-secondary ${activePath === '/today' ? 'active' : ''}`} onClick={() => { fetchAllData('/today'); setShowFilterWindow(false) }}>
                            Today
                        </button>
                        <button className={`btn btn-secondary ${activePath === '/week' ? 'active' : ''}`} onClick={() => { fetchAllData('/week'); setShowFilterWindow(false) }}>
                            Weekly
                        </button>
                        <button className={`btn btn-secondary ${activePath === '/month' ? 'active' : ''}`} onClick={() => { fetchAllData('/month'); setShowFilterWindow(false) }}>
                            Monthly
                        </button>
                    </div>
                <FilterForm applyFilter={applyFilter} setShowFilterWindow={setShowFilterWindow} />
                </div>


                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                        <table className="table table-dark">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Room Name</th>
                                    <th>Organizer Name</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th id="action">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemsOnCurrentPage.length > 0 ? (
                                    itemsOnCurrentPage.map((item, index) => (
                                        <tr key={item.meetingId}>
                                            <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                            <td>{item.roomName}</td>
                                            <td>{item.employeeName}</td>
                                            <td>{new Date(item.startTime).toLocaleString()}</td>
                                            <td>{new Date(item.endTime).toLocaleString()}</td>
                                            <td>
                                                <div className="btn">
                                                    {new Date(item.startTime) > new Date() && (
                                                        <button className="fa fa-edit" style={{ fontSize: "24px", color: "white", border: "none", background: "transparent" }} type="button" data-toggle="modal" onClick={() => updateButtonClick(item.meetingId)}></button>
                                                    )}
                                                    <button class="fa fa-trash" style={{ fontSize: "24px", color: "red", border: "none", background: "transparent" }} onClick={() => deleteFunction(item.meetingId)}>  </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: "center" }}>No records found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="pagination-controls">
                            <button className="fa fa-angle-double-left" style={{ fontSize: "24px", color: "rgb(13, 241, 219)", border: "none", background: "transparent" }}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                hidden={currentPage === 1}
                            >
                            </button>
                            <span style={{ color: "white" }}>Page {currentPage}</span>
                            <button className="fa fa-angle-double-right" style={{ fontSize: "24px", color: "rgb(13, 241, 219)", border: "none", background: "transparent" }}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                hidden={itemsOnCurrentPage.length < itemsPerPage}
                            >
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {showModal && <Update showModal={showModal} setShowModal={setShowModal} fetchAllData={fetchAllData} selectedMeetingId={selectedMeetingId} activePath={activePath} updateRoomId={updateRoomId} updateStartTime={updateStartTime}
                updateEndTime={updateEndTime} updateEmployeeId={updateEmployeeId} updateError={updateError} setUpdateEmployeeId={setUpdateEmployeeId} setUpdateRoomId={setUpdateRoomId} setUpdateStartTime={setUpdateStartTime} setUpdateEndTime={setUpdateEndTime} setUpdateError={setUpdateError} />}
        </div>

    );

}


export default Home;

















