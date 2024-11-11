import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { isFaculty } from "./utils/permissions";
import * as client from "./Courses/Enrollments/client";
import * as courseClient from "./Courses/client";
import { setEnrollments, enroll, unenroll, toggleShowAllCourses } from "./Courses/Enrollments/reducer";

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
    const { showAllCourses, enrollments } = useSelector((state: any) => state.enrollmentsReducer);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [allCourses, setAllCourses] = useState<any[]>([]);
    const [displayedCourses, setDisplayedCourses] = useState<any[]>([]);

    const fetchAllCourses = async () => {
        try {
            const courses = await courseClient.fetchAllCourses();
            setAllCourses(courses);
        } catch (error) {
            console.error("Error fetching all courses:", error);
        }
    };

    const fetchEnrollments = async () => {
        try {
            const enrollments = await client.findAllEnrollments();
            dispatch(setEnrollments(enrollments));
        } catch (error) {
            console.error("Error fetching enrollments:", error);
        }
    };

    useEffect(() => {
        fetchAllCourses();
        fetchEnrollments();
    }, []);

    useEffect(() => {
        if (showAllCourses) {
            setDisplayedCourses(allCourses);
        } else {
            const enrolledCourses = allCourses.filter(course => 
                enrollments.some((enrollment: any) => 
                    enrollment.user === currentUser._id && 
                    enrollment.course === course._id
                )
            );
            setDisplayedCourses(enrolledCourses);
        }
    }, [showAllCourses, enrollments, allCourses, currentUser]);

    const handleEnroll = async (courseId: string) => {
        try {
            const enrollment = await client.enrollStudentInCourse(currentUser._id, courseId);
            dispatch(enroll(enrollment));
            await fetchEnrollments();
        } catch (error) {
            console.error("Error enrolling in course:", error);
        }
    };

    const handleUnenroll = async (courseId: string) => {
        try {
            await client.unenrollStudentFromCourse(currentUser._id, courseId);
            dispatch(unenroll({ studentId: currentUser._id, courseId }));
            await fetchEnrollments();
        } catch (error) {
            console.error("Error unenrolling from course:", error);
        }
    };

    const isEnrolled = (courseId: string) => {
        return enrollments.some(
            (enrollment: any) => 
                enrollment.user === currentUser._id &&
                enrollment.course === courseId
        );
    };

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
                {isFaculty(currentUser) 
                    ? "Published Courses" 
                    : (showAllCourses ? "All Courses" : "My Courses")} 
                ({displayedCourses.length})
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
                                    {isFaculty(currentUser) ? (
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
                                    ) : (
                                        <div className="d-flex">
                                            {isEnrolled(course._id) ? (
                                                <>
                                                    <button 
                                                        onClick={() => navigate(`/Kanbas/Courses/${course._id}/Home`)}
                                                        className="btn btn-primary me-1"
                                                        style={{ width: '60px' }}
                                                    >
                                                        Go
                                                    </button>
                                                    <button 
                                                        onClick={() => handleUnenroll(course._id)}
                                                        className="btn btn-danger flex-grow-1"
                                                    >
                                                        Unenroll
                                                    </button>
                                                </>
                                            ) : (
                                                <button 
                                                    onClick={() => handleEnroll(course._id)}
                                                    className="btn btn-success w-100"
                                                >
                                                    Enroll
                                                </button>
                                            )}
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
