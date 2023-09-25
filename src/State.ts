import {makeAutoObservable} from "mobx";
import {ToDo} from "./ToDo/ToDo";

export class State {
    public toDos: ToDo[] = []

    constructor() {
        makeAutoObservable(this)

        this.toDos.push(
            new ToDo('Wash my car')
        )
    }
}
