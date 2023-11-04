import React, { useState } from 'react';
import './style.css';

const FilterForm = ({ applyFilter, setShowFilterWindow }) => {
    const [searchType, setSearchType] = useState('date');
    const [searchValue, setSearchValue] = useState('');

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        if (searchType === 'date') {
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            applyFilter(startDate, endDate);
        } else {
            // Handle employee ID search
            applyFilter(searchValue);
        }
    };

    return (
        <form>
            <div className="form-group">
                <label htmlFor="filterType">Search By:</label>
                <select
                    className="form-control"
                    id="filterType"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                >
                    <option value="date">Date</option>
                    <option value="employee">Employee ID</option>
                </select>
            </div>
            {searchType === 'date' ? (
                <>
                    <div className="form-group">
                        <label htmlFor="startDate">Start Date</label>
                        <input
                            type="date"
                            className="form-control"
                            id="startDate"
                            placeholder="Select start date"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="endDate">End Date</label>
                        <input
                            type="date"
                            className="form-control"
                            id="endDate"
                            placeholder="Select end date"
                        />
                    </div>
                </>
            ) : (
                <div className="form-group">
                    <label htmlFor="employeeId">Employee ID</label>
                    <input
                        type="text"
                        className="form-control"
                        id="employeeId"
                        placeholder="Enter employee ID"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>
            )}
            <button
                type="submit"
                className="btn btn-primary"
                onClick={() => {
                    handleFilterSubmit();
                    setShowFilterWindow(false);
                }}
            >
                Apply Filter
            </button>
        </form>
    );
};

export default FilterForm;
