import React from 'react';
import { Link, useLocation } from "react-router-dom";

export default function CoursesNavigation() {
    const { pathname } = useLocation();

    const isActive = (path: string): boolean => pathname.includes(path);

    const getLinkClass = (path: string): string => `
        list-group-item border border-0
        ${isActive(path) ? "active" : "text-danger"}
    `;

    return (
        <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
            <Link to="/Kanbas/Courses/1234/Home" id="wd-course-home-link"
                  className={getLinkClass("/Home")}>
                Home
            </Link>
            <Link to="/Kanbas/Courses/1234/Modules" id="wd-course-modules-link"
                  className={getLinkClass("/Modules")}>
                Modules
            </Link>
            <Link to="/Kanbas/Courses/1234/Piazza" id="wd-course-piazza-link"
                  className={getLinkClass("/Piazza")}>
                Piazza
            </Link>
            <Link to="/Kanbas/Courses/1234/Zoom" id="wd-course-zoom-link"
                  className={getLinkClass("/Zoom")}>
                Zoom
            </Link>
            <Link to="/Kanbas/Courses/1234/Assignments" id="wd-course-assignments-link"
                  className={getLinkClass("/Assignments")}>
                Assignments
            </Link>
            <Link to="/Kanbas/Courses/1234/Quizzes" id="wd-course-quizzes-link"
                  className={getLinkClass("/Quizzes")}>
                Quizzes
            </Link>
            <Link to="/Kanbas/Courses/1234/People" id="wd-course-people-link"
                  className={getLinkClass("/People")}>
                People
            </Link>
        </div>
    );
}