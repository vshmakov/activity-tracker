import React from 'react';
import {ToDoList} from "./ToDo/ToDoList";
import {WithState} from "./WithState";
import {observer} from "mobx-react";
import {SelectFile} from "./SelectFile";

export const App = observer(({state}: WithState) => {
    if (null === state.currentFile) {
        return (
            <div>
                <SelectFile state={state}/>
            </div>
        )
    }

    return (
        <div>
            <ToDoList state={state}/>
        </div>
    )
})
