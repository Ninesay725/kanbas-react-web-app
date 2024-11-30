import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Card, Alert, ProgressBar, Badge, ListGroup } from "react-bootstrap";
import * as client from "../client";
import { useSelector } from "react-redux";
import { isFaculty } from "../../../utils/permissions";

interface Question {
    _id?: string;
    title: string;
    type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK";
    points: number;
    question: string;
    choices?: string[];
    correctAnswer: string;
}

interface Quiz {
    _id?: string;
    title: string;
    description?: string;
    points: number;
    dueDate?: string;
    availableFromDate?: string;
    availableUntilDate?: string;
    published: boolean;
    questions: Question[];
    timeLimit?: number;
    multipleAttempts?: boolean;
    maxAttempts?: number;
    showCorrectAnswers?: boolean;
    oneQuestionAtATime?: boolean;
    accessCode?: string;
    webcamRequired?: boolean;
    lockQuestionsAfterAnswering?: boolean;
    quizType?: "GRADED_QUIZ" | "PRACTICE_QUIZ" | "GRADED_SURVEY" | "UNGRADED_SURVEY";
    assignmentGroup?: "QUIZZES" | "EXAMS" | "ASSIGNMENTS" | "PROJECT";
    shuffleAnswers?: boolean;
}

interface QuizAttempt {
    _id?: string;
    quiz: string;
    user: string;
    answers: { [key: string]: string };
    score: number;
    submittedAt: string;
}

