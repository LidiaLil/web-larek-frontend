import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { AppStateModals } from '../model/AppState';

export interface ISuccessView {
	description(total: number): HTMLElement;
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
			'.order-success__close',
			container
		);

		this._button.addEventListener('click', () => {
			events.emit(AppStateModals.success);
		});
	}


  set description(total: number) {
    this._description.textContent = String(`Списано ${total} синапсов`);
  }
}
