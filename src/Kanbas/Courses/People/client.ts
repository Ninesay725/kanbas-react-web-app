import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;

export const findUsersEnrolledInCourse = async (courseId: string) => {
    const response = await axiosWithCredentials.get(
        `${COURSES_API}/${courseId}/users`
    );
    return response.data;
};

export const createUser = async (courseId: string, user: any) => {
    const response = await axiosWithCredentials.post(
        `${COURSES_API}/${courseId}/users`,
        user
    );
    return response.data;
};

export const updateUser = async (courseId: string, userId: string, user: any) => {
    const response = await axiosWithCredentials.put(
        `${COURSES_API}/${courseId}/users/${userId}`,
        user
    );
    return response.data;
};

export const deleteUser = async (courseId: string, userId: string) => {
    const response = await axiosWithCredentials.delete(
        `${COURSES_API}/${courseId}/users/${userId}`
    );
    return response.data;
};

export const findUsersByRole = async (courseId: string, role: string) => {
    const response = await axiosWithCredentials.get(
        `${COURSES_API}/${courseId}/users/role/${role}`
    );
    return response.data;
}; 