export const isFaculty = (user: any) => {
    return user?.role === "FACULTY" || user?.role === "ADMIN";
};
