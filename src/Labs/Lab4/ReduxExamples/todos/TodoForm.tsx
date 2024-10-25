import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";

export default function TodoForm() {
    const { todo } = useSelector((state: any) => state.todosReducer);
    const dispatch = useDispatch();
    
    return (
        <li className="list-group-item">
            <input 
                defaultValue={todo.title}
                className="form-control d-inline-block w-50"
                onChange={(e) => dispatch(setTodo({ ...todo, title: e.target.value }))}
            />
            <span className="float-end">
                <button 
                    onClick={() => dispatch(updateTodo(todo))}
                    id="wd-update-todo-click"
                    className="btn btn-warning me-2"
                >
                    Update
                </button>
                <button 
                    onClick={() => dispatch(addTodo(todo))}
                    id="wd-add-todo-click"
                    className="btn btn-success"
                >
                    Add
                </button>
            </span>
        </li>
    );
}
