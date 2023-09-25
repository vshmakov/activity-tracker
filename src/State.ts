import {makeAutoObservable} from "mobx";
import {ToDo} from "./ToDo/ToDo";
import {getConfig} from "@testing-library/react";
import {getNewFileHandle, writeFile} from "./fs-helpers";

export class State {
    public toDos: ToDo[] = []

    constructor() {
        makeAutoObservable(this)

        this.toDos.push(
            new ToDo('Wash my car')
        )
    }

    public async save(): Promise<void> {
        try {
            const fileHandle = await getNewFileHandle()

            try {
                await writeFile(fileHandle, 'sample text');
            } catch (exception) {
                const message = 'Unable to save file.';
                console.error(message, exception);
                alert(message);

                return;
            }
        } catch (exception) {
            if (exception instanceof DOMException && exception.name === 'AbortError') {
                return;
            }

            const message = 'An error occured trying to open the file.';
            console.error(message, exception);
            alert(message);

            return
        }
    }
}
