import React from 'react';
import {ToDoList} from "./ToDo/ToDoList";
import {WithState} from "./WithState";
import {observer} from "mobx-react";

export const ChooseSource = observer(({state}: WithState) => {
    return (
        <div>
            {state.currentFile !== null ?
                (<button onClick={() => state.readCurrentFile()}>
                        {state.currentFile?.name}
                    </button>
                ) : null}
            <button onClick={() => state.createNewFile()}>
                Create new file
            </button>
        </div>
    );
})
