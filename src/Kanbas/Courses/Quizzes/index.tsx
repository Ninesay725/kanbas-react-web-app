import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FaEllipsisV, FaCheckCircle, FaBan, FaPlus } from "react-icons/fa";
import { Dropdown } from "react-bootstrap";
import * as client from "./client";

interface Quiz {
    _id: string;
    title: string;
    description?: string;
    points: number;
    dueDate?: Date;
    published: boolean;
    questions: any[];
}

function QuizList() {
    const { cid } = useParams();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);

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
        try {
            await client.deleteQuiz(quizId);
            fetchQuizzes();
        } catch (error) {
            console.error("Error deleting quiz:", error);
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

    if (loading) {
        return <div>Loading quizzes...</div>;
    }

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Quizzes</h2>
                <button
                    className="btn btn-danger"
                    onClick={handleCreateQuiz}
                >
                    <FaPlus className="me-2" />
                    Quiz
                </button>
            </div>

            {quizzes.length === 0 ? (
                <p>No quizzes yet. Click the "Quiz" button to create one.</p>
            ) : (
                <div className="list-group">
                    {quizzes.map((quiz) => (
                        <div
                            key={quiz._id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            <div className="d-flex align-items-center">
                                {quiz.published ? (
                                    <FaCheckCircle className="text-success me-2" />
                                ) : (
                                    <FaBan className="text-secondary me-2" />
                                )}
                                <Link
                                    to={`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`}
                                    className="text-danger text-decoration-none"
                                >
                                    {quiz.title}
                                </Link>
                            </div>
                            <div className="d-flex align-items-center">
                                <span className="me-3">
                                    {quiz.points} pts | {quiz.questions.length} questions
                                </span>
                                <Dropdown>
                                    <Dropdown.Toggle variant="white" id={`quiz-${quiz._id}-dropdown`}>
                                        <FaEllipsisV />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item
                                            as={Link}
                                            to={`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`}
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
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default QuizList; 