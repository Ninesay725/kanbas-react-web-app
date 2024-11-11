import React, { useState } from "react";

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;

export default function WorkingWithArrays() {
    const API = `${REMOTE_SERVER}/lab5/todos`;
    const [todo, setTodo] = useState({
        id: "1",
        title: "NodeJS Assignment",
        description: "Create a NodeJS server with ExpressJS",
        due: "2021-09-09",
        completed: false,
    });

    return (
        <div id="wd-working-with-arrays">
            <h3>Working with Arrays</h3>
            <h4>Retrieving Arrays</h4>
            <a 
                id="wd-retrieve-todos" 
                className="btn btn-primary" 
                href={API}
            >
                Get Todos
            </a>
            <hr/>

            <h4>Retrieving an Item from an Array by ID</h4>
            <a 
                id="wd-retrieve-todo-by-id" 
                className="btn btn-primary float-end" 
                href={`${API}/${todo.id}`}
            >
                Get Todo by ID
            </a>
            <input 
                id="wd-todo-id" 
                defaultValue={todo.id} 
                className="form-control w-50"
                onChange={(e) => setTodo({ ...todo, id: e.target.value })} 
            />
            <hr/>

            <h4>Filtering Array Items</h4>
            <a 
                id="wd-retrieve-completed-todos" 
                className="btn btn-primary"
                href={`${API}?completed=true`}
            >
                Get Completed Todos
            </a>
            <hr/>

            <h4>Creating new Items in an Array</h4>
            <a 
                id="wd-create-todo" 
                className="btn btn-primary"
                href={`${API}/create`}
            >
                Create Todo
            </a>
            <hr/>

            <h4>Updating an Item in an Array</h4>
            <div className="mb-3">
                <label>ID and Title</label>
                <div className="d-flex mb-2">
                    <input 
                        defaultValue={todo.id} 
                        className="form-control w-25 me-2"
                        onChange={(e) => setTodo({ ...todo, id: e.target.value })}
                    />
                    <input 
                        defaultValue={todo.title} 
                        className="form-control w-50"
                        onChange={(e) => setTodo({ ...todo, title: e.target.value })}
                    />
                </div>
                <a 
                    href={`${API}/${todo.id}/title/${todo.title}`} 
                    className="btn btn-primary"
                >
                    Update Title
                </a>
            </div>

            <div className="mb-3">
                <label>Description</label>
                <input 
                    defaultValue={todo.description} 
                    className="form-control w-75 mb-2"
                    onChange={(e) => setTodo({ ...todo, description: e.target.value })}
                />
                <a 
                    href={`${API}/${todo.id}/description/${todo.description}`} 
                    className="btn btn-success"
                >
                    Update Description
                </a>
            </div>

            <div className="mb-3">
                <label className="d-block">Completed Status</label>
                <div className="form-check mb-2">
                    <input 
                        type="checkbox"
                        className="form-check-input"
                        checked={todo.completed}
                        onChange={(e) => setTodo({ ...todo, completed: e.target.checked })}
                    />
                    <label className="form-check-label">
                        Mark as completed
                    </label>
                </div>
                <a 
                    href={`${API}/${todo.id}/completed/${todo.completed}`} 
                    className="btn btn-warning"
                >
                    Update Completed Status
                </a>
            </div>
            <hr/>

            <h4>Deleting from an Array</h4>
            <a 
                id="wd-delete-todo" 
                className="btn btn-primary float-end" 
                href={`${API}/${todo.id}/delete`}
            >
                Delete Todo with ID = {todo.id}
            </a>
            <input 
                defaultValue={todo.id} 
                className="form-control w-50"
                onChange={(e) => setTodo({ ...todo, id: e.target.value })}
            />
            <hr/>
        </div>
    );
} 