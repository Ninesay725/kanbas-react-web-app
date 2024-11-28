import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const MODULES_API = `${REMOTE_SERVER}/api/modules`;

export const updateModule = async (moduleId: string, updates: any) => {
    const response = await axiosWithCredentials.put(
        `${MODULES_API}/${moduleId}`,
        updates
    );
    return response.data;
};

export const deleteModule = async (moduleId: string) => {
    const response = await axiosWithCredentials.delete(`${MODULES_API}/${moduleId}`);
    return response.data;
}; 