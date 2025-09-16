//Общий родительский класс для формы заказа(Order) и формы контактов (Contacts)
import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement, ensureAllElements } from '../../utils/utils';

export abstract class Form<T> extends Component<T> {
	protected formElement: HTMLFormElement; // Элемент формы
	protected submitButton: HTMLButtonElement; // Кнопка отправки
	protected formErrors: HTMLElement; // Контейнер ошибок

	// Конструктор
	constructor(
		container: HTMLElement, // DOM-элемент контейнера формы
		protected events: IEvents // Система событий для коммуникации между компонентами
	) {
		super(container); // Вызов конструктора родителя

		//Инициализация элементов с помощью ensureElement
		this.formElement = this.container as HTMLFormElement;
		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]', //ищет button с type="submit"
			this.container
		);
		this.formErrors = ensureElement<HTMLElement>(
			'.form__errors',
			this.container
		);

		//Обработчик отправки формы
		this.formElement.addEventListener('submit', (event) => {
			event.preventDefault(); // Предотвращаем стандартную отправку
			this.events.emit(`${this.formElement.name}:submit`, this.getFormData());
		});
	}

	// Защищенный метод для сбора данных из всех полей формы
	protected getFormData(): Record<string, string> {
        const formData = new FormData(this.formElement);
        const data: Record<string, string> = {};
        
        formData.forEach((value, key) => {
            data[key] = value.toString();
        });
        
        return data;
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this.formErrors, value);
    }

    render(data?: Partial<T>): HTMLElement {
        super.render(data);
        return this.container;
    }
}
