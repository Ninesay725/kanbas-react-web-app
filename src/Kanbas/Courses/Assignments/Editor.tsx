import React from 'react';

export default function AssignmentEditor() {
    return (
        <div className="container mt-4">
            <h2 className="mb-4">Assignment Editor</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="wd-name" className="form-label">Assignment Name</label>
                    <input id="wd-name" className="form-control" value="A1 - ENV + HTML" />
                </div>

                <div className="mb-3">
                    <label htmlFor="wd-description" className="form-label">Description</label>
                    <textarea id="wd-description" className="form-control" rows={10}>
                        The assignment is available online
                        Submit a link to the landing page of your Web application running on Netlify.
                        The landing page should include the following:
                        • Your full name and section
                        • Links to each of the lab assignments
                        • A link to the Kanbas application
                        • Links to relevant source code repositories
                        The Kanbas application should include a link to navigate back to the landing page.
                    </textarea>
                </div>

                <div className="mb-3 row">
                    <label htmlFor="wd-points" className="col-sm-2 col-form-label">Points</label>
                    <div className="col-sm-10">
                        <input id="wd-points" type="number" className="form-control" value={100} />
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
                            <label htmlFor="wd-submission-type" className="col-sm-3 col-form-label">Submission
                                Type</label>
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
                                        <input type="checkbox" id="wd-website-url" className="form-check-input"
                                               checked/>
                                        <label htmlFor="wd-website-url" className="form-check-label">Website URL</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" id="wd-media-recordings" className="form-check-input"/>
                                        <label htmlFor="wd-media-recordings" className="form-check-label">Media
                                            Recordings</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" id="wd-student-annotation" className="form-check-input"/>
                                        <label htmlFor="wd-student-annotation" className="form-check-label">Student
                                            Annotation</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" id="wd-file-upload" className="form-check-input"/>
                                        <label htmlFor="wd-file-upload" className="form-check-label">File
                                            Uploads</label>
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
                                    <input type="datetime-local" id="wd-due-date" className="form-control"
                                           value="2024-05-13T23:59"/>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="wd-available-from" className="form-label">Available from</label>
                                        <input type="datetime-local" id="wd-available-from" className="form-control"
                                               value="2024-05-06T12:00"/>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="wd-available-until" className="form-label">Until</label>
                                        <input type="datetime-local" id="wd-available-until" className="form-control"
                                               value="2024-05-20T23:59"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="my-4"/>
                <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary">Cancel</button>
                    <button type="submit" className="btn btn-danger">Save</button>
                </div>
            </form>
        </div>
    );
}