import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import "./style.css";

function Month({ currentPath, openUpdateModal, deleteFunction }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        fetchAllData();
    }, []);

    async function fetchAllData() {
        try {
            const response = await axios.get('http://127.0.0.1:3112/month');
            const datas = response.data.data;
            console.log(datas);
            setData(datas);
            setLoading(false); 
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false); 
        }
    }

    return (
        <div className="App">
            <Navbar />
            <div className="container mt-5">
                <h5 className="heading text-center text-white">MEETING <span style={{ color: "#0DF1DB" }}> DASHBOARD</span></h5>
                <div className="btn-group mb-3">
                    <a href="/today" className={`btn btn-secondary${currentPath === '/today' ? ' active' : ''}`}>Today</a>
                    <a href="/week" className={`btn btn-secondary${currentPath === '/week' ? ' active' : ''}`}>Weekly</a>
                    <a href="/month" className={`btn btn-secondary${currentPath === '/month' ? ' active' : ''}`}>Monthly</a>
                </div>
                {loading ? ( 
                    <p>Loading...</p>
                ) : (
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
                            {data.length > 0 ? (
                                data.map((item, index) => (                                    
                                    <tr key={item.meetingId}>
                                        <td>{index + 1}</td>
                                        <td>{item.roomName}</td>
                                        <td>{item.employeeName}</td>
                                        <td>{new Date(item.startTime).toLocaleString()}</td>
                                        <td>{new Date(item.endTime).toLocaleString()}</td>
                                        <td>
                                            {new Date(item.startTime) > new Date() && (
                                                <button
                                                    className="btn btn-primary"
                                                    type="button"
                                                    data-toggle="modal"
                                                    onClick={() => openUpdateModal(item.meetingId)}
                                                >
                                                    Update
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => deleteFunction(item.meetingId)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No records found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Month;
