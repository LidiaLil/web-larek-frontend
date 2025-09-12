//Общий родительский класс для формы заказа(Order) и формы контактов (Contacts)
import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement, ensureAllElements } from '../../utils/utils';

export abstract class Form<T> extends Component<T> {
	protected formElement: HTMLFormElement; // Элемент формы
	protected submitButton: HTMLButtonElement; // Кнопка отправки
	protected formErrors: HTMLElement; // Контейнер ошибок
	protected formInputs: HTMLInputElement[]; // поля ввода (массив)

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
		this.formInputs = ensureAllElements<HTMLInputElement>(
			'input', // ищет все инпуты внутри формы через ensureAllElements
			this.formElement
		);

		//Обработчик отправки формы
		this.formElement.addEventListener('submit', (event) => {
			event.preventDefault(); // Предотвращаем стандартную отправку
			this.submit(); // Вызываем метод submit текущего экземпляра
		});
	}
	// метод для обработки отправки формы

	protected submit(): void {
		// Получаем данные формы в виде объекта
		const formData = this.getFormData();

		// Генерируем имя события на основе имени формы (например: "order:submit")
		// и отправляем данные через систему событий
		this.events.emit(`${this.formElement.name}:submit`, formData);
	}

	// Защищенный метод для сбора данных из всех полей формы
	protected getFormData(): Record<string, string> {
		// Создаем пустой объект для данных
		const data: Record<string, string> = {};

		// Проходим по всем input элементам формы
		this.formInputs.forEach((input) => {
			// Используем имя input как ключ, а значение как значение
			data[input.name] = input.value;
		});

		// Возвращаем собранные данные
		return data;
	}

	// Публичный метод для очистки формы
	clearForm(): void {
		// Вызываем стандартный метод reset у формы HTML
		this.formElement.reset();
	}
}
