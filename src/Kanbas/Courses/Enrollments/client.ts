import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const ENROLLMENTS_API = `${REMOTE_SERVER}/api/enrollments`;

export const enrollStudentInCourse = async (studentId: string, courseId: string) => {
    const response = await axiosWithCredentials.post(ENROLLMENTS_API, {
        user: studentId,
        course: courseId
    });
    return response.data;
};

export const unenrollStudentFromCourse = async (studentId: string, courseId: string) => {
    const response = await axiosWithCredentials.delete(
        `${ENROLLMENTS_API}/${studentId}/${courseId}`
    );
    return response.data;
};

export const findAllEnrollments = async () => {
    const response = await axiosWithCredentials.get(ENROLLMENTS_API);
    return response.data;
};

export const findEnrollmentByCourseAndStudent = async (courseId: string, studentId: string) => {
    const response = await axiosWithCredentials.get(
        `${ENROLLMENTS_API}/${courseId}/${studentId}`
    );
    return response.data;
};