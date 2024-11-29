import axios from "axios";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;

export const createQuiz = async (courseId: string, quiz: any) => {
    const response = await axios.post(
        `${QUIZZES_API}/${courseId}/quizzes`,
        quiz
    );
    return response.data;
};

export const findQuizzesForCourse = async (courseId: string) => {
    const response = await axios.get(
        `${QUIZZES_API}/${courseId}/quizzes`
    );
    return response.data;
};

export const findQuizById = async (quizId: string) => {
    const response = await axios.get(`${QUIZZES_API}/${quizId}`);
    return response.data;
};

export const updateQuiz = async (quizId: string, quiz: any) => {
    const response = await axios.put(
        `${QUIZZES_API}/${quizId}`,
        quiz
    );
    return response.data;
};

export const deleteQuiz = async (quizId: string) => {
    const response = await axios.delete(`${QUIZZES_API}/${quizId}`);
    return response.data;
};

export const addQuestionToQuiz = async (quizId: string, question: any) => {
    const response = await axios.post(
        `${QUIZZES_API}/${quizId}/questions`,
        question
    );
    return response.data;
};

export const updateQuizQuestion = async (
    quizId: string,
    questionId: string,
    question: any
) => {
    const response = await axios.put(
        `${QUIZZES_API}/${quizId}/questions/${questionId}`,
        question
    );
    return response.data;
};

export const deleteQuizQuestion = async (quizId: string, questionId: string) => {
    const response = await axios.delete(
        `${QUIZZES_API}/${quizId}/questions/${questionId}`
    );
    return response.data;
}; 