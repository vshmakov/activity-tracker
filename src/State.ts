import {makeAutoObservable} from "mobx";
import {ToDo} from "./ToDo/ToDo";
import {getConfig} from "@testing-library/react";
import {getNewFileHandle, writeFile} from "./fs-helpers";

export class State {
    public toDos: ToDo[] = []
    public currentFile: FileSystemFileHandle | null = null

    constructor() {
        makeAutoObservable(this)

        this.toDos.push(
            new ToDo('Wash my car')
        )
    }

    public async createNewFile(): Promise<void> {
        try {
            const file = await getNewFileHandle()

            try {
                await writeFile(file, this.serializeContent());
            } catch (exception) {
                const message = 'Unable to save file.';
                console.error(message, exception);
                alert(message);

                return;
            }

            this.currentFile = file
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

    private serializeContent():string {
        return JSON.stringify(this.toDos, null, 2)
    }

    private readFile(file: FileSystemFileHandle): void {
        this.currentFile = file
    }
}
