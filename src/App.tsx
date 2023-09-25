import React from 'react';
import {ToDoList} from "./ToDo/ToDoList";
import {WithState} from "./WithState";
import {observer} from "mobx-react";
import {SaveButton} from "./SaveButton";

export const App = observer(({state}: WithState) => {
    return (
        <div>
            <SaveButton state={state}/>
            <ToDoList state={state}/>
        </div>
    );
})
