import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button, Form, Card, Nav } from "react-bootstrap";
import { FaEllipsisV, FaCheckCircle, FaPlus } from "react-icons/fa";
import * as client from "../client";
import { formatDateForInput } from "../../../utils/dateUtils";
import QuizQuestions from "./QuizQuestions";
import Preview from "../Preview";

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
    type: string;
    assignmentGroup: string;
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
        points: 100,
        published: false,
        questions: [],
        course: cid || "",
        type: "GRADED_QUIZ",
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

    const handleSave = async () => {
        try {
            if (qid) {
                await client.updateQuiz(qid, quiz);
            } else {
                await client.createQuiz(cid || "", quiz);
            }
            navigate(`/Kanbas/Courses/${cid}/Quizzes`);
        } catch (error) {
            console.error("Error saving quiz:", error);
        }
    };

    const handlePublish = async () => {
        try {
            const updatedQuiz = { ...quiz, published: true };
            if (qid) {
                await client.updateQuiz(qid, updatedQuiz);
            } else {
                await client.createQuiz(cid || "", updatedQuiz);
            }
            navigate(`/Kanbas/Courses/${cid}/Quizzes`);
        } catch (error) {
            console.error("Error publishing quiz:", error);
        }
    };

    const renderDetailsTab = () => (
        <Form>
            {/* Basic Quiz Information */}
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
                    value={quiz.type}
                    onChange={(e) => setQuiz({ ...quiz, type: e.target.value })}
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
                    onChange={(e) => setQuiz({ ...quiz, assignmentGroup: e.target.value })}
                >
                    <option value="QUIZZES">Quizzes</option>
                    <option value="EXAMS">Exams</option>
                    <option value="ASSIGNMENTS">Assignments</option>
                    <option value="PROJECT">Project</option>
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Points</Form.Label>
                <Form.Control
                    type="number"
                    value={quiz.points}
                    onChange={(e) => setQuiz({ ...quiz, points: parseInt(e.target.value) })}
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
                    onChange={(e) => setQuiz({ ...quiz, dueDate: e.target.value })}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Available From</Form.Label>
                <Form.Control
                    type="datetime-local"
                    value={formatDateForInput(quiz.availableFromDate)}
                    onChange={(e) => setQuiz({ ...quiz, availableFromDate: e.target.value })}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Available Until</Form.Label>
                <Form.Control
                    type="datetime-local"
                    value={formatDateForInput(quiz.availableUntilDate)}
                    onChange={(e) => setQuiz({ ...quiz, availableUntilDate: e.target.value })}
                />
            </Form.Group>
        </Form>
    );

    return (
        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>{quiz.title}</h2>
                <div>
                    <Button variant="success" className="me-2" onClick={handlePublish}>
                        Publish
                    </Button>
                    <Button variant="primary" className="me-2" onClick={handleSave}>
                        Save
                    </Button>
                    <Link to={`/Kanbas/Courses/${cid}/Quizzes/${qid}/preview`}>
                        <Button variant="primary">Preview</Button>
                    </Link>
                </div>
            </div>

            <Card>
                <Card.Header>
                    <Nav variant="tabs">
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
                </Card.Header>
                <Card.Body>
                    {activeTab === "details" ? (
                        renderDetailsTab()
                    ) : (
                        <QuizQuestions
                            questions={quiz.questions}
                            setQuestions={(questions) => setQuiz({ ...quiz, questions })}
                        />
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}

export default QuizEditor; 