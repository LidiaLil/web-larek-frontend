//Отвечает а отображение списка карточек(массива)

import { Component } from '../base/component';
import { IEvents } from '../base/events';

interface GalleryData {
    catalog: HTMLElement[];
}

export class Gallery extends Component<GalleryData> {
    protected catalogElement: HTMLElement;
    
    constructor(
		container: HTMLElement, // DOM-элемент контейнера формы
		protected events: IEvents // Система событий для коммуникации между компонентами
	) {
		super(container); // Вызов конструктора родителя
        
        this.catalogElement = this.container; // gallery элемент
    }

    // Сеттер для каталога товаров (только получение готовых карточек)
    // Метод для обновления каталога
    setCatalog(items: HTMLElement[]): void {
        this.catalogElement //ссылка на DOM-элемент галереи (<main class="gallery">)
        .replaceChildren(...items);//Нативный DOM-метод, который полностью заменяет дочерние элементы
    }
}