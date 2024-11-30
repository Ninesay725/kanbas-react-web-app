import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaCheckCircle, FaBan, FaPencilAlt, FaEye } from "react-icons/fa";
import * as client from "../client";

interface Question {
    _id?: string;
    title: string;
    type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK";
    points: number;
    question: string;
    choices: string[];
    correctAnswer: string;
}

interface Quiz {
    _id: string;
    title: string;
    description: string;
    points: number;
    dueDate?: Date;
    availableFromDate?: Date;
    availableUntilDate?: Date;
    published: boolean;
    quizType: "GRADED_QUIZ" | "PRACTICE_QUIZ" | "GRADED_SURVEY" | "UNGRADED_SURVEY";
    shuffleAnswers: boolean;
    timeLimit?: number;
    multipleAttempts: boolean;
    maxAttempts?: number;
    showCorrectAnswers: boolean;
    oneQuestionAtATime: boolean;
    questions: Question[];
}

interface QuizDetailsProps {
    preview?: boolean;
}

function QuizDetails({ preview = false }: QuizDetailsProps) {
    const { cid, qid } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                if (qid) {
                    const fetchedQuiz = await client.findQuizById(qid);
                    setQuiz(fetchedQuiz);
                    // Initialize user answers
                    const initialAnswers: { [key: string]: string } = {};
                    fetchedQuiz.questions.forEach((q: Question) => {
                        initialAnswers[q._id!] = "";
                    });
                    setUserAnswers(initialAnswers);
                }
            } catch (error) {
                console.error("Error fetching quiz:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [qid]);

    const formatDate = (date: Date | undefined) => {
        if (!date) return "No Date Set";
        return new Date(date).toLocaleDateString("en-US", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleAnswerChange = (questionId: string, answer: string) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleNextQuestion = () => {
        if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    if (loading) {
        return <div>Loading quiz details...</div>;
    }

    if (!quiz) {
        return <div>Quiz not found</div>;
    }

    const renderQuestion = (question: Question, index: number) => {
        if (preview && quiz.oneQuestionAtATime && index !== currentQuestionIndex) {
            return null;
        }

        return (
            <div key={question._id} className="card mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Question {index + 1}</h4>
                    <span>{question.points} pts</span>
                </div>
                <div className="card-body">
                    <p className="mb-4">{question.question}</p>
                    {question.type === "MULTIPLE_CHOICE" && (
                        <div className="list-group">
                            {question.choices.map((choice, i) => (
                                <label key={i} className="list-group-item">
                                    <input
                                        type="radio"
                                        name={`question-${question._id}`}
                                        value={choice}
                                        checked={userAnswers[question._id!] === choice}
                                        onChange={(e) => handleAnswerChange(question._id!, e.target.value)}
                                        className="me-2"
                                    />
                                    {choice}
                                </label>
                            ))}
                        </div>
                    )}
                    {question.type === "TRUE_FALSE" && (
                        <div className="list-group">
                            {["true", "false"].map((choice) => (
                                <label key={choice} className="list-group-item">
                                    <input
                                        type="radio"
                                        name={`question-${question._id}`}
                                        value={choice}
                                        checked={userAnswers[question._id!] === choice}
                                        onChange={(e) => handleAnswerChange(question._id!, e.target.value)}
                                        className="me-2"
                                    />
                                    {choice.charAt(0).toUpperCase() + choice.slice(1)}
                                </label>
                            ))}
                        </div>
                    )}
                    {question.type === "FILL_IN_BLANK" && (
                        <input
                            type="text"
                            className="form-control"
                            value={userAnswers[question._id!] || ""}
                            onChange={(e) => handleAnswerChange(question._id!, e.target.value)}
                            placeholder="Type your answer here"
                        />
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>{quiz.title}</h2>
                {!preview && (
                    <div>
                        <Link
                            to={`/Kanbas/Courses/${cid}/Quizzes/${qid}/preview`}
                            className="btn btn-secondary me-2"
                        >
                            <FaEye className="me-2" />
                            Preview
                        </Link>
                        <Link
                            to={`/Kanbas/Courses/${cid}/Quizzes/${qid}/edit`}
                            className="btn btn-primary"
                        >
                            <FaPencilAlt className="me-2" />
                            Edit
                        </Link>
                    </div>
                )}
            </div>

            {preview ? (
                <div>
                    <div className="alert alert-info">
                        <h4>Preview Mode</h4>
                        <p>This is how students will see the quiz.</p>
                        {quiz.timeLimit && (
                            <p>Time limit: {quiz.timeLimit} minutes</p>
                        )}
                        {quiz.oneQuestionAtATime && (
                            <p>Questions will be shown one at a time.</p>
                        )}
                    </div>
                    
                    {quiz.questions.map((question, index) => renderQuestion(question, index))}
                    
                    {quiz.oneQuestionAtATime && quiz.questions.length > 0 && (
                        <div className="d-flex justify-content-between mt-4">
                            <button
                                className="btn btn-secondary"
                                onClick={handlePreviousQuestion}
                                disabled={currentQuestionIndex === 0}
                            >
                                Previous
                            </button>
                            <span>
                                Question {currentQuestionIndex + 1} of {quiz.questions.length}
                            </span>
                            <button
                                className="btn btn-primary"
                                onClick={handleNextQuestion}
                                disabled={currentQuestionIndex === quiz.questions.length - 1}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <strong>Quiz Type:</strong>
                                </div>
                                <div className="col-md-9">
                                    {quiz.quizType.replace(/_/g, " ")}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <strong>Points:</strong>
                                </div>
                                <div className="col-md-9">
                                    {quiz.points} pts
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <strong>Due:</strong>
                                </div>
                                <div className="col-md-9">
                                    {formatDate(quiz.dueDate)}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <strong>Available from:</strong>
                                </div>
                                <div className="col-md-9">
                                    {formatDate(quiz.availableFromDate)}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <strong>Available until:</strong>
                                </div>
                                <div className="col-md-9">
                                    {formatDate(quiz.availableUntilDate)}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <strong>Time Limit:</strong>
                                </div>
                                <div className="col-md-9">
                                    {quiz.timeLimit ? `${quiz.timeLimit} minutes` : "No time limit"}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <strong>Attempts:</strong>
                                </div>
                                <div className="col-md-9">
                                    {quiz.multipleAttempts ? `${quiz.maxAttempts} attempts allowed` : "1 attempt only"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h3 className="mb-0">Questions</h3>
                        </div>
                        <div className="card-body">
                            {quiz.questions.map((question, index) => (
                                <div key={question._id} className="mb-4">
                                    <h4>Question {index + 1}</h4>
                                    <p>{question.question}</p>
                                    {question.type === "MULTIPLE_CHOICE" && (
                                        <ul className="list-group">
                                            {question.choices.map((choice, i) => (
                                                <li key={i} className="list-group-item">
                                                    {choice}
                                                    {choice === question.correctAnswer && (
                                                        <span className="text-success ms-2">
                                                            <FaCheckCircle /> Correct Answer
                                                        </span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {question.type === "TRUE_FALSE" && (
                                        <div>
                                            <p>Correct Answer: {question.correctAnswer}</p>
                                        </div>
                                    )}
                                    {question.type === "FILL_IN_BLANK" && (
                                        <div>
                                            <p>Correct Answer: {question.correctAnswer}</p>
                                        </div>
                                    )}
                                    <p className="mt-2">Points: {question.points}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuizDetails; 