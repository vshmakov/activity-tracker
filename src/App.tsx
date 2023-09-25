import React from 'react';
import {ToDoList} from "./ToDo/ToDoList";
import {WithState} from "./WithState";
import {observer} from "mobx-react";


export const App = observer(({state}: WithState) => {
    return (
        <div>
            <ToDoList state={state}/>
        </div>
    );
})
