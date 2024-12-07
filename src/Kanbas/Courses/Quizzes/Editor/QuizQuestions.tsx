import React, { useState } from "react";
import { Button, Form, Card, Dropdown } from "react-bootstrap";
import { FaEllipsisV, FaGripVertical, FaPlus, FaPencilAlt, FaCheck, FaTimes } from "react-icons/fa";

interface Question {
    _id?: string;
    title: string;
    type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK";
    points: number;
    question: string;
    choices?: string[];
    correctAnswer: string;
    correctAnswers?: string[];
}

interface QuizQuestionsProps {
    questions: Question[];
    setQuestions: (questions: Question[]) => void;
}

function QuizQuestions({ questions, setQuestions }: QuizQuestionsProps) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [tempQuestion, setTempQuestion] = useState<Question | null>(null);

    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    const addQuestion = () => {
        const newQuestion: Question = {
            title: "New Question",
            type: "MULTIPLE_CHOICE",
            points: 1,
            question: "",
            choices: ["", ""],
            correctAnswer: "",
            correctAnswers: []
        };
        setQuestions([...questions, newQuestion]);
        setEditingIndex(questions.length);
        setTempQuestion(newQuestion);
    };

    const handleSaveQuestion = (index: number) => {
        if (tempQuestion) {
            const updatedQuestions = [...questions];
            updatedQuestions[index] = tempQuestion;
            setQuestions(updatedQuestions);
            setEditingIndex(null);
            setTempQuestion(null);
        }
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setTempQuestion(null);
    };

    const handleEditQuestion = (index: number) => {
        setEditingIndex(index);
        setTempQuestion({ ...questions[index] });
    };

    const handleDeleteQuestion = (index: number) => {
        if (window.confirm("Are you sure you want to delete this question?")) {
            const updatedQuestions = questions.filter((_, i) => i !== index);
            setQuestions(updatedQuestions);
        }
    };

    const addChoice = () => {
        if (tempQuestion && tempQuestion.type === "MULTIPLE_CHOICE" && tempQuestion.choices) {
            setTempQuestion({
                ...tempQuestion,
                choices: [...tempQuestion.choices, ""]
            });
        }
    };

    const deleteChoice = (choiceIndex: number) => {
        if (tempQuestion && tempQuestion.type === "MULTIPLE_CHOICE" && tempQuestion.choices) {
            const updatedChoices = tempQuestion.choices.filter((_, i) => i !== choiceIndex);
            const currentCorrectAnswer = tempQuestion.choices[choiceIndex] === tempQuestion.correctAnswer 
                ? "" 
                : tempQuestion.correctAnswer;
            setTempQuestion({
                ...tempQuestion,
                choices: updatedChoices,
                correctAnswer: currentCorrectAnswer
            });
        }
    };

    const addBlankAnswer = () => {
        if (tempQuestion && tempQuestion.type === "FILL_IN_BLANK") {
            setTempQuestion({
                ...tempQuestion,
                correctAnswers: [...(tempQuestion.correctAnswers || []), ""]
            });
        }
    };

    const updateBlankAnswer = (answerIndex: number, newText: string) => {
        if (tempQuestion && tempQuestion.type === "FILL_IN_BLANK" && tempQuestion.correctAnswers) {
            const updatedAnswers = [...tempQuestion.correctAnswers];
            updatedAnswers[answerIndex] = newText;
            setTempQuestion({
                ...tempQuestion,
                correctAnswers: updatedAnswers,
                correctAnswer: updatedAnswers.join('|')
            });
        }
    };

    const deleteBlankAnswer = (answerIndex: number) => {
        if (tempQuestion && tempQuestion.type === "FILL_IN_BLANK" && tempQuestion.correctAnswers) {
            const updatedAnswers = tempQuestion.correctAnswers.filter((_, i) => i !== answerIndex);
            setTempQuestion({
                ...tempQuestion,
                correctAnswers: updatedAnswers,
                correctAnswer: updatedAnswers.join('|')
            });
        }
    };

    const renderQuestionEditor = () => {
        if (!tempQuestion) return null;

        return (
            <div className="border p-3 mb-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Form.Group style={{ width: "200px" }}>
                        <Form.Select
                            value={tempQuestion.type}
                            onChange={(e) => {
                                const type = e.target.value as Question["type"];
                                let updatedQuestion: Question = {
                                    ...tempQuestion,
                                    type,
                                    correctAnswer: "",
                                    correctAnswers: []
                                };
                                
                                if (type === "MULTIPLE_CHOICE") {
                                    updatedQuestion.choices = ["", ""];
                                    updatedQuestion.correctAnswers = undefined;
                                } else if (type === "TRUE_FALSE") {
                                    updatedQuestion.choices = ["True", "False"];
                                    updatedQuestion.correctAnswers = undefined;
                                } else if (type === "FILL_IN_BLANK") {
                                    updatedQuestion.choices = undefined;
                                    updatedQuestion.correctAnswers = [""];
                                }
                                
                                setTempQuestion(updatedQuestion);
                            }}
                        >
                            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                            <option value="TRUE_FALSE">True/False</option>
                            <option value="FILL_IN_BLANK">Fill in the Blank</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group style={{ width: "100px" }}>
                        <Form.Control
                            type="number"
                            value={tempQuestion.points}
                            onChange={(e) => setTempQuestion({ ...tempQuestion, points: parseInt(e.target.value) || 0 })}
                            placeholder="Points"
                        />
                    </Form.Group>
                </div>

                <Form.Group className="mb-3">
                    <Form.Label>Question Title</Form.Label>
                    <Form.Control
                        type="text"
                        value={tempQuestion.title}
                        onChange={(e) => setTempQuestion({ ...tempQuestion, title: e.target.value })}
                        placeholder="Enter question title"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Question Text</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={2}
                        value={tempQuestion.question}
                        onChange={(e) => setTempQuestion({ ...tempQuestion, question: e.target.value })}
                        placeholder="Enter question text"
                    />
                </Form.Group>

                {tempQuestion.type === "MULTIPLE_CHOICE" && tempQuestion.choices && (
                    <div>
                        {tempQuestion.choices.map((choice, choiceIndex) => (
                            <Form.Group key={choiceIndex} className="mb-2">
                                <div className="d-flex align-items-center">
                                    <Form.Check
                                        type="radio"
                                        name={`question-${editingIndex}-options`}
                                        checked={choice === tempQuestion.correctAnswer}
                                        onChange={() => {
                                            if (choice.trim() !== "") {
                                                setTempQuestion({ ...tempQuestion, correctAnswer: choice });
                                            }
                                        }}
                                        className="me-2"
                                    />
                                    <Form.Control
                                        type="text"
                                        value={choice}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            const updatedChoices = [...tempQuestion.choices!];
                                            updatedChoices[choiceIndex] = newValue;
                                            
                                            setTempQuestion({
                                                ...tempQuestion,
                                                choices: updatedChoices,
                                                correctAnswer: choice === tempQuestion.correctAnswer ? newValue : tempQuestion.correctAnswer
                                            });
                                        }}
                                        placeholder="Enter option text"
                                    />
                                    {tempQuestion.choices && tempQuestion.choices.length > 2 && (
                                        <Button
                                            variant="link"
                                            className="text-danger"
                                            onClick={() => deleteChoice(choiceIndex)}
                                        >
                                            <FaTimes />
                                        </Button>
                                    )}
                                </div>
                            </Form.Group>
                        ))}
                        <Button variant="link" onClick={addChoice}>
                            Add Another Choice
                        </Button>
                    </div>
                )}

                {tempQuestion.type === "TRUE_FALSE" && (
                    <Form.Group>
                        <Form.Check
                            type="radio"
                            label="True"
                            checked={tempQuestion.correctAnswer === "True"}
                            onChange={() => setTempQuestion({ ...tempQuestion, correctAnswer: "True" })}
                            className="mb-2"
                        />
                        <Form.Check
                            type="radio"
                            label="False"
                            checked={tempQuestion.correctAnswer === "False"}
                            onChange={() => setTempQuestion({ ...tempQuestion, correctAnswer: "False" })}
                        />
                    </Form.Group>
                )}

                {tempQuestion.type === "FILL_IN_BLANK" && (
                    <div>
                        <Form.Label>Correct Answers</Form.Label>
                        <p className="text-muted small">Add multiple possible correct answers. The answer will be marked correct if it matches any of these answers.</p>
                        {(tempQuestion.correctAnswers || []).map((answer, answerIndex) => (
                            <Form.Group key={answerIndex} className="mb-2">
                                <div className="d-flex align-items-center">
                                    <Form.Control
                                        type="text"
                                        value={answer}
                                        onChange={(e) => updateBlankAnswer(answerIndex, e.target.value)}
                                        placeholder="Enter a correct answer"
                                    />
                                    {(tempQuestion.correctAnswers?.length || 0) > 1 && (
                                        <Button
                                            variant="link"
                                            className="text-danger"
                                            onClick={() => deleteBlankAnswer(answerIndex)}
                                        >
                                            <FaTimes />
                                        </Button>
                                    )}
                                </div>
                            </Form.Group>
                        ))}
                        <Button variant="link" onClick={addBlankAnswer}>
                            Add Another Correct Answer
                        </Button>
                    </div>
                )}
            </div>
        );
    };

    const renderQuestionPreview = (question: Question, index: number) => {
        return (
            <Card key={index} className="mb-3">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <FaGripVertical className="me-2" />
                        <span>Question {index + 1}</span>
                    </div>
                    <div className="d-flex align-items-center">
                        <span className="me-3">{question.points} pts</span>
                        <Button
                            variant="link"
                            className="p-0 me-2"
                            onClick={() => handleEditQuestion(index)}
                        >
                            <FaPencilAlt />
                        </Button>
                        <Button
                            variant="link"
                            className="p-0 text-danger"
                            onClick={() => handleDeleteQuestion(index)}
                        >
                            <FaTimes />
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    <h6>{question.title}</h6>
                    <p>{question.question}</p>
                    {question.type === "MULTIPLE_CHOICE" && question.choices && (
                        <div>
                            {question.choices.map((choice, i) => (
                                <div key={i} className="mb-2">
                                    <Form.Check
                                        type="radio"
                                        label={choice}
                                        checked={choice === question.correctAnswer}
                                        disabled
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    {question.type === "TRUE_FALSE" && (
                        <div>
                            <Form.Check
                                type="radio"
                                label="True"
                                checked={question.correctAnswer === "True"}
                                disabled
                                className="mb-2"
                            />
                            <Form.Check
                                type="radio"
                                label="False"
                                checked={question.correctAnswer === "False"}
                                disabled
                            />
                        </div>
                    )}
                    {question.type === "FILL_IN_BLANK" && (
                        <div>
                            <Form.Control
                                type="text"
                                placeholder="Enter your answer"
                                disabled
                            />
                            <small className="text-muted mt-2 d-block">
                                Correct answers: {question.correctAnswers?.join(' or ')}
                            </small>
                        </div>
                    )}
                </Card.Body>
            </Card>
        );
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Questions ({questions.length})</h5>
                <div>
                    <span className="me-3">Total Points: {totalPoints}</span>
                    <Button onClick={addQuestion}>
                        <FaPlus className="me-2" />
                        New Question
                    </Button>
                </div>
            </div>

            {questions.map((question, index) => (
                <div key={index}>
                    {editingIndex === index ? (
                        <div>
                            {renderQuestionEditor()}
                            <div className="d-flex justify-content-end gap-2 mb-3">
                                <Button variant="secondary" onClick={handleCancelEdit}>
                                    Cancel
                                </Button>
                                <Button variant="success" onClick={() => handleSaveQuestion(index)}>
                                    Save
                                </Button>
                            </div>
                        </div>
                    ) : (
                        renderQuestionPreview(question, index)
                    )}
                </div>
            ))}
        </div>
    );
}

export default QuizQuestions; 