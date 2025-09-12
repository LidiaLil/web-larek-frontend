import { IItem } from "../../types";
import { IEvents } from "../base/events";
import { AppStateChanges } from "./AppState";

export interface ICards {
    items: IItem[];
    // item: string;
    setItems(items:IItem[]): void;
}


export class CardsModel implements ICards {
    protected _items: IItem[];
    protected _item: string;
    protected events: IEvents;
    constructor(events:IEvents) {
        this.events = events;
    }
    get items():IItem[]{
        return this._items //Получить список товаров
    }
    setItems(items:IItem[]): void {
        this._items = items;
        this.events.emit(AppStateChanges.items, {items: this._items});
    } 

    
}