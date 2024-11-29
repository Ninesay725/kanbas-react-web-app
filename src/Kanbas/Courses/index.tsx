import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useParams, useLocation } from "react-router-dom";
import { FaAlignJustify } from "react-icons/fa";
import CoursesNavigation from "./Navigation";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import PeopleTable from "./People/Table";
import QuizList from "./Quizzes";
import QuizEditor from "./Quizzes/Editor";
import * as client from "./client";

export default function Courses({ courses }: { courses: any[]; }) {
    const { cid } = useParams();
    const course = courses.find((course) => course._id === cid);
    const { pathname } = useLocation();
    const [users, setUsers] = useState<any[]>([]);

    const fetchUsers = async () => {
        if (cid) {
            try {
                const users = await client.findUsersForCourse(cid);
                setUsers(users);
            } catch (error) {
                console.error("Error fetching users:", error);
                setUsers([]);
            }
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [cid]);

    return (
        <div id="wd-courses">
            <h2 className="text-danger">
                <FaAlignJustify className="me-3 fs-4 mb-1" />
                {course && course.name} &gt; {pathname.split("/")[4]}
            </h2>
            <hr/>
            <div className="d-flex">
                <div className="d-none d-md-block">
                    <CoursesNavigation/>
                </div>
                <div className="flex-fill">
                    <Routes>
                        <Route path="/" element={<Navigate to="Home"/>}/>
                        <Route path="Home" element={<Home/>}/>
                        <Route path="Modules" element={<Modules/>}/>
                        <Route path="Assignments" element={<Assignments/>}/>
                        <Route path="Assignments/:aid" element={<AssignmentEditor/>}/>
                        <Route path="People" element={<PeopleTable users={users} />} />
                        <Route path="Quizzes" element={<QuizList />} />
                        <Route path="Quizzes/:qid" element={<QuizEditor />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
