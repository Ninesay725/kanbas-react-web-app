import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addAssignment, updateAssignment } from './reducer';
import { formatDate, formatDateForInput } from "../../utils/dateUtils";
import * as client from "./client";

export default function AssignmentEditor() {
    const { cid, aid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [assignment, setAssignment] = useState({
        title: "",
        description: "",
        points: 100,
        dueDate: "",
        availableFromDate: "",
        availableUntilDate: "",
        course: cid,
    });

    const existingAssignment = useSelector((state: any) =>
        state.assignmentsReducer.assignments.find((a: any) => a._id === aid)
    );

    useEffect(() => {
        if (aid !== "new" && existingAssignment) {
            setAssignment(existingAssignment);
        }
    }, [aid, existingAssignment]);

    const handleSave = async () => {
        try {
            if (aid === "new") {
                const newAssignment = await client.createAssignment(cid as string, assignment);
                dispatch(addAssignment(newAssignment));
            } else {
                // Editing existing assignment
                await client.updateAssignment({ ...assignment, _id: aid });
                dispatch(updateAssignment({ ...assignment, _id: aid }));
            }
            navigate(`/Kanbas/Courses/${cid}/Assignments`);
        } catch (error) {
            console.error("Error saving assignment:", error);
        }
    };

    const handleCancel = () => {
        navigate(`/Kanbas/Courses/${cid}/Assignments`);
    };

    const handleDateChange = (field: string, value: string) => {
        if (!value) {
            setAssignment({
                ...assignment,
                [field]: ""
            });
            return;
        }
        // Create date object in local timezone
        const date = new Date(value);
        // Convert to ISO string but keep the local time
        const isoString = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes()
        ).toISOString();

        setAssignment({
            ...assignment,
            [field]: isoString
        });
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Assignment Editor</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="wd-name" className="form-label">Assignment Name</label>
                    <input
                        id="wd-name"
                        className="form-control"
                        value={assignment.title}
                        onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="wd-description" className="form-label">Description</label>
                    <textarea
                        id="wd-description"
                        className="form-control"
                        rows={10}
                        value={assignment.description || ''}
                        onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
                    >
                    </textarea>
                </div>

                <div className="mb-3 row">
                    <label htmlFor="wd-points" className="col-sm-2 col-form-label">Points</label>
                    <div className="col-sm-10">
                        <input
                            id="wd-points"
                            type="number"
                            className="form-control"
                            value={assignment.points}
                            onChange={(e) => setAssignment({ ...assignment, points: parseInt(e.target.value) })}
                        />
                    </div>
                </div>

                <div className="mb-3 row">
                    <label htmlFor="wd-group" className="col-sm-2 col-form-label">Assignment Group</label>
                    <div className="col-sm-10">
                        <select id="wd-group" className="form-select">
                            <option>ASSIGNMENTS</option>
                        </select>
                    </div>
                </div>

                <div className="mb-3 row">
                    <label htmlFor="wd-display-grade-as" className="col-sm-2 col-form-label">Display Grade as</label>
                    <div className="col-sm-10">
                        <select id="wd-display-grade-as" className="form-select">
                            <option>Percentage</option>
                        </select>
                    </div>
                </div>

                <div className="card mb-3">
                    <div className="card-body">
                        <div className="mb-3 row">
                            <label htmlFor="wd-submission-type" className="col-sm-3 col-form-label">Submission Type</label>
                            <div className="col-sm-9">
                                <select id="wd-submission-type" className="form-select mb-3">
                                    <option>Online</option>
                                </select>

                                <div className="mb-3">
                                    <h5>Online Entry Options</h5>
                                    <div className="form-check">
                                        <input type="checkbox" id="wd-text-entry" className="form-check-input"/>
                                        <label htmlFor="wd-text-entry" className="form-check-label">Text Entry</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" id="wd-website-url" className="form-check-input" checked/>
                                        <label htmlFor="wd-website-url" className="form-check-label">Website URL</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" id="wd-media-recordings" className="form-check-input"/>
                                        <label htmlFor="wd-media-recordings" className="form-check-label">Media Recordings</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" id="wd-student-annotation" className="form-check-input"/>
                                        <label htmlFor="wd-student-annotation" className="form-check-label">Student Annotation</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" id="wd-file-upload" className="form-check-input"/>
                                        <label htmlFor="wd-file-upload" className="form-check-label">File Uploads</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mb-3">
                    <div className="card-body">
                        <div className="row">
                            <label className="col-sm-3 col-form-label">Assign</label>
                            <div className="col-sm-9">
                                <div className="mb-3">
                                    <label htmlFor="wd-assign-to" className="form-label">Assign to</label>
                                    <input id="wd-assign-to" className="form-control" value="Everyone"/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="wd-due-date" className="form-label">Due</label>
                                    <input 
                                        type="datetime-local" 
                                        id="wd-due-date" 
                                        className="form-control" 
                                        value={formatDateForInput(assignment.dueDate)}
                                        onChange={(e) => handleDateChange('dueDate', e.target.value)}
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="wd-available-from" className="form-label">Available from</label>
                                        <input 
                                            type="datetime-local" 
                                            id="wd-available-from" 
                                            className="form-control" 
                                            value={formatDateForInput(assignment.availableFromDate)}
                                            onChange={(e) => handleDateChange('availableFromDate', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="wd-available-until" className="form-label">Until</label>
                                        <input 
                                            type="datetime-local" 
                                            id="wd-available-until" 
                                            className="form-control" 
                                            value={formatDateForInput(assignment.availableUntilDate)}
                                            onChange={(e) => handleDateChange('availableUntilDate', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="my-4"/>
                <div className="d-flex justify-content-end gap-2">
                    <button onClick={handleCancel} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="btn btn-danger">
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
