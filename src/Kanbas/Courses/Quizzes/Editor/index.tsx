import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaBan, FaPlus, FaTrash } from "react-icons/fa";
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

function QuizEditor() {
    const { cid, qid } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                if (qid) {
                    const fetchedQuiz = await client.findQuizById(qid);
                    setQuiz(fetchedQuiz);
                }
            } catch (error) {
                console.error("Error fetching quiz:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [qid]);

    const handleQuizUpdate = async (updatedQuiz: Quiz) => {
        try {
            await client.updateQuiz(updatedQuiz._id, updatedQuiz);
            setQuiz(updatedQuiz);
        } catch (error) {
            console.error("Error updating quiz:", error);
        }
    };

    const handleAddQuestion = async () => {
        if (!quiz) return;

        const newQuestion: Question = {
            title: "New Question",
            type: "MULTIPLE_CHOICE",
            points: 10,
            question: "Enter your question here",
            choices: ["Option 1", "Option 2", "Option 3", "Option 4"],
            correctAnswer: "Option 1"
        };

        try {
            await client.addQuestionToQuiz(quiz._id, newQuestion);
            const updatedQuiz = await client.findQuizById(quiz._id);
            setQuiz(updatedQuiz);
        } catch (error) {
            console.error("Error adding question:", error);
        }
    };

    const handleDeleteQuestion = async (questionId: string) => {
        if (!quiz) return;

        try {
            await client.deleteQuizQuestion(quiz._id, questionId);
            const updatedQuiz = await client.findQuizById(quiz._id);
            setQuiz(updatedQuiz);
        } catch (error) {
            console.error("Error deleting question:", error);
        }
    };

    const handleQuestionUpdate = async (questionId: string, updatedQuestion: Question) => {
        if (!quiz) return;

        try {
            await client.updateQuizQuestion(quiz._id, questionId, updatedQuestion);
            const updatedQuiz = await client.findQuizById(quiz._id);
            setQuiz(updatedQuiz);
        } catch (error) {
            console.error("Error updating question:", error);
        }
    };

    if (loading) {
        return <div>Loading quiz...</div>;
    }

    if (!quiz) {
        return <div>Quiz not found</div>;
    }

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>{quiz.title}</h2>
                <div>
                    <button
                        className="btn btn-success me-2"
                        onClick={() => handleQuizUpdate({ ...quiz, published: !quiz.published })}
                    >
                        {quiz.published ? (
                            <>
                                <FaCheckCircle className="me-2" />
                                Published
                            </>
                        ) : (
                            <>
                                <FaBan className="me-2" />
                                Unpublished
                            </>
                        )}
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={() => navigate(`/Kanbas/Courses/${cid}/Quizzes`)}
                    >
                        Cancel
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={quiz.title}
                        onChange={(e) => handleQuizUpdate({ ...quiz, title: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        value={quiz.description}
                        onChange={(e) => handleQuizUpdate({ ...quiz, description: e.target.value })}
                    />
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Quiz Type</label>
                        <select
                            className="form-select"
                            value={quiz.quizType}
                            onChange={(e) => handleQuizUpdate({
                                ...quiz,
                                quizType: e.target.value as Quiz["quizType"]
                            })}
                        >
                            <option value="GRADED_QUIZ">Graded Quiz</option>
                            <option value="PRACTICE_QUIZ">Practice Quiz</option>
                            <option value="GRADED_SURVEY">Graded Survey</option>
                            <option value="UNGRADED_SURVEY">Ungraded Survey</option>
                        </select>
                    </div>
                    <div className="col">
                        <label className="form-label">Points</label>
                        <input
                            type="number"
                            className="form-control"
                            value={quiz.points}
                            onChange={(e) => handleQuizUpdate({
                                ...quiz,
                                points: parseInt(e.target.value)
                            })}
                        />
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3>Questions</h3>
                    <button className="btn btn-success" onClick={handleAddQuestion}>
                        <FaPlus className="me-2" />
                        Add Question
                    </button>
                </div>

                {quiz.questions.map((question, index) => (
                    <div key={question._id} className="card mb-3">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Question {index + 1}</h5>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => question._id && handleDeleteQuestion(question._id)}
                            >
                                <FaTrash />
                            </button>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label">Question Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={question.title}
                                    onChange={(e) => question._id && handleQuestionUpdate(
                                        question._id,
                                        { ...question, title: e.target.value }
                                    )}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Question Type</label>
                                <select
                                    className="form-select"
                                    value={question.type}
                                    onChange={(e) => question._id && handleQuestionUpdate(
                                        question._id,
                                        { ...question, type: e.target.value as Question["type"] }
                                    )}
                                >
                                    <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                                    <option value="TRUE_FALSE">True/False</option>
                                    <option value="FILL_IN_BLANK">Fill in the Blank</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Question Text</label>
                                <textarea
                                    className="form-control"
                                    value={question.question}
                                    onChange={(e) => question._id && handleQuestionUpdate(
                                        question._id,
                                        { ...question, question: e.target.value }
                                    )}
                                />
                            </div>
                            {question.type === "MULTIPLE_CHOICE" && (
                                <div className="mb-3">
                                    <label className="form-label">Choices</label>
                                    {question.choices.map((choice, choiceIndex) => (
                                        <div key={choiceIndex} className="input-group mb-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={choice}
                                                onChange={(e) => {
                                                    const newChoices = [...question.choices];
                                                    newChoices[choiceIndex] = e.target.value;
                                                    question._id && handleQuestionUpdate(
                                                        question._id,
                                                        { ...question, choices: newChoices }
                                                    );
                                                }}
                                            />
                                            <div className="input-group-text">
                                                <input
                                                    type="radio"
                                                    checked={question.correctAnswer === choice}
                                                    onChange={() => question._id && handleQuestionUpdate(
                                                        question._id,
                                                        { ...question, correctAnswer: choice }
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {question.type === "TRUE_FALSE" && (
                                <div className="mb-3">
                                    <label className="form-label">Correct Answer</label>
                                    <select
                                        className="form-select"
                                        value={question.correctAnswer}
                                        onChange={(e) => question._id && handleQuestionUpdate(
                                            question._id,
                                            { ...question, correctAnswer: e.target.value }
                                        )}
                                    >
                                        <option value="true">True</option>
                                        <option value="false">False</option>
                                    </select>
                                </div>
                            )}
                            {question.type === "FILL_IN_BLANK" && (
                                <div className="mb-3">
                                    <label className="form-label">Correct Answer</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={question.correctAnswer}
                                        onChange={(e) => question._id && handleQuestionUpdate(
                                            question._id,
                                            { ...question, correctAnswer: e.target.value }
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default QuizEditor; 