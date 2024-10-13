import React from 'react';
import { Link, useParams, useLocation } from "react-router-dom";

export default function CoursesNavigation() {
    const { cid } = useParams();
    const { pathname } = useLocation();
    const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];

    const isActive = (link: string): boolean => pathname.includes(link);

    return (
        <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
            {links.map((link) => (
                <Link
                    key={link}
                    to={`/Kanbas/Courses/${cid}/${link}`}
                    id={`wd-course-${link.toLowerCase()}-link`}
                    className={`list-group-item border border-0 ${isActive(link) ? "active" : "text-danger"}`}
                >
                    {link}
                </Link>
            ))}
        </div>
    );
}
