//Контроллер (index.ts) - связывает модель и представление
import './scss/styles.scss';
import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';

import { AppState, AppStateChanges } from './components/model/AppState';
import { BasketModel } from './components/model/BasketModel';

import { Modal } from './components/view/Modal';
import { Gallery } from './components/view/Gallery';
import { CardView } from './components/view/CardsView';
import { BasketView } from './components/view/BasketView';
import { Header } from './components/view/Header';
import { Order } from './components/view/OrderView';
import { Contacts } from './components/view/Contacts';

import { IItem } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';
import { AppApi } from './components/model/AppApi';
import { CardsModel } from './components/model/CardsModel';
import { Form } from './components/view/Form';
import { SuccessView } from './components/view/SuccessView';

// Инициализация событий
const events = new EventEmitter();

// DOM-шаблоны и элементы
const template = {
	cardCatalogTemplate: ensureElement<HTMLTemplateElement>('#card-catalog'),
	cardPreviewTemplate: ensureElement<HTMLTemplateElement>('#card-preview'),
	successTemplate: ensureElement<HTMLTemplateElement>('#success'),
	basketTemplate: ensureElement<HTMLTemplateElement>('#basket'),
	orderTemplate: ensureElement<HTMLTemplateElement>('#order'), 
	contactsTemplate: ensureElement<HTMLTemplateElement>('#contacts'),
};


// Глобальные контейнеры
const galleryContainer = ensureElement<HTMLElement>('.gallery'); //для карточек
const modalContainer = ensureElement<HTMLElement>('#modal-container'); //для модалок Темплейт!!!!
const headerContainer = ensureElement<HTMLElement>('.header__container'); //значка корзины в хедере

// Модели данных приложения
const model = {
	card: new CardsModel(events), // данные о товарах
	basket: new BasketModel(events), //о выбранных товарах
	api: new AppApi(CDN_URL, API_URL), // данные с сервера
	appState: new AppState({}, events), //данные с сервера
};

//UI-компоненты (Объект view-компонентов)
const views = {
	basket: new BasketView(cloneTemplate(template.basketTemplate), events), // корзины
	contacts: new Contacts(cloneTemplate(template.contactsTemplate) as HTMLFormElement, events), // формы контактов
	gallery: new Gallery(galleryContainer, events), // галереи товаров
	success: new SuccessView(cloneTemplate(template.successTemplate), events), // успешного заказа
	// Формы
	orderForm: new Order(cloneTemplate(template.orderTemplate) as HTMLFormElement, events),
	contactsForm: new Contacts(cloneTemplate(template.contactsTemplate) as HTMLFormElement, events),
};


const modal = new Modal(modalContainer, events);//Инициализиация модалки
const header = new Header(headerContainer, events);//иниц-я корзины в хедере



// Чтобы мониторить все события, для отладки
events.onAll((event) => {
	console.log('Слушаем событие!!!!!!!!', event.eventName, event.data); //Удалить потом
});

// Получаем товары с сервера
model.api
	.getItems()
	.then((items) => {
		model.card.setItems(items);
		events.emit('change:items');
	})
	.catch((error) => console.error(error));

// Обработчики событий

// Показываем каталог при обновлении данных
events.on(AppStateChanges.items, () => {
	// Обновляем каталог товаров
	views.gallery.setCatalog(
		model.card.items.map((item: IItem) => {
			const card = new CardView(
				cloneTemplate(template.cardCatalogTemplate),
				events
			);
			const renderedCard = card.render(item);
			// Обновляем состояние кнопки при создании
            card.updateButtonState(model.basket);

			// Вешаем обработчик на отрендеренную выбранную карточку
			renderedCard.addEventListener('click', () =>
				events.emit(AppStateChanges.select, { id: item.id })
			);
			return renderedCard;
		})
	);
});

// Обработчики событий для модальных окон
events.on(AppStateChanges.modalOpen, () => {
	// Блокируем прокрутку страницы при открытии модалки
	document.body.style.overflow = 'hidden';
});

events.on(AppStateChanges.modalClose, () => {
	// Разблокируем прокрутку страницы при закрытии модалки
	document.body.style.overflow = 'auto';
});

// Обработчик события выбора карточки товара
events.on(AppStateChanges.select, (data: { id: string }) => {
	// Находим товар по ID и устанавливаем его как выбранный
	const item = model.card.items.find((product) => product.id === data.id);
	if (item) {
		// Создаем карточку превью
		const card = new CardView(
			cloneTemplate(template.cardPreviewTemplate),
			events
		);
		const renderedCard = card.render(item);
		// Обновляем состояние кнопки в превью
        card.updateButtonState(model.basket);
		modal.setContent(renderedCard);
		modal.toggleState(true);
	}
});

// Обработчик добавления/удаления из корзины
events.on(AppStateChanges.basket, (data: { id: string }) => {
    const item = model.card.items.find(product => product.id === data.id);
    if (item) {
        // Проверяем наличие в корзине
        if (model.basket.isInBasket(item.id)) {
            model.basket.removeFromBasket(item.id);
            console.log('Товар удален из корзины:', item.title);
        } else {
            model.basket.addToBasket(item);
            console.log('Товар добавлен в корзину:', item.title);
        }
        
        // Обновляем счетчик в хедере
        header.counter = model.basket.getBasketCount();
        
        // Закрываем модальное окно если оно открыто
        modal.toggleState(false);
    }
});

//Отображения корзины
events.on(AppStateChanges.basket, () => {
    // Вызываем метод обновления элементов корзины
    views.basket.updateItems(
        // Берем все товары из корзины и преобразуем их
        model.basket.getItems().map((item, index) => {
            // Для каждого товара создаем карточку
            const card = new CardView(
                cloneTemplate(template.basketTemplate), // Шаблон для корзины
                events
            );
            //Рендерим карточку с данными товара
            const renderedCard = card.render(item);
            
            //Устанавливаем порядковый номер товара (1, 2, 3...)
            card.index = (index + 1).toString();
            
            //Скрываем кнопку "В корзину" в карточках корзины
            if (card['_addButton']) {
                card['_addButton'].style.display = 'none';
            }
            
            // Возвращаем готовую карточку для отображения
            return renderedCard;
        })
    );
});