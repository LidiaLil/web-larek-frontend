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

	constructor(
		container: HTMLElement, // DOM-элемент контейнера формы
		protected events: IEvents // Система событий для коммуникации между компонентами
	) // protected model: IBasketModel // Добавляем модель
	{
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
		this._basketButton.addEventListener('click', (event) => {
			event.preventDefault();
			// Эмитируем событие открытия модального окна контактов
			this.events.emit(AppStateChanges.orderOpen);
		});
	}

	// Метод для обновления состояния кнопки
	setButtonState(isEnabled: boolean): void {
		this._basketButton.disabled = !isEnabled;

		// Добавляем стили для визуального отключения
		if (!isEnabled) {
			this._basketButton.classList.add('button_disabled');
		} else {
			this._basketButton.classList.remove('button_disabled');
		}
	}

	//Метод обновления представления
	updateItems(items: HTMLElement[]) {
		if (items.length) {
			this._basketList.replaceChildren(...items);
			this.setDisabled(this._basketButton, false);
		} else {
			this._basketList.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					classList: 'basket__empty',
					textContent: 'Корзина пуста',
				})
			);
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

	// Метод для обновления порядковых номеров
    refreshIndices() {
        Array.from(this._basketList.children).forEach((item, index) => {
            const indexElement = item.querySelector('.basket__item-index');
            if (indexElement) {
                indexElement.textContent = (index + 1).toString();
            }
        });
    }
}
