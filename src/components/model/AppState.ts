import { IItem } from "../../types";
import { IEvents } from "../base/events";

//  Какие модальные окна у нас есть
export enum AppStateModals {
	item = 'modal:item',        // Описание товара (добавить/убрать из корзины)
    place = 'modal:place',      // Адрес и способ оплаты
    basket = 'modal:basket',    // Корзина (пустая или с товарами)
    contacts = 'modal:contacts', // Телефон и email
    success = 'modal:success',  // Заказ оформлен
    error = 'modal:error',      // Ошибка (если не указан адрес и т.д.)
    none = 'modal:none',        // Нет открытых модалок
}

// Какие изменения состояния приложения могут происходить
export enum AppStateChanges {
    items = 'items:change', // когда загрузились все товары с сервера
    select = 'item:select', // когда пользователь выбирает товар для просмотра
    modalOpen = 'modal:open', // при открытии любой модалки
    modalClose = 'modal:close', // при закрытии любой модалки
    basket = 'basket:changed',// при добавлении/удалении из корзины
    basketOpen = 'basket:open',// открытие корзины
    total = 'total:change',  // Изменилась сумма корзины
    order = 'order:change', // при заполнении данных заказа 
    orderOpen = 'order:open',// открытие формы заказа
    contactsOpen = 'сщтефсе:open',// открытие формы контактов
    message = 'message:change', // при показе сообщения об ошибке или успехе
    
}

export class AppState {
    private _items: IItem[] = [];
    private _selectedItem: IItem | null = null; // Свойство для хранения выбранного товара

    constructor(
        protected data: Partial<AppState>, //все свойства AppState становятся необязательными
        protected events: IEvents) {}

        // Метод для установки списка товаров
        setItems(items: IItem[]): void {
        this._items = items;
        this.events.emit(AppStateChanges.items);
    }

    // Метод для установки выбранного товара
    setSelectedItem(item: IItem): void {
        this._selectedItem = item;//Сохраняем данные
        this.events.emit(AppStateChanges.select, item); // Уведомляем систему
    }

    // Геттер для получения списка товаров
    get items(): IItem[] {
        return this._items;
    }

    // Геттер для получения выбранного товара
    get selectedItem(): IItem | null {
        return this._selectedItem;
    }

    // Дополнительно можно добавить метод очистки выбранного товара
    clearSelectedItem(): void {
        this._selectedItem = null;
        this.events.emit(AppStateChanges.select, null);
    }
}