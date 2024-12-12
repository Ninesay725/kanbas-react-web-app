import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button, Form, Card, Nav } from "react-bootstrap";
import { FaEllipsisV, FaCheckCircle, FaPlus } from "react-icons/fa";
import * as client from "../client";
import { formatDateForInput } from "../../../utils/dateUtils";
import QuizQuestions from "./QuizQuestions";
import Preview from "../Preview";

type QuizType = "GRADED_QUIZ" | "PRACTICE_QUIZ" | "GRADED_SURVEY" | "UNGRADED_SURVEY";
type AssignmentGroup = "QUIZZES" | "EXAMS" | "ASSIGNMENTS" | "PROJECT";

interface Quiz {
    _id?: string;
    title: string;
    description?: string;
    points: number;
    dueDate?: string;
    availableFromDate?: string;
    availableUntilDate?: string;
    published: boolean;
    questions: any[];
    course: string;
    quizType: QuizType;
    assignmentGroup: AssignmentGroup;
    shuffleAnswers: boolean;
    timeLimit: number;
    multipleAttempts: boolean;
    maxAttempts: number;
    showCorrectAnswers: boolean;
    accessCode: string;
    oneQuestionAtATime: boolean;
    webcamRequired: boolean;
    lockQuestionsAfterAnswering: boolean;
}

