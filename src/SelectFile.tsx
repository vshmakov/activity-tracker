import React from 'react';
import {WithState} from "./WithState";
import {observer} from "mobx-react";

export const SelectFile = observer(({state}: WithState) => {
    return (
        <div>
            {state.recentFiles.map(file => (
                <button onClick={() => state.readFile(file)}>
                    {file.name}
                </button>
            ))}
            <button onClick={() => state.createNewFile()}>
                Create new file
            </button>
        </div>
    );
})
