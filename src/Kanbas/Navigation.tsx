import React from 'react';
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";

export default function KanbasNavigation() {
    const { pathname } = useLocation();

    const isActive = (path: string): boolean => pathname.includes(path);

    const getLinkClass = (path: string): string => `
        list-group-item text-center border-0
        ${isActive(path) ? "bg-white text-danger" : "bg-black text-white"}
    `;

    const getIconClass = (path: string): string => `
        fs-1 ${isActive(path) ? "text-danger" : "text-danger"}
    `;

    return (
        <div id="wd-kanbas-navigation" style={{ width: 120 }}
             className="list-group rounded-0 position-fixed
                        bottom-0 top-0 d-none d-md-block bg-black z-2">
            <a id="wd-neu-link" target="_blank"
               href="https://www.northeastern.edu/"
               className="list-group-item bg-black border-0 text-center">
                <img src="/images/NEU.png" width="75px" alt="NEU Logo" />
            </a>
            <Link to="/Kanbas/Account" id="wd-account-link"
                  className={getLinkClass("/Account")}>
                <FaRegCircleUser className={getIconClass("/Account")} /><br />
                Account
            </Link>
            <Link to="/Kanbas/Dashboard" id="wd-dashboard-link"
                  className={getLinkClass("/Dashboard")}>
                <AiOutlineDashboard className={getIconClass("/Dashboard")} /><br />
                Dashboard
            </Link>
            <Link to="/Kanbas/Courses" id="wd-course-link"
                  className={getLinkClass("/Courses")}>
                <LiaBookSolid className={getIconClass("/Courses")} /><br />
                Courses
            </Link>
            <Link to="/Kanbas/Calendar" id="wd-calendar-link"
                  className={getLinkClass("/Calendar")}>
                <IoCalendarOutline className={getIconClass("/Calendar")} /><br />
                Calendar
            </Link>
            <Link to="/Kanbas/Inbox" id="wd-inbox-link"
                  className={getLinkClass("/Inbox")}>
                <FaInbox className={getIconClass("/Inbox")} /><br />
                Inbox
            </Link>
            <Link to="/Kanbas/Labs" id="wd-labs-link"
                  className={getLinkClass("/Labs")}>
                <LiaCogSolid className={getIconClass("/Labs")} /><br />
                Labs
            </Link>
        </div>
    );
}