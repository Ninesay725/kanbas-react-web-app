import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BsGripVertical } from "react-icons/bs";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import { useSelector, useDispatch } from "react-redux";
import { setModules, addModule, editModule, updateModule, deleteModule } from "./reducer";
import { isFaculty } from "../../utils/permissions";
import * as coursesClient from "../client";
import * as modulesClient from "./client";

export default function Modules() {
    const { cid } = useParams();
    const [moduleName, setModuleName] = useState("");
    const modules = useSelector((state: any) => state.modulesReducer.modules);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const dispatch = useDispatch();

    const saveModule = async (module: any) => {
        await modulesClient.updateModule(module);
        dispatch(updateModule(module));
    };

    const removeModule = async (moduleId: string) => {
        await modulesClient.deleteModule(moduleId);
        dispatch(deleteModule(moduleId));
    };

    const createModuleForCourse = async () => {
        if (!cid) return;
        const newModule = { name: moduleName, course: cid };
        const module = await coursesClient.createModuleForCourse(cid, newModule);
        dispatch(addModule(module));
        setModuleName("");
    };

    const fetchModules = async () => {
        const modules = await coursesClient.findModulesForCourse(cid as string);
        dispatch(setModules(modules));
    };

    useEffect(() => {
        fetchModules();
    }, []);

    return (
        <div>
            <ModulesControls 
                moduleName={moduleName}
                setModuleName={setModuleName}
                addModule={createModuleForCourse}
            />
            <br /><br /><br /><br />
            <ul id="wd-modules" className="list-group rounded-0">
                {modules.map((module: any) => (
                    <li key={module._id} className="wd-module list-group-item p-0 mb-5 fs-5 border-gray">
                        <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
                            <div>
                                <BsGripVertical className="me-2 fs-3" />
                                {!module.editing && module.name}
                                {module.editing && isFaculty(currentUser) && (
                                    <input 
                                        className="form-control w-50 d-inline-block"
                                        value={module.name}
                                        onChange={(e) => dispatch(
                                            updateModule({ ...module, name: e.target.value })
                                        )}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                saveModule({ ...module, editing: false });
                                            }
                                        }}
                                    />
                                )}
                            </div>
                            <ModuleControlButtons
                                moduleId={module._id}
                                deleteModule={(moduleId) => removeModule(moduleId)}
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
