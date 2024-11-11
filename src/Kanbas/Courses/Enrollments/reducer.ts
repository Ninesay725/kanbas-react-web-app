import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    enrollments: [],
    showAllCourses: false,
};

const enrollmentsSlice = createSlice({
    name: "enrollments",
    initialState,
    reducers: {
        setEnrollments: (state: any, action) => {
            state.enrollments = action.payload;
        },
        enroll: (state: any, { payload: enrollment }) => {
            state.enrollments = [...state.enrollments, enrollment] as any;
        },
        unenroll: (state: any, { payload: { studentId, courseId } }) => {
            state.enrollments = state.enrollments.filter(
                (e: any) => !(e.user === studentId && e.course === courseId)
            );
        },
        toggleShowAllCourses: (state: any) => {
            state.showAllCourses = !state.showAllCourses;
        },
    },
});

export const { setEnrollments, enroll, unenroll, toggleShowAllCourses } = 
    enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
