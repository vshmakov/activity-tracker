import React from 'react';
import {ToDoList} from "./ToDo/ToDoList";
import {WithState} from "./WithState";
import {observer} from "mobx-react";

export const SaveButton = observer(({state}: WithState) => {
    return (
        <div>
            <button onClick={() => state.save()}>
                Save
            </button>
        </div>
    );
})
