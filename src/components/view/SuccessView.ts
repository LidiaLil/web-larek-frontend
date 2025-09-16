import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { AppStateChanges, AppStateModals } from '../model/AppState';

export interface ISuccessView {
	total: number; // сколько списано
}

export class SuccessView extends Component<ISuccessView> {
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(
		container: HTMLElement, // DOM-элемент контейнера формы
		protected events: IEvents // Система событий для коммуникации между компонентами
	) {
		super(container); // Вызов конструктора родительского класса Component

		this._description = ensureElement<HTMLElement>(
			'.order-success__description',
			container
		);
		this._button = ensureElement<HTMLButtonElement>(
			'.order-success__close', // кнопка "Новые покупки"
			container
		);

		this._button.addEventListener('click', () => {
			events.emit(AppStateChanges.success);
		});
	}

	// сеттер для текста
	set total(value: number) {
		this._description.textContent = `Списано ${value} синапсов`;
	}

}
