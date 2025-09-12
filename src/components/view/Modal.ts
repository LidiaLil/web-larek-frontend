import { Component } from "../base/component";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";// Импортируем утилиты для безопасного получения элементов

interface ModalData {
    content: HTMLElement;
    isOpen: boolean;
}

export class Modal extends Component<ModalData> {
    protected modalContainer: HTMLElement;
    protected modalContent: HTMLElement;
    protected closeButton: HTMLButtonElement;
    protected events: IEvents; // Брокер событий

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        //Сохраняем брокер событий
        this.events = events;

        //Инициализация элементов согласно верстке
        this.modalContainer = this.container;
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.modalContent = ensureElement<HTMLElement>('.modal__content', this.container);

        // Закрытие по клику на оверлей
        this.modalContainer.addEventListener('click', (event) => {
            if (event.target === this.modalContainer) {
                this.toggleState();
            }
        });

        // Закрытие по кнопке
        this.closeButton.addEventListener('click', () => this.toggleState());
    }

    // Метод для установки содержимого
    setContent(element: HTMLElement): void {
        this.modalContent.replaceChildren(element);
    }

    // Переключение состояния модального окна
    toggleState(force?: boolean): void {
        const isActive = this.container.classList.toggle('modal_active', force);
        
        if (!isActive) {
            this.events.emit('modal:close');
        } else {
            this.events.emit('modal:open'); 
        }
    }
}
