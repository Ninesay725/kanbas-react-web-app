import React from 'react';

export default function AssignmentEditor() {
    return (
        <div id="wd-assignments-editor">
            <div>
                <label htmlFor="wd-name">Assignment Name</label><br/>
                <input id="wd-name" value="A1 - ENV + HTML"/>
            </div>
            <div>
                <label htmlFor="wd-description">Description</label><br/>
                <textarea id="wd-description" rows={10} cols={50}>
The assignment is available online Submit a link to the landing page of your Web application running on Netlify. The landing page should include the following: Your full name and section Links to each of the lab assignments A link to the Kanbas application Links to relevant source code repositories The Kanbas application should include a link to navigate back to the landing page.
                </textarea>
            </div>
            <div>
                <label htmlFor="wd-points">Points</label><br/>
                <input id="wd-points" type="number" value={100}/>
            </div>
            <div>
                <label htmlFor="wd-group">Assignment Group</label><br/>
                <select id="wd-group">
                    <option>ASSIGNMENTS</option>
                </select>
            </div>
            <div>
                <label htmlFor="wd-display-grade-as">Display Grade as</label><br/>
                <select id="wd-display-grade-as">
                    <option>Percentage</option>
                </select>
            </div>
            <div>
                <label htmlFor="wd-submission-type">Submission Type</label><br/>
                <select id="wd-submission-type">
                    <option>Online</option>
                </select>
            </div>
            <div>
                <h4>Online Entry Options</h4>
                <input type="checkbox" id="wd-text-entry"/>
                <label htmlFor="wd-text-entry">Text Entry</label><br/>
                <input type="checkbox" id="wd-website-url"/>
                <label htmlFor="wd-website-url">Website URL</label><br/>
                <input type="checkbox" id="wd-media-recordings"/>
                <label htmlFor="wd-media-recordings">Media Recordings</label><br/>
                <input type="checkbox" id="wd-student-annotation"/>
                <label htmlFor="wd-student-annotation">Student Annotation</label><br/>
                <input type="checkbox" id="wd-file-upload"/>
                <label htmlFor="wd-file-upload">File Uploads</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ width: '80px' }}>Assign</div>
                <div style={{ flex: 1 }}>
                    <label htmlFor="wd-assign-to">Assign to</label><br />
                    <input id="wd-assign-to" value="Everyone" style={{ width: '100%' }} />
                </div>
            </div>

            <div style={{ marginLeft: '80px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="wd-due-date">Due</label><br />
                    <input type="date" id="wd-due-date" value="2024-05-13" style={{ width: '100%' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ width: '48%' }}>
                        <label htmlFor="wd-available-from">Available from</label><br />
                        <input type="date" id="wd-available-from" value="2024-05-06" style={{ width: '100%' }} />
                    </div>
                    <div style={{ width: '48%' }}>
                        <label htmlFor="wd-available-until">Until</label><br />
                        <input type="date" id="wd-available-until" value="2024-05-20" style={{ width: '100%' }} />
                    </div>
                </div>
            </div>

            <hr style={{ margin: '20px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button>Cancel</button>
                <button>Save</button>
            </div>
        </div>
    );
}