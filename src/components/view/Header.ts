import { ensureElement } from '../../utils/utils';
import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { AppStateChanges } from '../model/AppState';

interface IHeader {
	counter: number;
}

export class Header extends Component<IHeader> {
	protected basketButton: HTMLButtonElement;
	protected counterElement: HTMLElement;
	protected events: IEvents

	constructor(container: HTMLElement, events: IEvents) {
		super(container); // Вызов конструктора родителя
		this.events = events;
		// Инициализация элементов
		this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container)
		this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', container)
		// Обработчик клика на кнопку корзины
        this.basketButton.addEventListener('click', () => {
            this.events.emit(AppStateChanges.basketOpen); // Эмитируем событие открытия корзины
        });
	}

	//получаем cсылку на DOM-элемент кнопки корзины
	get basketButtonElement(): HTMLButtonElement {
        return this.basketButton;
    }

	// Сеттер для счетчика товаров в корине
	set counter(value: number) {
        this.setText(this.counterElement, value); //Используем метод родителя
		console.log('Header counter:', value);

        // Дополнительная логика для скрытия/показа счетчика при 0
        // if (value === 0) {
        //     this.setHidden(this.counterElement);
        // } else {
        //     this.setVisible(this.counterElement);
        // }
    }

    }


