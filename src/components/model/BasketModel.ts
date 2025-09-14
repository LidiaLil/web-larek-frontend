import { IItem } from "../../types";
import { IEvents } from "../base/events";
import { AppStateChanges } from "./AppState";

export interface IBasketModel {
    //====== Методы для работы с корзиной ======
    addToBasket(item: IItem): void;
    removeFromBasket(id: string): void;
    // clearBasket(): void;
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

    // Добавить товар в корзину
    addToBasket(item: IItem): void {
        // Проверяем, нет ли уже такого товара в корзине
        if (!this.isInBasket(item.id)) {
            this._items.push(item);
            // вызываем событие
            this.events.emit(AppStateChanges.basket, this._items);
        }
    }

    // Удалить товар из корзины
    removeFromBasket(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
        this.events.emit(AppStateChanges.basket, this._items);
    }

    // Получить общую сумму товаров в корзине
    getBasketTotal(): number {
        return this._items.reduce((total, item) => total + item.price, 0);
    }

    // Получить количество товаров в корзине
    getBasketCount(): number {
        return this._items.length;
    }

    // Проверить, есть ли товар в корзине
    isInBasket(id: string): boolean {
        return this._items.some(item => item.id === id);
    }

    // Получить все товары из корзины
    getItems(): IItem[] {
        return [...this._items]; // Возвращаем копию массива
    }
}