import { Component } from "../base/component";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";// Импортируем утилиты для безопасного получения элементов
import { AppStateChanges } from "../model/AppState";

interface ModalData {
    content: HTMLElement;
}

export class Modal extends Component<ModalData> {
    // protected _modalContainer: HTMLElement;
    protected _modalContent: HTMLElement;
    protected _closeButton: HTMLButtonElement;
    protected events: IEvents; // Брокер событий

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        //Сохраняем брокер событий
        this.events = events;

        //Инициализация элементов согласно верстке
        // this._modalContainer = this.container;
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this._modalContent = ensureElement<HTMLElement>('.modal__content', this.container);

        // Обработчик клика на кнопку закрытия - вызывает метод modalClose
        this._closeButton.addEventListener('click',this.modalClose.bind(this));
        // Обработчик клика на содержимое модального окна - предотвращает всплытие события
        // (чтобы клик по содержимому не закрывал модальное окно)
        this._modalContent.addEventListener('click',(events) => events.stopPropagation());
        // Обработчик клика по оверлею
        this.container.addEventListener('click', this.modalClose.bind(this))
    }

    // Метод для установки содержимого
    set modalContent(element: HTMLElement) {
        // Заменяем все дочерние элементы контейнера на новый элемент
        this._modalContent.replaceChildren(element);
    }
    
// открытие модального окна
    modalOpen() {
    this.toggleClass(this.container, 'modal_active', true);
    this.events.emit(AppStateChanges.modalOpen);
}
    
    // закрытие модального окна
    modalClose() {
    this.toggleClass(this.container, 'modal_active', false);
    this.modalContent = null;
    this.events.emit(AppStateChanges.modalClose);
}

    render(data?: Partial<ModalData>): HTMLElement {
        // Вызываем метод render родительского класса
        super.render(data);
        // Открываем модальное окно после рендеринга
        this.modalOpen();
        // Возвращаем DOM-элемент контейнера
        return this.container;
    }

}
