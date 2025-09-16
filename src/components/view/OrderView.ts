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
            this.validateForm(); // Добавляем валидацию
            this.emitChangeEvent();//Автосохранение данных
        });

        this._cashButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.selectPayment('cash');
            this.validateForm(); // Добавляем валидацию
            this.emitChangeEvent();
        });

        // Обработчик для адреса
        this._addressInput.addEventListener('input', () => {
            this.validateForm(); // Добавляем валидацию
            this.emitChangeEvent();
        });

        // обработчик submit
        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.events.emit(AppStateChanges.orderSubmit, this.getFormData());
            }
        });

    }

    // Выбор способа оплаты
	selectPayment(payment: 'card' | 'cash'): void {
		if (payment === 'card') {
			this.toggleClass(this._cardButton, 'button_alt-active', true);
			this.toggleClass(this._cashButton, 'button_alt-active', false);
		} else {
			this.toggleClass(this._cashButton, 'button_alt-active', true);
			this.toggleClass(this._cardButton, 'button_alt-active', false);
		}
	}

    // Валидация формы
    validateForm(): boolean {
        const errors: string[] = [];
        
        // Проверка способа оплаты
        if (!this.getSelectedPayment()) {
            errors.push('Выберите способ оплаты');
        }
        
        // Проверка адреса
        const address = this._addressInput.value.trim();
        if (!address) {
            errors.push('Необходимо указать адрес');
        }

        // Устанавливаем ошибки и состояние кнопки
        this.errors = errors.join('; ');
        this.valid = errors.length === 0;
        
        return errors.length === 0;
    }

    // Эмит события изменения данных
    protected emitChangeEvent(): void {
    const data = this.getFormData();
    // Сохраняем данные в AppState
    this.events.emit(AppStateChanges.order, {
        address: data.address,
        payment: data.payment as 'card' | 'cash',
    });
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

    // Получение данных формы
    protected getFormData(): Record<string, string> {
        const formData = super.getFormData(); // Получаем данные из базовой формы
        return {
            ...formData,
            payment: this.getSelectedPayment(), // Добавляем способ оплаты
            address: this._addressInput.value.trim() // Явно добавляем адрес
        };
    }

    //render для инициализации валидации
    render(data?: Partial<IOrder>): HTMLElement {
        super.render(data);
        
        // Заполняем поля если переданы данные
        if (data) {
            if (data.address) {
                this._addressInput.value = data.address;
            }
            // Устанавливаем выбранный способ оплаты
            if (data.payment === 'card') {
                this.selectPayment('card');
            } else if (data.payment === 'cash') {
                this.selectPayment('cash');
            }
        }
        
        // Запускаем валидацию после рендера
        setTimeout(() => this.validateForm(), 0);
        
        return this.container;
    }
}