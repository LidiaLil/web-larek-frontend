import { Form } from "./Form";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";
import { AppStateChanges, AppStateModals } from "../model/AppState";

export interface IContacts {
    phone: string;
    email: string;
	
}

export class Contacts extends Form<IContacts> {
    // Только специфичные для Contacts элементы
    //остальные элементы уже определены в родительском классе Form
    protected _phoneInput: HTMLInputElement;
    protected _emailInput: HTMLInputElement;
    

    // Конструктор принимает родительский элемент и обработчик событий
    constructor(
        container: HTMLFormElement,
        protected events: IEvents
    ) {
        super(container, events);

        // Находим элементы по селекторам из верстки
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
    

        // Добавляем обработчики изменений
        this._phoneInput.addEventListener('input', () => {
            this.validateForm(); // Добавляем валидацию
            this.emitChangeEvent();
        });

        this._emailInput.addEventListener('input', () => {
            this.validateForm(); // Добавляем валидацию
            this.emitChangeEvent();
        });

        // обработчик submit
        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.events.emit(AppStateChanges.contactsSubmit, this.getFormData());
            }
        });
    }

    // Валидация формы контактов
    validateForm(): boolean {
        const errors: string[] = [];
        
        // Валидация email
        const email = this._emailInput.value.trim();
        if (!email) {
            errors.push('Введите email');
        } 
        
        // Валидация телефона
        const phone = this._phoneInput.value.trim();
        if (!phone) {
            errors.push('Введите телефон');
        } 

        // Устанавливаем ошибки и состояние кнопки
        this.errors = errors.join('; ');
        this.valid = errors.length === 0;
        
        return errors.length === 0;
    }

    getFormData(): Record<string, string> {
    return {
        phone: this._phoneInput.value.trim(),
        email: this._emailInput.value.trim(),
    };
}

// Эмит события изменения данных
protected emitChangeEvent(): void {
    // Отправляем только данные контактов
    this.events.emit(AppStateChanges.order, this.getFormData());
}

    // render для инициализации валидации
    render(data?: Partial<IContacts>): HTMLElement {
        super.render(data);
        
        // Заполняем поля если переданы данные
        if (data) {
            if (data.phone) {
                this._phoneInput.value = data.phone;
            }
            if (data.email) {
                this._emailInput.value = data.email;
            }
        }
        
        // Запускаем валидацию после рендера
        setTimeout(() => this.validateForm(), 0);
        
        return this.container;
    }

    // Геттеры
    get phoneInput(): HTMLInputElement {
        return this._phoneInput;
    }

    get emailInput(): HTMLInputElement {
        return this._emailInput;
    }
}