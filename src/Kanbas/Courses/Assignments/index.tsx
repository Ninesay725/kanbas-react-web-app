import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaSearch, FaEllipsisV, FaTrash } from 'react-icons/fa';
import { BsGripVertical } from 'react-icons/bs';
import GreenCheckmark from '../Modules/GreenCheckmark';
import { useDispatch, useSelector } from "react-redux";
import { deleteAssignment, setAssignments } from "./reducer";
import { isFaculty } from "../../utils/permissions";
import { formatDate } from "../../utils/dateUtils";
import * as client from "./client";

export default function Assignments() {
    const { cid } = useParams();
    const dispatch = useDispatch();
    const assignments = useSelector((state: any) => 
        state.assignmentsReducer.assignments
    );
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    const fetchAssignments = async () => {
        const assignments = await client.findAssignmentsForCourse(cid as string);
        dispatch(setAssignments(assignments));
    };

    useEffect(() => {
        fetchAssignments();
    }, [cid]);

    const handleDelete = async (assignmentId: string) => {
        if (window.confirm("Are you sure you want to delete this assignment?")) {
            try {
                await client.deleteAssignment(assignmentId);
                dispatch(deleteAssignment(assignmentId));
            } catch (error) {
                console.error("Error deleting assignment:", error);
            }
        }
    };

    return (
        <div className="container-fluid mt-4">
            {/* Search and Buttons */}
            <div className="row mb-3">
                <div className="col">
                    <div className="input-group">
                        <span className="input-group-text bg-white">
                            <FaSearch />
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0"
                            placeholder="Search for Assignment"
                        />
                    </div>
                </div>
                {isFaculty(currentUser) && (
                    <div className="col-auto">
                        <button className="btn btn-secondary me-2">+ Group</button>
                        <Link to={`/Kanbas/Courses/${cid}/Assignments/new`} className="btn btn-danger">
                            + Assignment
                        </Link>
                    </div>
                )}
            </div>

            {/* Card */}
            <div className="card">
                {/* Card Header */}
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <BsGripVertical className="me-2" />
                        <h5 className="mb-0">
                            <strong>ASSIGNMENTS</strong>
                        </h5>
                    </div>
                    <div className="d-flex align-items-center">
                        <span className="me-2 px-2 py-1 border border-dark rounded-pill">
                            40% of Total
                        </span>
                        <button className="btn btn-sm btn-light">+</button>
                        <button className="btn btn-sm btn-light ms-2">
                            <FaEllipsisV />
                        </button>
                    </div>
                </div>

                <ul className="list-group list-group-flush">
                    {assignments.map((assignment: any) => (
                        <li key={assignment._id} className="list-group-item position-relative p-0">
                            <div className="d-flex position-relative">
                                <div
                                    className="position-absolute border-start border-success border-5"
                                    style={{ left: 0, top: 0, bottom: 0 }}
                                ></div>
                                <div className="d-flex justify-content-between align-items-center w-100 ps-3 py-3">
                                    <div className="d-flex align-items-center">
                                        <BsGripVertical className="me-2" />
                                        <div>
                                            <h6 className="mb-0">
                                                <Link
                                                    to={`/Kanbas/Courses/${cid}/Assignments/${assignment._id}`}
                                                    className="assignment-link"
                                                >
                                                    <strong>{assignment.title}</strong>
                                                </Link>
                                            </h6>
                                            <small>
                                                <span className="text-danger">
                                                    <strong>{assignment.module || 'Multiple Modules'}</strong>
                                                </span>{' '}
                                                | <strong>Not available until</strong> {formatDate(assignment.availableFromDate)} |
                                                <br />
                                                <strong>Due</strong> {formatDate(assignment.dueDate)} | {assignment.points} pts
                                            </small>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        {isFaculty(currentUser) && (
                                            <>
                                                <span className="me-2">
                                                    <GreenCheckmark />
                                                </span>
                                                <button 
                                                    className="btn btn-sm btn-light"
                                                    onClick={() => handleDelete(assignment._id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
