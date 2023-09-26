import {makeAutoObservable, toJS} from "mobx";
import {ToDo} from "./ToDo/ToDo";
import {getNewFileHandle, readFile, verifyPermission, writeFile} from "./fs-helpers";
import {createIDB} from "./idb-keyval-iife";
import {IndexDBKey} from "./IndexDBKey";
import {IndexDBConnection} from "./IndexDBConnection";

export class State {
    public toDos: ToDo[] = []
    public currentFile: FileSystemFileHandle | null = null
    public recentFiles: FileSystemFileHandle[] = []
    private indexDBConnection: IndexDBConnection

    public constructor() {
        makeAutoObservable(this)

        this.toDos.push(
            new ToDo('Wash my car')
        )
        this.indexDBConnection = createIDB() as IndexDBConnection
        this.getRecentFiles()
    }

    private async getRecentFiles(): Promise<void> {
        this.setRecentFiles(await this.indexDBConnection.get(IndexDBKey.RecentFiles) || [])
    }

    private async addRecent(file: FileSystemFileHandle): Promise<void> {
        if (!file.isSameEntry) {
            return;
        }

        const inList = await Promise.all(this.recentFiles.map((f) => file.isSameEntry(f)));

        if (inList.some((val) => val)) {
            return;
        }

        this.updateRecents(file);
    };

    private updateRecents(file: FileSystemFileHandle): void {
        this.recentFiles.unshift(file);

        if (this.recentFiles.length > 5) {
            this.recentFiles.pop();
        }

        this.indexDBConnection.set(IndexDBKey.RecentFiles, toJS(this.recentFiles))
    }

    private setRecentFiles(recentFiles: FileSystemFileHandle[]): void {
        this.recentFiles = recentFiles
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

            this.setCurrentFile(file);
            this.addRecent(file)
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

    private setCurrentFile(file: FileSystemFileHandle): void {
        this.currentFile = file
    }

    private serializeContent(): string {
        return JSON.stringify(this.toDos, null, 2)
    }

    public async readCurrentFile(): Promise<void> {
        if (null === this.currentFile) {
            return
        }

        if (!await verifyPermission(this.currentFile, true)) {
            return
        }

        const toDos = JSON.parse(
            await readFile(
                await this.currentFile.getFile()
            )
        )
        this.setToDos(toDos)
    }

    private setToDos(toDos: ToDo[]): void {
        this.toDos = toDos
    }
}
