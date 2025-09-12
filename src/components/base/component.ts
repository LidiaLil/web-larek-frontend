import {IEvents} from './events'

/**
 * Базовый компонент для содания всех классов представления
 * основная задача- отображать на странице те данные, которые мы ему передаем
 */
export abstract class Component<T> {
    // Конструктор принимает контейнер - DOM-элемент для рендеринга
    protected constructor(
        protected readonly container: HTMLElement) {
        // Учитывайте что код в конструкторе исполняется ДО всех объявлений в дочернем классе
    }

    // Инструментарий для работы с DOM в дочерних компонентах

    // Переключить класс
    toggleClass(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }

    // Установить текстовое содержимое
    protected setText(element: HTMLElement, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }

    // Сменить статус блокировки
    setDisabled(element: HTMLElement, state: boolean) {
        if (element) {
            if (state) element.setAttribute('disabled', 'disabled');
            else element.removeAttribute('disabled');
        }
    }

    // Скрыть элемент 
    protected setHidden(element: HTMLElement) {
        element.style.display = 'none';
    }

    // Показать элемент 
    protected setVisible(element: HTMLElement) {
        element.style.removeProperty('display');
    }

    // Установить изображение с алтернативным текстом
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;        // Устанавливаем источник
            if (alt) {
                element.alt = alt;    // Устанавливаем alt текст если передан
            }
        }
    }

    // Вернуть корневой DOM-элемент
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {}); // Копируем данные в экземпляр компонента
        return this.container; // Возвращаем DOM-элемент
    }
}