import React from 'react';
import {WithState} from "./WithState";
import {observer} from "mobx-react";

export const SelectFile = observer(({state}: WithState) => {
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
