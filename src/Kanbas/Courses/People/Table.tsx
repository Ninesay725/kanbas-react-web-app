import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaUserCircle, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setUsers, addUser, updateUser, deleteUser } from "./reducer";
import { isFaculty } from "../../utils/permissions";
import * as client from "./client";

export default function PeopleTable() {
    const { cid } = useParams();
    const dispatch = useDispatch();
    const users = useSelector((state: any) => state.peopleReducer.users);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [newUser, setNewUser] = useState({
        firstName: "",
        lastName: "",
        loginId: "",
        role: "STUDENT",
        section: "S101",
    });

    const fetchUsers = async () => {
        try {
            const users = await client.findUsersEnrolledInCourse(cid as string);
            dispatch(setUsers(users));
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [cid]);

    const handleCreateUser = async () => {
        try {
            const createdUser = await client.createUser(cid as string, newUser);
            dispatch(addUser(createdUser));
            setShowAddForm(false);
            setNewUser({
                firstName: "",
                lastName: "",
                loginId: "",
                role: "STUDENT",
                section: "S101",
            });
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    const handleUpdateUser = async (userId: string, updates: any) => {
        try {
            await client.updateUser(cid as string, userId, updates);
            dispatch(updateUser({ ...updates, _id: userId }));
            setEditingUser(null);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleRemoveUser = async (userId: string) => {
        if (window.confirm("Are you sure you want to remove this user?")) {
            try {
                await client.deleteUser(cid as string, userId);
                dispatch(deleteUser(userId));
            } catch (error) {
                console.error("Error removing user:", error);
            }
        }
    };

    return (
        <div id="wd-people-table">
            {isFaculty(currentUser) && (
                <div className="mb-3">
                    <button 
                        className="btn btn-success"
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        <FaPlus /> Add User
                    </button>
                    {showAddForm && (
                        <div className="card mt-2 p-3">
                            <input
                                className="form-control mb-2"
                                placeholder="First Name"
                                value={newUser.firstName}
                                onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                            />
                            <input
                                className="form-control mb-2"
                                placeholder="Last Name"
                                value={newUser.lastName}
                                onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                            />
                            <input
                                className="form-control mb-2"
                                placeholder="Login ID"
                                value={newUser.loginId}
                                onChange={(e) => setNewUser({ ...newUser, loginId: e.target.value })}
                            />
                            <select
                                className="form-control mb-2"
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            >
                                <option value="STUDENT">Student</option>
                                <option value="FACULTY">Faculty</option>
                                <option value="TA">TA</option>
                            </select>
                            <button 
                                className="btn btn-success"
                                onClick={handleCreateUser}
                            >
                                Create User
                            </button>
                        </div>
                    )}
                </div>
            )}

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Login ID</th>
                        <th>Section</th>
                        <th>Role</th>
                        <th>Last Activity</th>
                        <th>Total Activity</th>
                        {isFaculty(currentUser) && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {users.map((user: any) => (
                        <tr key={user._id}>
                            <td className="wd-full-name text-nowrap">
                                {editingUser?._id === user._id ? (
                                    <div className="d-flex gap-2">
                                        <input
                                            className="form-control"
                                            value={editingUser.firstName}
                                            onChange={(e) => setEditingUser({
                                                ...editingUser,
                                                firstName: e.target.value
                                            })}
                                        />
                                        <input
                                            className="form-control"
                                            value={editingUser.lastName}
                                            onChange={(e) => setEditingUser({
                                                ...editingUser,
                                                lastName: e.target.value
                                            })}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <FaUserCircle className="me-2 fs-1 text-secondary" />
                                        <span className="wd-first-name">{user.firstName}</span>{" "}
                                        <span className="wd-last-name">{user.lastName}</span>
                                    </>
                                )}
                            </td>
                            <td className="wd-login-id">{user.loginId}</td>
                            <td className="wd-section">{user.section}</td>
                            <td className="wd-role">
                                {editingUser?._id === user._id ? (
                                    <select
                                        className="form-control"
                                        value={editingUser.role}
                                        onChange={(e) => setEditingUser({
                                            ...editingUser,
                                            role: e.target.value
                                        })}
                                    >
                                        <option value="STUDENT">Student</option>
                                        <option value="FACULTY">Faculty</option>
                                        <option value="TA">TA</option>
                                    </select>
                                ) : (
                                    user.role
                                )}
                            </td>
                            <td className="wd-last-activity">{user.lastActivity}</td>
                            <td className="wd-total-activity">{user.totalActivity}</td>
                            {isFaculty(currentUser) && (
                                <td>
                                    {editingUser?._id === user._id ? (
                                        <div className="btn-group">
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleUpdateUser(user._id, editingUser)}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => setEditingUser(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="btn-group">
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => setEditingUser(user)}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleRemoveUser(user._id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
