import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as db from "./Database";
import { isFaculty } from "./utils/permissions";
import { toggleShowAllCourses, enroll, unenroll } from "./Courses/Enrollments/reducer";

export default function Dashboard(
    { courses, course, setCourse, addNewCourse, deleteCourse, updateCourse }: {
        courses: any[];
        course: any;
        setCourse: (course: any) => void;
        addNewCourse: () => void;
        deleteCourse: (course: any) => void;
        updateCourse: () => void;
    }
) {
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { enrollments, showAllCourses } = useSelector((state: any) => state.enrollmentsReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isEnrolled = (courseId: string) => {
        return enrollments.some(
            (enrollment: any) => 
                enrollment.user === currentUser._id &&
                enrollment.course === courseId
        );
    };

    const handleEnrollToggle = (courseId: string) => {
        if (isEnrolled(courseId)) {
            dispatch(unenroll({ studentId: currentUser._id, courseId }));
        } else {
            dispatch(enroll({ studentId: currentUser._id, courseId }));
        }
    };

    const displayedCourses = showAllCourses 
        ? courses 
        : courses.filter(course => isEnrolled(course._id));

    // Reset course state after adding a new course
    const handleAddNewCourse = () => {
        addNewCourse();
        setCourse({
            _id: "1234", 
            name: "New Course", 
            number: "New Number",
            startDate: "2023-09-10", 
            endDate: "2023-12-15", 
            description: "New Description",
        });
    };

    useEffect(() => {}, [course]);

    return (
        <div id="wd-dashboard">
            <div className="d-flex justify-content-between align-items-center">
                <h1 id="wd-dashboard-title">Dashboard</h1>
                {currentUser?.role === "STUDENT" && (
                    <button 
                        className="btn btn-primary"
                        onClick={() => dispatch(toggleShowAllCourses())}
                    >
                        {showAllCourses ? "Show My Courses" : "Show All Courses"}
                    </button>
                )}
            </div>
            <hr />
            {isFaculty(currentUser) && (
                <>
                    <h5>New Course
                        <button className="btn btn-primary float-end"
                            id="wd-add-new-course-click"
                            onClick={handleAddNewCourse}>
                            Add
                        </button>
                        <button className="btn btn-warning float-end me-2"
                            onClick={updateCourse} 
                            id="wd-update-course-click">
                            Update
                        </button>
                    </h5>
                    <br />
                    <input value={course.name} className="form-control mb-2"
                        onChange={(e) => setCourse({ ...course, name: e.target.value })} />
                    <textarea value={course.description} className="form-control"
                        onChange={(e) => setCourse({ ...course, description: e.target.value })} />
                </>
            )}
            <h2 id="wd-dashboard-published">
                {showAllCourses ? "All Courses" : "My Courses"} ({displayedCourses.length})
            </h2>
            <hr />

            <div id="wd-dashboard-courses" className="row">
                <div className="row row-cols-1 row-cols-md-5 g-4">
                    {displayedCourses.map((course) => ( 
                        <div key={course._id} className="wd-dashboard-course col" style={{ width: "300px" }}>
                            <div className="card rounded-3 overflow-hidden">
                                <div 
                                    onClick={() => {
                                        if (isEnrolled(course._id) || isFaculty(currentUser)) {
                                            navigate(`/Kanbas/Courses/${course._id}/Home`);
                                        }
                                    }}
                                    style={{ cursor: isEnrolled(course._id) || isFaculty(currentUser) ? 'pointer' : 'default' }}
                                >
                                    <img src={course.image || "/images/default-course.jpg"} 
                                        width="100%" height={160} 
                                        alt={course.name} 
                                        style={{objectFit: "cover"}}
                                    />
                                    <div className="card-body">
                                        <h5 className="wd-dashboard-course-title card-title">
                                            {course.name}
                                        </h5>
                                        <p className="wd-dashboard-course-title card-text overflow-y-hidden" style={{ maxHeight: 100 }}>
                                            {course.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    {currentUser?.role === "STUDENT" ? (
                                        isEnrolled(course._id) ? (
                                            <div className="d-flex">
                                                <button 
                                                    onClick={() => {
                                                        if (isEnrolled(course._id)) {
                                                            navigate(`/Kanbas/Courses/${course._id}/Home`);
                                                        }
                                                    }}
                                                    className="btn btn-primary me-1"
                                                    style={{ width: '60px' }}
                                                >
                                                    Go
                                                </button>
                                                <button 
                                                    onClick={() => handleEnrollToggle(course._id)}
                                                    className="btn btn-danger flex-grow-1"
                                                >
                                                    Unenroll
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => handleEnrollToggle(course._id)}
                                                className="btn btn-success w-100"
                                            >
                                                Enroll
                                            </button>
                                        )
                                    ) : isFaculty(currentUser) && (
                                        <div className="d-flex">
                                            <button 
                                                onClick={() => navigate(`/Kanbas/Courses/${course._id}/Home`)}
                                                className="btn btn-primary me-1"
                                                style={{ width: '60px' }}
                                            >
                                                Go
                                            </button>
                                            <div className="flex-grow-1 text-end">
                                                <button id="wd-edit-course-click"
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        setCourse(course);
                                                    }}
                                                    className="btn btn-warning me-2"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        deleteCourse(course._id);
                                                    }} 
                                                    className="btn btn-danger"
                                                    id="wd-delete-course-click"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
