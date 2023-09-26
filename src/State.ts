import {makeAutoObservable} from "mobx";
import {ToDo} from "./ToDo/ToDo";
import {getNewFileHandle, writeFile} from "./fs-helpers";
import {createIDB} from "./idb-keyval-iife";
import {IndexDBKey} from "./IndexDBKey";
import {IndexDBConnection} from "./IndexDBConnection";

export class State {
    public toDos: ToDo[] = []
    public currentFile: FileSystemFileHandle | null = null
    private indexDBConnection: IndexDBConnection

    public constructor() {
        makeAutoObservable(this)

        this.toDos.push(
            new ToDo('Wash my car')
        )
        this.indexDBConnection = createIDB() as IndexDBConnection
        this.usePreviousFile()
    }

    private async usePreviousFile(): Promise<void> {
        this.setCurrentFile(await this.indexDBConnection.get(IndexDBKey.CurrentFile) || null)
    }

    private setCurrentFile(currentFile: FileSystemFileHandle | null): void {
        this.currentFile = currentFile
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
            this.indexDBConnection.set(IndexDBKey.CurrentFile, this.currentFile)
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

    private serializeContent(): string {
        return JSON.stringify(this.toDos, null, 2)
    }

    public readCurrentFile(): void {

    }
}
