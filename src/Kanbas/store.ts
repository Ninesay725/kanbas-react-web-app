import { configureStore } from "@reduxjs/toolkit";
import modulesReducer from "./Courses/Modules/reducer";
import assignmentsReducer from "./Courses/Assignments/reducer";
import enrollmentsReducer from "./Courses/Enrollments/reducer";
import accountReducer from "./Account/reducer";
import peopleReducer from "./Courses/People/reducer";

const store = configureStore({
    reducer: {
        modulesReducer,
        assignmentsReducer,
        enrollmentsReducer,
        accountReducer,
        peopleReducer
    }
});

export default store;
