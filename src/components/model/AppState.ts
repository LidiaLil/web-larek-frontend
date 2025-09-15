import { IBasket, IItem, IOrder, IUser, PaymentMethod } from '../../types';
import { IEvents } from '../base/events';

//  Какие модальные окна у нас есть
export enum AppStateModals {
	item = 'modal:item', // Описание товара (добавить/убрать из корзины)
	place = 'modal:place', // Адрес и способ оплаты
	basket = 'modal:basket', // Корзина (пустая или с товарами)
	contacts = 'modal:contacts', // Телефон и email
	success = 'modal:success', // Заказ оформлен
	error = 'modal:error', // Ошибка (если не указан адрес и т.д.)
	none = 'modal:none', // Нет открытых модалок
}

// Какие изменения состояния приложения могут происходить
export enum AppStateChanges {
	items = 'items:change', // когда загрузились все товары с сервера
	select = 'item:select', // когда пользователь выбирает товар для просмотра
	modalOpen = 'modal:open', // при открытии любой модалки
	modalClose = 'modal:close', // при закрытии любой модалки
	basket = 'basket:changed', // при добавлении/удалении из корзины
	basketOpen = 'basket:open', // открытие корзины
	total = 'total:change', // Изменилась сумма корзины
	order = 'order:change', // при заполнении данных заказа
	orderOpen = 'order:open', // открытие формы заказа
	orderDone = 'order:done', // заказ готов к завершению
	contactsOpen = 'contact:open', // открытие формы контактов
	error = 'message:error', // при показе сообщения об ошибке или успехе
	success = 'order:success', // Заказ оформлен
}

export class AppState {
	setFieldsOrder(arg0: string, payment: string) {
		throw new Error('Method not implemented.');
	}
	items: IItem[] = [];
	selectedItem: IItem | null = null; // Свойство для хранения выбранного товара
	basket: IBasket = {
		items: [],
		total: 0,
	};
	FormErrors: Partial<Record<keyof IUser, string>> = {};
	order: IOrder = {
		payment: 'cash',
		email: '',
		phone: '',
		address: '',
		total: 0,
		items: [],
	};
	constructor(
		protected data: Partial<AppState>, //все свойства AppState становятся необязательными
		protected events: IEvents
	) {}

	// Метод для установки списка товаров
	setItems(items: IItem[]): void {
		this.items = items;
		this.events.emit(AppStateChanges.items);
	}

	// Метод для установки выбранного товара
	setSelectedItem(item: IItem): void {
		this.selectedItem = item; //Сохраняем данные
		this.events.emit(AppStateChanges.select, item); // Уведомляем систему
	}

	addBasket(item: IItem) {
		this.addBasket(item);
	}

	inBasket(item: IItem) {
		this.inBasket(item);
	}

	removeFromBasket(item: IItem) {
		this.removeFromBasket(item);
	}

	clearBasket() {
		this.clearBasket();
	}

	setPayMethod(method: PaymentMethod) {
		this.order.payment = method;
	}

	// Дополнительно можно добавить метод очистки выбранного товара
	// clearSelectedItem(): void {
	//     this.selectedItem = null;
	//     this.events.emit(AppStateChanges.select, null);
	// }

	setFieldsOder(field: keyof IUser, value: string) {
		if (field === 'payment') {
			this.setPayMethod(value as PaymentMethod);
		} else {
			this.order[field] = value;
		}
		// Проверяем валидность при каждом изменении
		this.validation();

		// Если все данные заполнены и валидны, эмитируем событие завершения
		if (
			this.order.payment &&
			this.order.address &&
			this.order.email &&
			this.order.phone
		) {
			if (this.validation()) {
				this.order.items = this.basket.items;
				this.order.total = this.basket.total;
				this.events.emit(AppStateChanges.orderDone, this.order);
			}
		}
	}

	validation() {
		// Создаем временный объект для хранения ошибок валидации
		const errors: typeof this.FormErrors = {};
		// Валидация способа оплаты
		if (!this.order.payment) {
			errors.payment = 'Выберите способ оплаты';
		}

		// Валидация адреса
		if (!this.order.address) {
			errors.address = 'Введите адрес доставки';
		}

		// Валидация email
		if (!this.order.email) {
			errors.email = 'Введите email';

			// Валидация телефона
			if (!this.order.phone) {
				errors.phone = 'Введите телефон';

				// Сохраняем найденные ошибки в свойство класса
				this.FormErrors = errors;
				// Отправляем событие о наличии ошибок валидации
				this.events.emit(AppStateChanges.error);
				// Возвращаем true если ошибок нет (объект errors пустой), иначе false
				return !Object.keys(errors).length;
			}
		}
	}
}
