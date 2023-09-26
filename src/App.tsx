import React from 'react';
import {ToDoList} from "./ToDo/ToDoList";
import {WithState} from "./WithState";
import {observer} from "mobx-react";
import {ChooseSource} from "./ChooseSource";

export const App = observer(({state}: WithState) => {
    return (
        <div>
            <ChooseSource state={state}/>
            <ToDoList state={state}/>
        </div>
    );
})
