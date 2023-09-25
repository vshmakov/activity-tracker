import React from 'react';
import {observer} from "mobx-react";
import {WithState} from "../WithState";
import {ToDo} from "./ToDo";

export const ToDoItem = observer(({toDo}: { toDo: ToDo }) => {
    return (
        <li>{toDo.title}</li>
    )
})
