import { IItem } from "../../types";
import { IEvents } from "../base/events";
import { AppStateChanges } from "./AppState";

export interface IBasketModel {
    //====== Методы для работы с корзиной ======
    addToBasket(item: IItem): void;
    removeFromBasket(id: string): void;
    clearBasket(): void;
    getBasketTotal(): number;
    getBasketCount(): number;
    isInBasket(id: string): boolean; // Проверка наличия товара в корзине
    getItems(): IItem[]; //Получить список товаров в корине
}

export class BasketModel implements IBasketModel {
    protected _items: IItem[];
    protected events: IEvents;

    constructor(events: IEvents) {
        this._items = [];
        this.events = events;
    }

    addToBasket(item: IItem): void {
        // Проверяем, нет ли уже такого товара в корзине
        if (!this.isInBasket(item.id)) {
            this._items.push(item);
            // вызываем событие
            this.events.emit(AppStateChanges.basket, this._items);
        }
    }

    removeFromBasket(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
        this.events.emit(AppStateChanges.basket, this._items);
    }

    clearBasket(): void {
        this._items = [];
        this.events.emit(AppStateChanges.basket, this._items);
    }

    getBasketTotal(): number {
        return this._items.reduce((total, item) => total + item.price, 0);
    }

    getBasketCount(): number {
        return this._items.length;
    }

    isInBasket(id: string): boolean {
        return this._items.some(item => item.id === id);
    }

    getItems(): IItem[] {
        return [...this._items]; // Возвращаем копию массива
    }
}