function QuizPreview() {
    const { cid, qid } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [previousAttempt, setPreviousAttempt] = useState<QuizAttempt | null>(null);
    const [startQuiz, setStartQuiz] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
    const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
    const [attemptsCount, setAttemptsCount] = useState<number>(0);

    useEffect(() => {
        if (startQuiz && quiz?.timeLimit && !submitted) {
            const timeLimit = quiz.timeLimit * 60; // convert to seconds
            setTimeRemaining(timeLimit);
            
            const timer = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev === null || prev <= 0) {
                        clearInterval(timer);
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [startQuiz, quiz?.timeLimit, submitted]);

    useEffect(() => {
        const answered = new Set(Object.keys(answers).filter(key => answers[key]));
        setAnsweredQuestions(answered);
    }, [answers]);

    useEffect(() => {
        const calculateRemainingAttempts = async () => {
            if (quiz?.multipleAttempts && quiz.maxAttempts && currentUser) {
                try {
                    const attempts = await client.findQuizAttemptsByUser(currentUser._id);
                    const quizAttempts = attempts.filter((a: QuizAttempt) => a.quiz === qid);
                    setRemainingAttempts(quiz.maxAttempts - quizAttempts.length);
                } catch (error) {
                    console.error("Error fetching attempts:", error);
                }
            }
        };
        calculateRemainingAttempts();
    }, [quiz, currentUser, qid]);

    useEffect(() => {
        const fetchAttempts = async () => {
            if (currentUser && qid) {
                try {
                    const attempts = await client.findQuizAttemptsByUser(currentUser._id);
                    const quizAttempts = attempts.filter((a: QuizAttempt) => a.quiz === qid);
                    setAttemptsCount(quizAttempts.length);
                } catch (error) {
                    console.error("Error fetching attempts:", error);
                }
            }
        };
        fetchAttempts();
    }, [currentUser, qid]);

    const canAttemptQuiz = () => {
        if (!quiz) return false;
        if (!quiz.published) return false;
        if (currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN") return true;
        if (!quiz.multipleAttempts && attemptsCount > 0) return false;
        if (quiz.maxAttempts && attemptsCount >= quiz.maxAttempts) return false;
        return true;
    };

    const getShuffledChoices = useCallback((question: Question) => {
        if (!quiz?.shuffleAnswers || !question.choices) return question.choices;
        return [...question.choices].sort(() => Math.random() - 0.5);
    }, [quiz?.shuffleAnswers]);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const fetchQuiz = async () => {
        if (qid) {
            try {
                const fetchedQuiz = await client.findQuizById(qid);
                console.log("Fetched quiz:", fetchedQuiz); // Debug log
                setQuiz(fetchedQuiz);
            } catch (error) {
                console.error("Error fetching quiz:", error);
            }
        }
    };

    const fetchPreviousAttempt = async () => {
        if (qid && currentUser) {
            try {
                const attempts = await client.findQuizAttemptsByUser(currentUser._id);
                const latestAttempt = attempts.find((attempt: QuizAttempt) => attempt.quiz === qid);
                if (latestAttempt) {
                    setPreviousAttempt(latestAttempt);
                    setAnswers(latestAttempt.answers);
                }
            } catch (error) {
                console.error("Error fetching previous attempt:", error);
            }
        }
    };

    useEffect(() => {
        fetchQuiz();
        fetchPreviousAttempt();
    }, [qid, currentUser]);

    const handleAnswerChange = (questionId: string, answer: string) => {
        if (quiz?.lockQuestionsAfterAnswering && answers[questionId]) {
            return; // Don't allow changes if question is locked
        }
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const calculateScore = (): number => {
        if (!quiz) return 0;
        let correctAnswers = 0;
        quiz.questions.forEach(question => {
            const userAnswer = answers[question._id || ""];
            if (userAnswer === question.correctAnswer) {
                correctAnswers += question.points;
            }
        });
        return correctAnswers;
    };

    const handleSubmit = async () => {
        if (!quiz || !currentUser || !qid) return;

        const totalScore = calculateScore();
        setScore(totalScore);
        setSubmitted(true);

        const attempt = {
            quiz: qid as string,
            user: currentUser._id,
            answers,
            score: totalScore,
            submittedAt: new Date().toISOString()
        };

        try {
            const savedAttempt = await client.createQuizAttempt(attempt);
            setPreviousAttempt(savedAttempt);
        } catch (error) {
            console.error("Error saving quiz attempt:", error);
        }
    };

    const handleStartQuiz = () => {
        setStartQuiz(true);
        setAnswers({});
        setSubmitted(false);
        setScore(null);
        setCurrentQuestionIndex(0);
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

    if (!quiz) {
        return <div>Loading quiz...</div>;
    }

    if (!startQuiz) {
        return (
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>{quiz.title}</h2>
                    {currentUser?.role === "FACULTY" && (
                        <Button 
                            variant="primary"
                            onClick={() => navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}/edit`)}
                        >
                            Edit Quiz
                        </Button>
                    )}
                </div>

                <Card className="mb-4">
                    <Card.Body>
                        <h4>Quiz Instructions</h4>
                        <p>{quiz.description || "No instructions provided."}</p>
                        <hr />
                        <div>
                            <strong>Points:</strong> {quiz.points} points<br />
                            <strong>Questions:</strong> {quiz.questions.length}<br />
                            <strong>Time Limit:</strong> {quiz.timeLimit || "No time limit"} minutes<br />
                            <strong>Allowed Attempts:</strong> {quiz.multipleAttempts ? `${quiz.maxAttempts} attempts` : "1 attempt"}<br />
                            <strong>Due Date:</strong> {quiz.dueDate ? new Date(quiz.dueDate).toLocaleString() : "Not set"}<br />
                            <strong>Available From:</strong> {quiz.availableFromDate ? new Date(quiz.availableFromDate).toLocaleString() : "Not set"}<br />
                        </div>
                    </Card.Body>
                </Card>

                {previousAttempt && currentUser?.role !== "FACULTY" && (
                    <Alert variant="info">
                        Previous attempt on {new Date(previousAttempt.submittedAt).toLocaleString()}
                        <br />
                        Score: {previousAttempt.score} points
                    </Alert>
                )}

                {currentUser?.role !== "FACULTY" && !quiz.published && (
                    <Alert variant="warning">
                        This quiz is not yet available.
                    </Alert>
                )}

                {currentUser?.role !== "FACULTY" && !canAttemptQuiz() && (
                    <Alert variant="warning">
                        {!quiz.multipleAttempts && attemptsCount > 0 ? 
                            "You have already used your attempt for this quiz." :
                            `You have reached the maximum number of attempts (${quiz.maxAttempts}) for this quiz.`
                        }
                    </Alert>
                )}

                <div className="d-flex justify-content-center">
                    <Button 
                        variant="success" 
                        size="lg"
                        onClick={handleStartQuiz}
                        disabled={!canAttemptQuiz()}
                    >
                        {currentUser?.role === "FACULTY" ? "Start Quiz (Faculty Preview)" : "Start Quiz"}
                    </Button>
                </div>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                {timeRemaining !== null && (
                    <Badge bg={timeRemaining < 300 ? "danger" : "primary"} className="p-2">
                        Time Remaining: {formatTime(timeRemaining)}
                    </Badge>
                )}
                <ProgressBar 
                    now={(answeredQuestions.size / quiz.questions.length) * 100} 
                    label={`${answeredQuestions.size}/${quiz.questions.length} Questions Answered`}
                    className="flex-grow-1 mx-3"
                />
            </div>

            {quiz.oneQuestionAtATime ? (
                <div className="d-flex">
                    <div className="question-navigation me-3" style={{ width: '200px' }}>
                        <ListGroup>
                            {quiz.questions.map((q, index) => (
                                <ListGroup.Item
                                    key={q._id}
                                    action
                                    active={currentQuestionIndex === index}
                                    variant={answeredQuestions.has(q._id || "") ? "success" : undefined}
                                    onClick={() => setCurrentQuestionIndex(index)}
                                    disabled={quiz.lockQuestionsAfterAnswering && answeredQuestions.has(q._id || "")}
                                >
                                    Question {index + 1}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                    <div className="flex-grow-1">
                        <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h4>Question {currentQuestionIndex + 1} of {quiz.questions.length}</h4>
                                <span>{currentQuestion.points} pts</span>
                            </div>
                            <Card>
                                <Card.Body>
                                    <Card.Title>{currentQuestion.title}</Card.Title>
                                    <Card.Text>{currentQuestion.question}</Card.Text>

                                    {currentQuestion.type === "MULTIPLE_CHOICE" && currentQuestion.choices && (
                                        <Form.Group>
                                            {currentQuestion.choices.map((choice, i) => (
                                                <Form.Check
                                                    key={i}
                                                    type="radio"
                                                    id={`${currentQuestion._id}-${i}`}
                                                    name={`question-${currentQuestion._id}`}
                                                    label={choice}
                                                    checked={answers[currentQuestion._id || ""] === choice}
                                                    onChange={() => handleAnswerChange(currentQuestion._id || "", choice)}
                                                    disabled={submitted}
                                                />
                                            ))}
                                        </Form.Group>
                                    )}

                                    {currentQuestion.type === "TRUE_FALSE" && (
                                        <Form.Group>
                                            <Form.Check
                                                type="radio"
                                                id={`${currentQuestion._id}-true`}
                                                name={`question-${currentQuestion._id}`}
                                                label="True"
                                                checked={answers[currentQuestion._id || ""] === "True"}
                                                onChange={() => handleAnswerChange(currentQuestion._id || "", "True")}
                                                disabled={submitted}
                                            />
                                            <Form.Check
                                                type="radio"
                                                id={`${currentQuestion._id}-false`}
                                                name={`question-${currentQuestion._id}`}
                                                label="False"
                                                checked={answers[currentQuestion._id || ""] === "False"}
                                                onChange={() => handleAnswerChange(currentQuestion._id || "", "False")}
                                                disabled={submitted}
                                            />
                                        </Form.Group>
                                    )}

                                    {currentQuestion.type === "FILL_IN_BLANK" && (
                                        <Form.Group>
                                            <Form.Control
                                                type="text"
                                                value={answers[currentQuestion._id || ""] || ""}
                                                onChange={(e) => handleAnswerChange(currentQuestion._id || "", e.target.value)}
                                                placeholder="Enter your answer"
                                                disabled={submitted}
                                            />
                                        </Form.Group>
                                    )}
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="d-flex justify-content-between">
                            <Button 
                                variant="secondary" 
                                onClick={handlePreviousQuestion}
                                disabled={currentQuestionIndex === 0}
                            >
                                Previous
                            </Button>
                            {currentQuestionIndex === quiz.questions.length - 1 ? (
                                <Button variant="success" onClick={handleSubmit} disabled={submitted}>
                                    Submit Quiz
                                </Button>
                            ) : (
                                <Button variant="primary" onClick={handleNextQuestion}>
                                    Next
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {quiz.questions.map((question, index) => (
                        <Card key={question._id || index} className="mb-3">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <span>Question {index + 1}</span>
                                <span>{question.points} pts</span>
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>{question.title}</Card.Title>
                                <Card.Text>{question.question}</Card.Text>

                                {question.type === "MULTIPLE_CHOICE" && question.choices && (
                                    <Form.Group>
                                        {question.choices.map((choice, i) => (
                                            <Form.Check
                                                key={i}
                                                type="radio"
                                                id={`${question._id}-${i}`}
                                                name={`question-${question._id}`}
                                                label={choice}
                                                checked={answers[question._id || ""] === choice}
                                                onChange={() => handleAnswerChange(question._id || "", choice)}
                                                disabled={submitted}
                                            />
                                        ))}
                                    </Form.Group>
                                )}

                                {question.type === "TRUE_FALSE" && (
                                    <Form.Group>
                                        <Form.Check
                                            type="radio"
                                            id={`${question._id}-true`}
                                            name={`question-${question._id}`}
                                            label="True"
                                            checked={answers[question._id || ""] === "True"}
                                            onChange={() => handleAnswerChange(question._id || "", "True")}
                                            disabled={submitted}
                                        />
                                        <Form.Check
                                            type="radio"
                                            id={`${question._id}-false`}
                                            name={`question-${question._id}`}
                                            label="False"
                                            checked={answers[question._id || ""] === "False"}
                                            onChange={() => handleAnswerChange(question._id || "", "False")}
                                            disabled={submitted}
                                        />
                                    </Form.Group>
                                )}

                                {question.type === "FILL_IN_BLANK" && (
                                    <Form.Group>
                                        <Form.Control
                                            type="text"
                                            value={answers[question._id || ""] || ""}
                                            onChange={(e) => handleAnswerChange(question._id || "", e.target.value)}
                                            placeholder="Enter your answer"
                                            disabled={submitted}
                                        />
                                    </Form.Group>
                                )}

                                {submitted && (
                                    <div className="mt-3">
                                        <strong>Your answer: </strong>
                                        {answers[question._id || ""] || "No answer"}
                                        <br />
                                        <strong>Correct answer: </strong>
                                        {question.correctAnswer}
                                        <br />
                                        <strong>Result: </strong>
                                        {answers[question._id || ""] === question.correctAnswer ? (
                                            <span className="text-success">Correct</span>
                                        ) : (
                                            <span className="text-danger">Incorrect</span>
                                        )}
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    ))}

                    {!submitted && (
                        <div className="d-flex justify-content-end mb-4">
                            <Button variant="success" onClick={handleSubmit}>
                                Submit Quiz
                            </Button>
                        </div>
                    )}
                </>
            )}

            {submitted && score !== null && (
                <Alert variant="info">
                    Your score: {score} out of {quiz.points} points
                </Alert>
            )}

            {submitted && quiz.showCorrectAnswers && (
                <div className="mt-3">
                    <h4>Correct Answers</h4>
                    {quiz.questions.map((question, index) => (
                        <div key={question._id || index}>
                            <strong>Question {index + 1}:</strong> {question.correctAnswer}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default QuizPreview; 