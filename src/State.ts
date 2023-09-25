import {makeAutoObservable} from "mobx";
import {ToDo} from "./ToDo/ToDo";
import {getConfig} from "@testing-library/react";
import {getNewFileHandle} from "./fs-helpers";

export class State {
    public toDos: ToDo[] = []

    constructor() {
        makeAutoObservable(this)

        this.toDos.push(
            new ToDo('Wash my car')
        )
    }

    public async save(): Promise<void> {
        const fileHandle = await getNewFileHandle()
    }
}
