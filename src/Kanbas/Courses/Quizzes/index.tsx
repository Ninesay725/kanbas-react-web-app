import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaSearch, FaEllipsisV, FaTrash, FaCheckCircle, FaBan, FaPlus, FaCaretDown } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { Dropdown, Modal } from "react-bootstrap";
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
    quizType?: "GRADED_QUIZ" | "PRACTICE_QUIZ" | "GRADED_SURVEY" | "UNGRADED_SURVEY";
    assignmentGroup?: "QUIZZES" | "EXAMS" | "ASSIGNMENTS" | "PROJECT";
}

function QuizList() {
    const { cid } = useParams();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"title" | "dueDate" | "availableFromDate">("title");
    const [filterType, setFilterType] = useState<string>("ALL");
    const [filterGroup, setFilterGroup] = useState<string>("ALL");
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";
    const [showCopyModal, setShowCopyModal] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>("");
    const navigate = useNavigate();

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

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const fetchedCourses = await client.findAllCourses();
                setCourses(fetchedCourses.filter((course: any) => course._id !== cid));
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };
        fetchCourses();
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
                    course: cid,
                    quizType: "GRADED_QUIZ",
                    assignmentGroup: "QUIZZES"
                };
                const createdQuiz = await client.createQuiz(cid, newQuiz);
                navigate(`/Kanbas/Courses/${cid}/Quizzes/${createdQuiz._id}`);
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

    const filteredAndSortedQuizzes = () => {
        let filtered = quizzes;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(quiz => 
                quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply quiz type filter
        if (filterType !== "ALL") {
            filtered = filtered.filter(quiz => quiz.quizType === filterType);
        }

        // Apply assignment group filter
        if (filterGroup !== "ALL") {
            filtered = filtered.filter(quiz => quiz.assignmentGroup === filterGroup);
        }

        // Apply sorting
        return filtered.sort((a, b) => {
            switch (sortBy) {
                case "title":
                    return a.title.localeCompare(b.title);
                case "dueDate":
                    return new Date(a.dueDate || "").getTime() - new Date(b.dueDate || "").getTime();
                case "availableFromDate":
                    return new Date(a.availableFromDate || "").getTime() - new Date(b.availableFromDate || "").getTime();
                default:
                    return 0;
            }
        });
    };

    const handleCopyQuiz = (quiz: Quiz) => {
        setSelectedQuiz(quiz);
        setShowCopyModal(true);
    };

    const handleCopyConfirm = async () => {
        if (selectedQuiz && selectedCourse) {
            try {
                console.log("Copying quiz:", selectedQuiz._id, "to course:", selectedCourse);
                const copiedQuiz = await client.copyQuizToCourse(selectedQuiz._id, selectedCourse);
                console.log("Quiz copied successfully:", copiedQuiz);
                setShowCopyModal(false);
                setSelectedQuiz(null);
                setSelectedCourse("");
                alert("Quiz copied successfully!");
            } catch (error: any) {
                console.error("Error copying quiz:", error);
                const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
                alert(`Error copying quiz: ${errorMessage}`);
            }
        }
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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                {isFaculty && (
                    <div className="col-auto">
                        <Dropdown className="d-inline-block me-2">
                            <Dropdown.Toggle variant="secondary">
                                <FaCaretDown className="me-1" /> Quiz Types
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setFilterType("ALL")}>All Types</Dropdown.Item>
                                <Dropdown.Item onClick={() => setFilterType("GRADED_QUIZ")}>Graded Quiz</Dropdown.Item>
                                <Dropdown.Item onClick={() => setFilterType("PRACTICE_QUIZ")}>Practice Quiz</Dropdown.Item>
                                <Dropdown.Item onClick={() => setFilterType("GRADED_SURVEY")}>Graded Survey</Dropdown.Item>
                                <Dropdown.Item onClick={() => setFilterType("UNGRADED_SURVEY")}>Ungraded Survey</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown className="d-inline-block me-2">
                            <Dropdown.Toggle variant="secondary">
                                <FaCaretDown className="me-1" /> Assignment Groups
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setFilterGroup("ALL")}>All Groups</Dropdown.Item>
                                <Dropdown.Item onClick={() => setFilterGroup("QUIZZES")}>Quizzes</Dropdown.Item>
                                <Dropdown.Item onClick={() => setFilterGroup("EXAMS")}>Exams</Dropdown.Item>
                                <Dropdown.Item onClick={() => setFilterGroup("ASSIGNMENTS")}>Assignments</Dropdown.Item>
                                <Dropdown.Item onClick={() => setFilterGroup("PROJECT")}>Project</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown className="d-inline-block me-2">
                            <Dropdown.Toggle variant="secondary">
                                <FaCaretDown className="me-1" /> Sort By
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setSortBy("title")}>Name</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSortBy("dueDate")}>Due Date</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSortBy("availableFromDate")}>Available Date</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
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
                        {filteredAndSortedQuizzes().map((quiz) => (
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
                                                            onClick={() => handleCopyQuiz(quiz)}
                                                        >
                                                            Copy to...
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

            {/* Copy Quiz Modal */}
            <Modal show={showCopyModal} onHide={() => setShowCopyModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Copy Quiz to Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Select a course to copy "{selectedQuiz?.title}" to:</p>
                    <select 
                        className="form-select"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                        <option value="">Select a course...</option>
                        {courses.map((course) => (
                            <option key={course._id} value={course._id}>
                                {course.name}
                            </option>
                        ))}
                    </select>
                </Modal.Body>
                <Modal.Footer>
                    <button 
                        className="btn btn-secondary" 
                        onClick={() => setShowCopyModal(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleCopyConfirm}
                        disabled={!selectedCourse}
                    >
                        Copy Quiz
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default QuizList; 