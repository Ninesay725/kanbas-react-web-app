import React, { useState } from "react";

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;

export default function WorkingWithObjects() {
    const [assignment, setAssignment] = useState({
        id: 1,
        title: "NodeJS Assignment",
        description: "Create a NodeJS server with ExpressJS",
        due: "2021-10-10",
        completed: false,
        score: 0,
    });

    const [module, setModule] = useState({
        id: "123",
        name: "Web Development",
        description: "Full stack web development with MERN stack",
        course: "CS5610"
    });

    const ASSIGNMENT_API_URL = `${REMOTE_SERVER}/lab5/assignment`;
    const MODULE_API_URL = `${REMOTE_SERVER}/lab5/module`;

    return (
        <div>
            <h3 id="wd-working-with-objects">Working With Objects</h3>
            
            {/* Assignment Section */}
            <h4>Assignment</h4>
            <h5>Retrieving Objects</h5>
            <a id="wd-retrieve-assignments" 
                className="btn btn-primary me-2"
                href={`${ASSIGNMENT_API_URL}`}>
                Get Assignment
            </a>
            <a id="wd-retrieve-assignment-title" 
                className="btn btn-primary"
                href={`${ASSIGNMENT_API_URL}/title`}>
                Get Title
            </a>
            <hr/>

            <h5>Modifying Properties</h5>
            <div className="mb-2">
                <label>Title</label>
                <input className="form-control w-75" 
                    id="wd-assignment-title"
                    value={assignment.title} 
                    onChange={(e) => setAssignment({ 
                        ...assignment, 
                        title: e.target.value 
                    })}
                />
                <a id="wd-update-assignment-title"
                    className="btn btn-success mt-2"
                    href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}>
                    Update Title
                </a>
            </div>

            <div className="mb-2">
                <label>Score</label>
                <input type="number" 
                    className="form-control w-75"
                    id="wd-assignment-score"
                    value={assignment.score}
                    onChange={(e) => setAssignment({
                        ...assignment,
                        score: parseInt(e.target.value)
                    })}
                />
                <a id="wd-update-assignment-score"
                    className="btn btn-success mt-2"
                    href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}>
                    Update Score
                </a>
            </div>

            <div className="mb-2">
                <label>
                    <input type="checkbox"
                        className="me-2"
                        id="wd-assignment-completed"
                        checked={assignment.completed}
                        onChange={(e) => setAssignment({
                            ...assignment,
                            completed: e.target.checked
                        })}
                    />
                    Completed
                </label>
                <br/>
                <a id="wd-update-assignment-completed"
                    className="btn btn-success mt-2"
                    href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}>
                    Update Completed
                </a>
            </div>
            <hr/>

            {/* Module Section */}
            <h4>Module</h4>
            <h5>Retrieving Objects</h5>
            <a id="wd-retrieve-module"
                className="btn btn-primary me-2"
                href={`${MODULE_API_URL}`}>
                Get Module
            </a>
            <a id="wd-retrieve-module-name"
                className="btn btn-primary"
                href={`${MODULE_API_URL}/name`}>
                Get Module Name
            </a>
            <hr/>

            <h5>Modifying Properties</h5>
            <div className="mb-2">
                <label>Module Name</label>
                <input className="form-control w-75"
                    id="wd-module-name"
                    value={module.name}
                    onChange={(e) => setModule({
                        ...module,
                        name: e.target.value
                    })}
                />
                <a id="wd-update-module-name"
                    className="btn btn-success mt-2"
                    href={`${MODULE_API_URL}/name/${module.name}`}>
                    Update Name
                </a>
            </div>

            <div className="mb-2">
                <label>Module Description</label>
                <input className="form-control w-75"
                    id="wd-module-description"
                    value={module.description}
                    onChange={(e) => setModule({
                        ...module,
                        description: e.target.value
                    })}
                />
                <a id="wd-update-module-description"
                    className="btn btn-success mt-2"
                    href={`${MODULE_API_URL}/description/${module.description}`}>
                    Update Description
                </a>
            </div>
            <hr/>
        </div>
    );
} 