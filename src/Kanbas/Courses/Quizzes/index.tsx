import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FaSearch, FaEllipsisV, FaTrash, FaCheckCircle, FaBan, FaPlus, FaCaretDown } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { Dropdown } from "react-bootstrap";
import { formatDate } from "../../utils/dateUtils";
import { useSelector } from "react-redux";
import * as client from "./client";

interface Quiz {
    _id: string;
    title: string;
    description?: string;
    points: number;
    dueDate?: string;
    availableFromDate?: string;
    availableUntilDate?: string;
    published: boolean;
    questions: any[];
}

function QuizList() {
    const { cid } = useParams();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

    const fetchQuizzes = async () => {
        try {
            if (cid) {
                const fetchedQuizzes = await client.findQuizzesForCourse(cid);
                setQuizzes(fetchedQuizzes);
            }
        } catch (error) {
            console.error("Error fetching quizzes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, [cid]);

    const handleCreateQuiz = async () => {
        try {
            if (cid) {
                const newQuiz = {
                    title: "New Quiz",
                    description: "Click to edit quiz details",
                    points: 100,
                    published: false,
                    questions: [],
                    course: cid
                };
                await client.createQuiz(cid, newQuiz);
                fetchQuizzes();
            }
        } catch (error) {
            console.error("Error creating quiz:", error);
        }
    };

    const handleDeleteQuiz = async (quizId: string) => {
        if (window.confirm("Are you sure you want to delete this quiz?")) {
            try {
                await client.deleteQuiz(quizId);
                fetchQuizzes();
            } catch (error) {
                console.error("Error deleting quiz:", error);
            }
        }
    };

    const togglePublish = async (quiz: Quiz) => {
        try {
            await client.updateQuiz(quiz._id, {
                ...quiz,
                published: !quiz.published
            });
            fetchQuizzes();
        } catch (error) {
            console.error("Error updating quiz:", error);
        }
    };

    const formatDateString = (date: string | undefined): string => {
        if (!date) return "No Date";
        return formatDate(date);
    };

    if (loading) {
        return <div>Loading quizzes...</div>;
    }

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
                            placeholder="Search for Quiz"
                        />
                    </div>
                </div>
                {isFaculty && (
                    <div className="col-auto">
                        <button className="btn btn-secondary me-2">
                            <FaCaretDown className="me-1" /> Quiz Types
                        </button>
                        <button className="btn btn-secondary me-2">
                            <FaCaretDown className="me-1" /> Assignment Groups
                        </button>
                        <button className="btn btn-danger" onClick={handleCreateQuiz}>
                            <FaPlus className="me-1" /> Quiz
                        </button>
                    </div>
                )}
            </div>

            {/* Card */}
            <div className="card">
                {/* Card Header */}
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <BsGripVertical className="me-2" />
                        <h5 className="mb-0">
                            <strong>QUIZZES</strong>
                        </h5>
                    </div>
                    <div className="d-flex align-items-center">
                        <span className="me-2 px-2 py-1 border border-dark rounded-pill">
                            30% of Total
                        </span>
                        <button className="btn btn-sm btn-light">+</button>
                        <button className="btn btn-sm btn-light ms-2">
                            <FaEllipsisV />
                        </button>
                    </div>
                </div>

                {quizzes.length === 0 ? (
                    <div className="p-4 text-center text-muted">
                        No quizzes yet. Click the "Quiz" button to create one.
                    </div>
                ) : (
                    <ul className="list-group list-group-flush">
                        {quizzes.map((quiz) => (
                            <li key={quiz._id} className="list-group-item position-relative p-0">
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
                                                    <Link
                                                        to={isFaculty ? 
                                                            `/Kanbas/Courses/${cid}/Quizzes/${quiz._id}` :
                                                            `/Kanbas/Courses/${cid}/Quizzes/${quiz._id}/preview`}
                                                        className="text-black text-decoration-none"
                                                    >
                                                        <strong>{quiz.title}</strong>
                                                    </Link>
                                                </h6>
                                                <small>
                                                    <span className="text-danger">
                                                        <strong>{quiz.published ? 'Published' : 'Not Published'}</strong>
                                                    </span>{' '}
                                                    | <strong>Not available until</strong> {formatDateString(quiz.availableFromDate)} |
                                                    <br />
                                                    <strong>Due</strong> {formatDateString(quiz.dueDate)} | {quiz.points} pts | {quiz.questions.length} questions
                                                </small>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center pe-3">
                                            {quiz.published ? (
                                                <FaCheckCircle className="text-success me-3" />
                                            ) : (
                                                <FaBan className="text-secondary me-3" />
                                            )}
                                            {isFaculty && (
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="white" id={`quiz-${quiz._id}-dropdown`}>
                                                        <FaEllipsisV />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item
                                                            as={Link}
                                                            to={`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}/edit`}
                                                        >
                                                            Edit
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() => togglePublish(quiz)}
                                                        >
                                                            {quiz.published ? "Unpublish" : "Publish"}
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() => handleDeleteQuiz(quiz._id)}
                                                            className="text-danger"
                                                        >
                                                            Delete
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default QuizList; 