function QuizEditor() {
    const { cid, qid } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("details");
    const [quiz, setQuiz] = useState<Quiz>({
        title: "New Quiz",
        description: "",
        points: 0,
        published: false,
        questions: [],
        course: cid || "",
        quizType: "GRADED_QUIZ",
        assignmentGroup: "QUIZZES",
        shuffleAnswers: true,
        timeLimit: 20,
        multipleAttempts: false,
        maxAttempts: 1,
        showCorrectAnswers: true,
        accessCode: "",
        oneQuestionAtATime: true,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false
    });

    const fetchQuiz = async () => {
        if (qid) {
            try {
                const response = await client.findQuizById(qid);
                setQuiz(response);
            } catch (error) {
                console.error("Error fetching quiz:", error);
            }
        }
    };

    useEffect(() => {
        fetchQuiz();
    }, [qid]);

    useEffect(() => {
        const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
        setQuiz(prev => ({ ...prev, points: totalPoints }));
    }, [quiz.questions]);

    const handleSave = async (andPublish: boolean = false) => {
        try {
            const quizToSave = {
                ...quiz,
                published: andPublish ? true : quiz.published
            };
            
            let savedQuizId = qid;
            if (qid) {
                await client.updateQuiz(qid, quizToSave);
            } else {
                const createdQuiz = await client.createQuiz(cid || "", quizToSave);
                savedQuizId = createdQuiz._id;
            }

            // Navigate to Quiz List for Save & Publish, Quiz Detail for Save
            if (andPublish) {
                navigate(`/Kanbas/Courses/${cid}/Quizzes`);
            } else {
                navigate(`/Kanbas/Courses/${cid}/Quizzes/${savedQuizId}`);
            }
        } catch (error) {
            console.error("Error saving quiz:", error);
        }
    };

    const handleCancel = () => {
        if (qid) {
            navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}`);
        } else {
            navigate(`/Kanbas/Courses/${cid}/Quizzes`);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>{qid ? "Edit Quiz" : "Create Quiz"}</h2>
                <Button 
                    variant="success"
                    onClick={() => handleSave(true)}
                >
                    Save & Publish
                </Button>
            </div>

            <Nav variant="tabs" className="mb-3">
                <Nav.Item>
                    <Nav.Link
                        active={activeTab === "details"}
                        onClick={() => setActiveTab("details")}
                    >
                        Details
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        active={activeTab === "questions"}
                        onClick={() => setActiveTab("questions")}
                    >
                        Questions
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            {activeTab === "details" ? (
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Quiz Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={quiz.title}
                            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={quiz.description}
                            onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                        />
                    </Form.Group>

                    {/* Quiz Settings */}
                    <Form.Group className="mb-3">
                        <Form.Label>Quiz Type</Form.Label>
                        <Form.Select
                            value={quiz.quizType}
                            onChange={(e) => setQuiz({ ...quiz, quizType: e.target.value as Quiz["quizType"] })}
                        >
                            <option value="GRADED_QUIZ">Graded Quiz</option>
                            <option value="PRACTICE_QUIZ">Practice Quiz</option>
                            <option value="GRADED_SURVEY">Graded Survey</option>
                            <option value="UNGRADED_SURVEY">Ungraded Survey</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Assignment Group</Form.Label>
                        <Form.Select
                            value={quiz.assignmentGroup}
                            onChange={(e) => setQuiz({ ...quiz, assignmentGroup: e.target.value as Quiz["assignmentGroup"] })}
                        >
                            <option value="QUIZZES">Quizzes</option>
                            <option value="EXAMS">Exams</option>
                            <option value="ASSIGNMENTS">Assignments</option>
                            <option value="PROJECT">Project</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Total Points (Calculated from questions)</Form.Label>
                        <Form.Control
                            type="number"
                            value={quiz.points}
                            disabled
                            readOnly
                        />
                    </Form.Group>

                    {/* Quiz Options */}
                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Shuffle Answers"
                            checked={quiz.shuffleAnswers}
                            onChange={(e) => setQuiz({ ...quiz, shuffleAnswers: e.target.checked })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Time Limit (minutes)</Form.Label>
                        <Form.Control
                            type="number"
                            value={quiz.timeLimit}
                            onChange={(e) => setQuiz({ ...quiz, timeLimit: parseInt(e.target.value) })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Allow Multiple Attempts"
                            checked={quiz.multipleAttempts}
                            onChange={(e) => setQuiz({ ...quiz, multipleAttempts: e.target.checked })}
                        />
                    </Form.Group>

                    {quiz.multipleAttempts && (
                        <Form.Group className="mb-3">
                            <Form.Label>Maximum Attempts</Form.Label>
                            <Form.Control
                                type="number"
                                value={quiz.maxAttempts}
                                onChange={(e) => setQuiz({ ...quiz, maxAttempts: parseInt(e.target.value) })}
                            />
                        </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Show Correct Answers"
                            checked={quiz.showCorrectAnswers}
                            onChange={(e) => setQuiz({ ...quiz, showCorrectAnswers: e.target.checked })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Access Code</Form.Label>
                        <Form.Control
                            type="text"
                            value={quiz.accessCode}
                            onChange={(e) => setQuiz({ ...quiz, accessCode: e.target.value })}
                            placeholder="Leave blank for no access code"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="One Question at a Time"
                            checked={quiz.oneQuestionAtATime}
                            onChange={(e) => setQuiz({ ...quiz, oneQuestionAtATime: e.target.checked })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Require Webcam"
                            checked={quiz.webcamRequired}
                            onChange={(e) => setQuiz({ ...quiz, webcamRequired: e.target.checked })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Lock Questions After Answering"
                            checked={quiz.lockQuestionsAfterAnswering}
                            onChange={(e) => setQuiz({ ...quiz, lockQuestionsAfterAnswering: e.target.checked })}
                        />
                    </Form.Group>

                    {/* Due Dates */}
                    <Form.Group className="mb-3">
                        <Form.Label>Due Date</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={formatDateForInput(quiz.dueDate)}
                            onChange={(e) => {
                                const date = e.target.value ? new Date(e.target.value) : undefined;
                                setQuiz({ ...quiz, dueDate: date?.toISOString() });
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Available From</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={formatDateForInput(quiz.availableFromDate)}
                            onChange={(e) => {
                                const date = e.target.value ? new Date(e.target.value) : undefined;
                                setQuiz({ ...quiz, availableFromDate: date?.toISOString() });
                            }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Available Until</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={formatDateForInput(quiz.availableUntilDate)}
                            onChange={(e) => {
                                const date = e.target.value ? new Date(e.target.value) : undefined;
                                setQuiz({ ...quiz, availableUntilDate: date?.toISOString() });
                            }}
                        />
                    </Form.Group>
                </Form>
            ) : (
                <QuizQuestions
                    questions={quiz.questions}
                    setQuestions={(questions) => setQuiz({ ...quiz, questions })}
                />
            )}

            <div className="d-flex justify-content-end gap-2 mt-4">
                <Button variant="secondary" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={() => handleSave(false)}>
                    Save
                </Button>
            </div>
        </div>
    );
}

export default QuizEditor; 