//Представление («фабрика» карточки) - отображение данных
//Класс, который создает DOM-элемент для одного товара (карточки).

import { EventEmitter, IEvents } from '../base/events';
import { IItem } from '../../types';
import { Component } from '../base/component';
import { BasketModel } from '../model/BasketModel';
import { AppStateChanges } from '../model/AppState';

export class CardView extends Component<IItem> {
	protected _description: HTMLElement;
	protected _image: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _addButton: HTMLButtonElement; //кнопка добавления в корзину
	protected _id: string;
	protected _indexElement: HTMLElement; // для нумерации в корзине

	constructor(
		container: HTMLElement, // DOM-элемент контейнера формы
		protected events: IEvents // Система событий для коммуникации между компонентами
	) {
		super(container); // Вызов конструктора родителя
		//Клонирование и поиск элементов в контейнере согласно верстке (Подготовка View)
		this._description = container.querySelector('.card__text');
		this._image = container.querySelector('.card__image');
		this._title = container.querySelector('.card__title');
		this._category = container.querySelector('.card__category');
		this._price = container.querySelector('.card__price');
		this._addButton = container.querySelector('.card__button'); // Может быть null
		this._indexElement = container.querySelector('.basket__item-index');

		// Добавляем обработчик с проверкой на существование кнопки
		if (this._addButton) {
			this._addButton.addEventListener('click', () => {
				// Изменяем событие на универсальное
				this.events.emit(AppStateChanges.basket, { id: this._id });
			});
		}
	}

	set description(value: string) {
		this.setText(this._description, value);
	}
	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set category(value: string) {
		this.setText(this._category, value);
	}
	set price(value: number | null) {
		this.setText(
			this._price,
			value !== null ? `${value} синапсов` : 'Бесценно'
		);
		if (this._addButton && !value) {
			this._addButton.disabled = true;
		}
	}
	set id(value: string) {
		this._id = value;
	}

	set index(value: string) {
		this.setText(this._indexElement, value);
	}

	// Добавляем методы управления состоянием кнопки
	setButtonState(inBasket: boolean, enabled: boolean = true) {
		if (this._addButton) {
			if (inBasket) {
				this._addButton.textContent = 'Удалить из корзины';
			} else {
				this._addButton.textContent = 'В корзину';
			}
			this._addButton.disabled = !enabled;
		}
	}

	// Метод для обновления состояния кнопки на основе модели
	updateButtonState(basketModel: BasketModel) {
		if (this._addButton && this._id) {
			const inBasket = basketModel.isInBasket(this._id);
			this.setButtonState(inBasket, this._price?.textContent !== 'Бесценно');
		}
	}
}
