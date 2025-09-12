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
        container: HTMLElement,
        protected events: IEvents
    ) {
        super(container, events);

        // Находим элементы по селекторам из верстки
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
    

        // Добавляем обработчики изменений
        this._phoneInput.addEventListener('input', () => {
            this.events.emit(AppStateChanges.order, this.getFormData)
        });

        this._emailInput.addEventListener('input', () => {
            this.events.emit(AppStateChanges.order, this.getFormData)
        });

        // Обработчик отправки формы
        this.formElement.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit(AppStateChanges.order, this.getFormData());
            this.events.emit(AppStateChanges.modalOpen, { modal: AppStateModals.success });
            
        });
    }

    // Получение данных
    
    get phoneInput(): HTMLInputElement {
        return this._phoneInput;
    }

    get emailInput(): HTMLInputElement {
        return this._emailInput;
    }

}
