import axios from "axios";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const API_BASE = REMOTE_SERVER ? `${REMOTE_SERVER}/api` : "http://localhost:4000/api";

export const createQuiz = async (courseId: string, quiz: any) => {
    const response = await axios.post(
        `${API_BASE}/courses/${courseId}/quizzes`,
        quiz
    );
    return response.data;
};

export const findQuizzesForCourse = async (courseId: string) => {
    const response = await axios.get(
        `${API_BASE}/courses/${courseId}/quizzes`
    );
    return response.data;
};

export const findQuizById = async (quizId: string) => {
    const response = await axios.get(`${API_BASE}/quizzes/${quizId}`);
    return response.data;
};

export const updateQuiz = async (quizId: string, quiz: any) => {
    const response = await axios.put(
        `${API_BASE}/quizzes/${quizId}`,
        quiz
    );
    return response.data;
};

export const deleteQuiz = async (quizId: string) => {
    const response = await axios.delete(`${API_BASE}/quizzes/${quizId}`);
    return response.data;
};

export const addQuestionToQuiz = async (quizId: string, question: any) => {
    const response = await axios.post(
        `${API_BASE}/quizzes/${quizId}/questions`,
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
        `${API_BASE}/quizzes/${quizId}/questions/${questionId}`,
        question
    );
    return response.data;
};

export const deleteQuizQuestion = async (quizId: string, questionId: string) => {
    const response = await axios.delete(
        `${API_BASE}/quizzes/${quizId}/questions/${questionId}`
    );
    return response.data;
};

export const createQuizAttempt = async (attempt: any) => {
    const response = await axios.post(
        `${API_BASE}/quiz-attempts`,
        attempt
    );
    return response.data;
};

export const findQuizAttemptsByUser = async (userId: string) => {
    const response = await axios.get(
        `${API_BASE}/users/${userId}/quiz-attempts`
    );
    return response.data;
};

export const findQuizAttempts = async (quizId: string) => {
    const response = await axios.get(
        `${API_BASE}/quizzes/${quizId}/attempts`
    );
    return response.data;
};

export const findQuizAttemptById = async (attemptId: string) => {
    const response = await axios.get(
        `${API_BASE}/quiz-attempts/${attemptId}`
    );
    return response.data;
};

export const copyQuizToCourse = async (quizId: string, targetCourseId: string) => {
    try {
        // First, get the original quiz
        const originalQuiz = await findQuizById(quizId);
        
        // Create a new quiz object without the _id field
        const { _id, course, ...quizData } = originalQuiz;
        
        // Create the copy in the target course
        const newQuiz = {
            ...quizData,
            course: targetCourseId,
            title: `${quizData.title} (Copy)`
        };
        
        // Create the new quiz
        const response = await createQuiz(targetCourseId, newQuiz);
        
        // If the original quiz has questions, copy them too
        if (originalQuiz.questions && originalQuiz.questions.length > 0) {
            for (const question of originalQuiz.questions) {
                const { _id, ...questionData } = question;
                await addQuestionToQuiz(response._id, questionData);
            }
        }
        
        return response;
    } catch (error) {
        console.error("Error in copyQuizToCourse:", error);
        throw error;
    }
};

export const findAllCourses = async () => {
    const response = await axios.get(`${API_BASE}/courses`);
    return response.data;
};