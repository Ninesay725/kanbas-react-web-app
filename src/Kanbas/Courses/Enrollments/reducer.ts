import { createSlice } from "@reduxjs/toolkit";
import { enrollments } from "../../Database";

interface Enrollment {
    _id: string;
    user: string;
    course: string;
}

const initialState = {
    enrollments: enrollments as Enrollment[],
    showAllCourses: false
};

const enrollmentsSlice = createSlice({
    name: "enrollments",
    initialState,
    reducers: {
        toggleShowAllCourses: (state) => {
            state.showAllCourses = !state.showAllCourses;
        },
        enroll: (state, action) => {
            const { studentId, courseId } = action.payload;
            state.enrollments.push({
                _id: new Date().getTime().toString(),
                user: studentId,
                course: courseId
            });
        },
        unenroll: (state, action) => {
            const { studentId, courseId } = action.payload;
            state.enrollments = state.enrollments.filter(
                enrollment => !(enrollment.user === studentId && enrollment.course === courseId)
            );
        }
    }
});

export const { toggleShowAllCourses, enroll, unenroll } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
