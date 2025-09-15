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
	protected events: IEvents;
	// Добавляем свойство для хранения данных
    private _counter: number = 0;

	constructor(container: HTMLElement, events: IEvents) {
		super(container); // Вызов конструктора родителя
		this.events = events;
		// Инициализация элементов
		this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container)
		this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', container)
		// Обработчик клика на кнопку корзины
        this.basketButton.addEventListener('click', () => {
            this.events.emit(AppStateChanges.basketOpen); 
        });
		// Подписываемся на изменения корзины
        this.events.on(AppStateChanges.basket, () => {
            this.updateCounter();
        });
	}

	// Метод для обновления счетчика
    updateCounter(): void {
        this.setText(this.counterElement, String(this._counter));
    }

    set counter(value: number) {
        this._counter = value;
        this.updateCounter();
    }

    get basketButtonElement(): HTMLButtonElement {
        return this.basketButton;
    }

    render(data?: IHeader): HTMLElement {
        if (data?.counter !== undefined) {
            this._counter = data.counter;
            this.updateCounter();
        }
        return this.container;
    }

        // Дополнительная логика для скрытия/показа счетчика при 0
        // if (value === 0) {
        //     this.setHidden(this.counterElement);
        // } else {
        //     this.setVisible(this.counterElement);
        // }
    }

    


