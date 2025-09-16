//Представление («фабрика» карточки) - отображение данных
//Класс, который создает DOM-элемент для одного товара (карточки).
import { ICardActions, IItem } from '../../types';
import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';

export class CardView extends Component<IItem> {
	protected _description?: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category?: HTMLElement;
	protected _price: HTMLElement;
	protected _addButton?: HTMLButtonElement | null; // Для карточек каталога
	protected _id?: string;
	protected _indexElement?: HTMLElement;
	constructor(container: HTMLElement, 
		events?: ICardActions) {
		super(container); // Вызов конструктора родителя
		//Клонирование и поиск элементов в контейнере согласно верстке (Подготовка View)
		this._description = container.querySelector('.card__text');
		this._image = container.querySelector('.card__image');
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._category = container.querySelector('.card__category');
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._addButton = container.querySelector('.card__button');
		this._indexElement = container.querySelector('.basket__item-index');

		// Добавляем обработчик с проверкой на существование кнопки
		// Обработчик для кнопки добавления/удаления
		if (events?.onClick) {
			if (this._addButton) {
				this._addButton.addEventListener('click', events.onClick);
			}
		} else {
			container.addEventListener('click', events.onClick);
		}
	}

	set description(value: string) {
		this.setText(this._description, value);
	}
	set title(value: string) {
		this.setText(this._title, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: string) {
		this.setText(this._category, value);
	}

	set price(value: number | null) {
		if (this._price) {
			this.setText(
				this._price,
				value !== null ? `${value} синапсов` : 'Бесценно'
			);
		}
		if (this._addButton && !value) {
			this.setDisabled(this._addButton, true);
		}
	}
	set id(value: string) {
		this.container.dataset.id = value;
	}

	set addButton(value: string) {
		this.setText(this._addButton, value);
	}

    set index(value: string) {
        if (this._indexElement) {
            this.setText(this._indexElement, value);
        }
    }

	get title() {
		return this._title.textContent || '';
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	// Добавляем методы управления состоянием кнопки
	updateButtonState(isInBasket: boolean): void {
    if (!this._addButton) return;
    
    if (this._price && this._price.textContent === 'Бесценно') {
        this.setText(this._addButton, 'Не продаётся');
        this.setDisabled(this._addButton, true);
    } else if (isInBasket) {
        this.setText(this._addButton, 'Удалить из корзины');
        this.setDisabled(this._addButton, false);
    } else {
        this.setText(this._addButton, 'Купить');
        this.setDisabled(this._addButton, false);
    }
}
	
}



// // Добавляем методы управления состоянием кнопки
// 	setButtonState(inBasket: boolean, enabled: boolean = true) {
// 		if (this._addButton) {
// 			if (inBasket) {
// 				this._addButton.textContent = 'Удалить из корзины';
// 			} else {
// 				this._addButton.textContent = 'В корзину';
// 			}
// 			this._addButton.disabled = !enabled;
// 		}
// 	}

// 	// Метод для обновления состояния кнопки на основе модели
// 	updateButtonState(basketModel: BasketModel) {
// 		if (this._addButton && this._id) {
// 			const inBasket = basketModel.isInBasket(this._id);
// 			this.setButtonState(inBasket, this._price?.textContent !== 'Бесценно');
// 		}
// 	}