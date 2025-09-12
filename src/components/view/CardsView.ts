//Представление («фабрика» карточки) - отображение данных
//Класс, который создает DOM-элемент для одного товара (карточки).

import { EventEmitter, IEvents } from '../base/events';
import { IItem } from '../../types';
import { Component } from '../base/component';

export class CardView extends Component<IItem> {
	protected _description: HTMLElement;
	protected _image: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _addButton: HTMLButtonElement; //кнопка добавления в корзину
	protected _id: string;

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
    
    // Добавляем обработчик с проверкой на существование кнопки
	
    if (this._addButton) {
        this._addButton.addEventListener('click', () =>
            this.events.emit('add', { id: this.id })
        );
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
}
