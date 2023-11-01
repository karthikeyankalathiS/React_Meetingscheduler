import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import "./style.css";
import { useLocation } from 'react-router-dom';

function Home({  openUpdateModal }) {
    const itemsPerPage = 10;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const { pathname } = useLocation();

    useEffect(() => {
        fetchAllData('/home');
    }, []);


    async function fetchAllData(path) {
        try {
            const response = await axios.get(`http://127.0.0.1:3112${path}`);
            const datas = response.data.data;
            console.log(datas);
            setData(datas);
            setLoading(false);
            setCurrentPage(1);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    }

    function deleteFunction(meetingId) {
        if (window.confirm("Are you sure you want to delete this entry?")) {
            fetch(`http://127.0.0.1:3112/delete/${meetingId}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.ok) {
                        alert("Booking deleted successfully");
                        window.location.reload();
                    } else {
                        alert("Failed to delete booking");
                    }
                })
                .catch((error) => {
                    console.error("Error deleting booking:", error);
                    alert("Internal Server Error");
                });
        }
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsOnCurrentPage = data.slice(startIndex, endIndex);

    return (
        <div className="App">
            <Navbar />
            <div className="container mt-5">
                <h5 className="heading text-center text-white">MEETING <span style={{ color: "#0DF1DB" }}> DASHBOARD</span></h5>
                <div className="btn-group mb-3">
                    <button className={`btn btn-secondary ${pathname === '/home' ? 'active' : ''}`} onClick={() => fetchAllData('/home')}>
                        All
                    </button>
                    <button className={`btn btn-secondary ${pathname === '/today' ? 'active' : ''}`} onClick={() => fetchAllData('/today')}>
                        Today
                    </button>
                    <button className={`btn btn-secondary ${pathname === '/week' ? 'active' : ''}`} onClick={() => fetchAllData('/week')}>
                        Weekly
                    </button>
                    <button className={`btn btn-secondary ${pathname === '/month' ? 'active' : ''}`} onClick={() => fetchAllData('/month')}>
                        Monthly
                    </button>

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
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemsOnCurrentPage.length > 0 ? (
                                    itemsOnCurrentPage.map((item, index) => (
                                        <tr key={item.meetingId}>
                                            <td>{index + 1}</td>
                                            <td>{item.roomName}</td>
                                            <td>{item.employeeName}</td>
                                            <td>{new Date(item.startTime).toLocaleString()}</td>
                                            <td>{new Date(item.endTime).toLocaleString()}</td>
                                            <td>
                                                <div className="btn">
                                                {new Date(item.startTime) > new Date() && (
                                                    <button className="btn btn-primary" type="button" data-toggle="modal" onClick={() => openUpdateModal(item.meetingId)}>Update</button>
                                                )}
                                                <button className="btn btn-danger" onClick={() => deleteFunction(item.meetingId)}> Delete </button>
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
                            <button className="btn btn-primary"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Prev
                            </button>
                            <span style={{ color: "white" }}>Page {currentPage}</span>
                            <button className="btn btn-primary"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={itemsOnCurrentPage.length < itemsPerPage}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
