import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement, createElement } from '../../utils/utils';
import { AppStateModals, AppStateChanges } from '../model/AppState';

//Интерфейс представления корзины
interface IBasketView {
	updateItems(items: HTMLElement[]): void; //обновление списка товаров
	setTotal(value: number): void; //общая сумма
}

//Класс BasketView с полной интеграцией AppState
export class BasketView extends Component<IBasketView> {
	protected _basketList: HTMLElement;
	protected _basketButton: HTMLButtonElement;
	protected _basketPrice: HTMLElement;
	protected onCheckoutHandler?: () => void;
	// Вызовется при клике на кнопку "Оформить"
	handleCheckout = () => {
		if (this.onCheckoutHandler) this.onCheckoutHandler();
	};

	constructor(
		container: HTMLElement, // DOM-элемент контейнера формы
		protected events: IEvents // Система событий для коммуникации между компонентами // protected model: IBasketModel // Добавляем модель
	) {
		super(container); // Вызов конструктора родительского класса Component

		this._basketList = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);
		this._basketButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);
		this._basketPrice = ensureElement<HTMLElement>(
			'.basket__price',
			this.container
		);

		// Обработчик клика на кнопку оформления заказа
		this._basketButton.addEventListener('click', this.handleCheckout);
		this._basketButton.disabled = true; // по умолчанию кнопка неактивна
	}

	//Метод обновления представления
	updateItems(items: HTMLElement[]) {
		if (items.length) {
			this._basketList.replaceChildren(...items);
			this._basketButton.disabled = false;
		} else {
			this._basketList.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					classList: 'basket__empty',
					textContent: 'Корзина пуста',
				})
			);
			this._basketButton.disabled = true;
		}
	}

	setTotal(value: number) {
		this.setText(this._basketPrice, `${value} синапсов`);
	}

	get basketButton() {
		return this._basketButton;
	}

	get element(): HTMLElement {
		return this.container;
	}

	// Подписка на событие "Оформить"
	onCheckout(handler: () => void) {
		this.onCheckoutHandler = handler;
	}

	// Метод для обновления порядковых номеров
	refreshIndices() {
    Array.from(this._basketList.children).forEach((item, index) => {
        const indexElement = item.querySelector('.basket__item-index') as HTMLElement;
if (indexElement) {
    this.setText(indexElement, (index + 1).toString());
}

    });
}
}
