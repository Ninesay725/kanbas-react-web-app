import React from 'react';
import { FaSearch, FaEllipsisV } from 'react-icons/fa';
import { BsGripVertical } from 'react-icons/bs';
import GreenCheckmark from '../Modules/GreenCheckmark';

export default function Assignments() {
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
                <div className="col-auto">
                    <button className="btn btn-secondary me-2">+ Group</button>
                    <button className="btn btn-danger">+ Assignment</button>
                </div>
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
                    {/* A1 */}
                    <li className="list-group-item position-relative p-0">
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
                                            <a
                                                href="#/Kanbas/Courses/1234/Assignments/123"
                                                className="assignment-link"
                                            >
                                                <strong>A1 - ENV + HTML</strong>
                                            </a>
                                        </h6>
                                        <small>
                      <span className="text-danger">
                        <strong>Multiple Modules</strong>
                      </span>{' '}
                                            | <strong>Not available until</strong> May 6 at 12:00am |
                                            <br />
                                            <strong>Due</strong> May 13 at 11:59pm | 100 pts
                                        </small>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                  <span className="me-2">
                    <GreenCheckmark />
                  </span>
                                    <FaEllipsisV />
                                </div>
                            </div>
                        </div>
                    </li>

                    {/* A2 */}
                    <li className="list-group-item position-relative p-0">
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
                                            <a
                                                href="#/Kanbas/Courses/1234/Assignments/124"
                                                className="assignment-link"
                                            >
                                                <strong>A2 - CSS + BOOTSTRAP</strong>
                                            </a>
                                        </h6>
                                        <small>
                      <span className="text-danger">
                        <strong>Multiple Modules</strong>
                      </span>{' '}
                                            | <strong>Not available until</strong> May 13 at 12:00am |
                                            <br />
                                            <strong>Due</strong> May 20 at 11:59pm | 100 pts
                                        </small>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                  <span className="me-2">
                    <GreenCheckmark />
                  </span>
                                    <FaEllipsisV />
                                </div>
                            </div>
                        </div>
                    </li>

                    {/* A3 */}
                    <li className="list-group-item position-relative p-0">
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
                                            <a
                                                href="#/Kanbas/Courses/1234/Assignments/125"
                                                className="assignment-link"
                                            >
                                                <strong>A3 - JAVASCRIPT + REACT</strong>
                                            </a>
                                        </h6>
                                        <small>
                      <span className="text-danger">
                        <strong>Multiple Modules</strong>
                      </span>{' '}
                                            | <strong>Not available until</strong> May 20 at 12:00am |
                                            <br />
                                            <strong>Due</strong> May 27 at 11:59pm | 100 pts
                                        </small>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                  <span className="me-2">
                                    <GreenCheckmark />
                                  </span>
                                    <FaEllipsisV />
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}
