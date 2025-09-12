import { IOrder } from "../../types";
import { Form } from "./Form";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";
import { AppStateChanges, AppStateModals } from "../model/AppState";




export class Order extends Form<IOrder> {
    // Только специфичные для Order элементы
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;
    protected _addressInput: HTMLInputElement;
    
    constructor(
        container: HTMLFormElement,
        protected events: IEvents
    ) {
        super(container, events);

        this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
        

        // Обработчики для кнопок оплаты
        this._cardButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.selectPayment('card');
        });

        this._cashButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.selectPayment('cash');
        });

        // Обработчик для адреса
        this._addressInput.addEventListener('input', () => {
            this.emitChangeEvent();
        });

        // Обработчик отправки формы
        this.formElement.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit(AppStateChanges.order, this.getFormData());
            this.events.emit(AppStateChanges.order, { modal: AppStateModals.contacts });
            
        });
    }

    // Выбор способа оплаты
    selectPayment(payment: 'card' | 'cash'): void {
        if (payment === 'card') {
            this._cardButton.classList.add('button_alt-active');
            this._cashButton.classList.remove('button_alt-active');
        } else {
            this._cashButton.classList.add('button_alt-active');
            this._cardButton.classList.remove('button_alt-active');
        }
        
        this.emitChangeEvent();
    }

    // Эмит события изменения данных
    protected emitChangeEvent(): void {
        this.events.emit(AppStateChanges.order, this.getFormData());
    }


    // Получение выбранного способа оплаты
    protected getSelectedPayment(): 'card' | 'cash' | '' {
        if (this._cardButton.classList.contains('button_alt-active')) {
            return 'card';
        } else if (this._cashButton.classList.contains('button_alt-active')) {
            return 'cash';
        }
        return '';
    }

}