import React from 'react';
import {observer} from "mobx-react";
import {WithState} from "../WithState";
import {ToDo} from "./ToDo";
import {ToDoItem} from "./ToDoItem";

export const ToDoList = observer(({state}: WithState) => {
    return (
        <div>
            <ul>
                {state.toDos
                    .map((toDo: ToDo) => <ToDoItem toDo={toDo} key={toDo.title}/>)}
            </ul>
        </div>
    )
})
