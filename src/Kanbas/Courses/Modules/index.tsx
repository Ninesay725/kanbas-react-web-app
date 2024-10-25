import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { BsGripVertical } from "react-icons/bs";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import { useSelector, useDispatch } from "react-redux";
import { addModule, editModule, updateModule, deleteModule } from "./reducer";
import { isFaculty } from "../../utils/permissions";

export default function Modules() {
    const { cid } = useParams();
    const [moduleName, setModuleName] = useState("");
    const { modules } = useSelector((state: any) => state.modulesReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const dispatch = useDispatch();

    return (
        <div>
            <ModulesControls 
                moduleName={moduleName}
                setModuleName={setModuleName}
                addModule={() => {
                    dispatch(addModule({ name: moduleName, course: cid }));
                    setModuleName("");
                }}
            />
            <br /><br /><br /><br />
            <ul id="wd-modules" className="list-group rounded-0">
                {modules
                    .filter((module: any) => module.course === cid)
                    .map((module: any) => (
                        <li key={module._id} className="wd-module list-group-item p-0 mb-5 fs-5 border-gray">
                            <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
                                <div>
                                    <BsGripVertical className="me-2 fs-3" />
                                    {!module.editing && module.name}
                                    {module.editing && isFaculty(currentUser) && (
                                        <input 
                                            className="form-control w-50 d-inline-block"
                                            onChange={(e) => dispatch(
                                                updateModule({ ...module, name: e.target.value })
                                            )}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    dispatch(updateModule({ 
                                                        ...module, 
                                                        editing: false 
                                                    }));
                                                }
                                            }}
                                            defaultValue={module.name}
                                        />
                                    )}
                                </div>
                                <ModuleControlButtons
                                    moduleId={module._id}
                                    deleteModule={(moduleId) => dispatch(deleteModule(moduleId))}
                                    editModule={(moduleId) => dispatch(editModule(moduleId))}
                                />
                            </div>
                            {module.lessons && (
                                <ul className="wd-lessons list-group rounded-0">
                                    {module.lessons.map((lesson: any) => (
                                        <li key={lesson._id} className="wd-lesson list-group-item p-3 ps-1 d-flex justify-content-between align-items-center">
                                            <div>
                                                <BsGripVertical className="me-2 fs-3" />
                                                {lesson.name}
                                            </div>
                                            <LessonControlButtons />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
            </ul>
        </div>
    );
}
