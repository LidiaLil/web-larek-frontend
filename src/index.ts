//Контроллер (index.ts) - связывает модель и представление
// Инициализация приложения
import './scss/styles.scss';
import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
// Модели
import { AppState, AppStateChanges } from './components/model/AppState';
import { BasketModel } from './components/model/BasketModel';
import { CardsModel } from './components/model/CardsModel';
import { AppApi } from './components/AppApi';
// Представления
import { Modal } from './components/view/Modal';
import { Gallery } from './components/view/Gallery';
import { CardView } from './components/view/CardsView';
import { BasketView } from './components/view/BasketView';
import { Header } from './components/view/Header';
import { Order } from './components/view/OrderView';
import { Contacts } from './components/view/Contacts';
import { SuccessView } from './components/view/SuccessView';
// Типы и утилиты
import { IItem, IOrder, IOrderFormData } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';

// Инициализация событий
const events = new EventEmitter();
// DOM-шаблоны и элементы
const template = {
	cardCatalogTemplate: ensureElement<HTMLTemplateElement>('#card-catalog'),
	cardPreviewTemplate: ensureElement<HTMLTemplateElement>('#card-preview'),
	cardBasketTemplate: ensureElement<HTMLTemplateElement>('#card-basket'),
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
	appState: new AppState({}, events), //данные с сервера
};

// Получение данных с сервера
const api = new AppApi(CDN_URL, API_URL); // данные с сервера

//UI-компоненты (Объект view-компонентов)
const views = {
	basket: new BasketView(cloneTemplate(template.basketTemplate), events), // корзины
	contacts: new Contacts(
		cloneTemplate(template.contactsTemplate) as HTMLFormElement,
		events
	), // формы контактов
	gallery: new Gallery(galleryContainer, events), // галереи товаров
	success: new SuccessView(cloneTemplate(template.successTemplate), events), // успешного заказа
	// Формы
	orderForm: new Order(
		cloneTemplate(template.orderTemplate) as HTMLFormElement,
		events
	),
	contactsForm: new Contacts(
		cloneTemplate(template.contactsTemplate) as HTMLFormElement,
		events
	),
};

const modal = new Modal(modalContainer, events); //Инициализиация модалки
const header = new Header(headerContainer, events); //иниц-я корзины в хедере

// Чтобы мониторить все события, для отладки
events.onAll((event) => {
	console.log('Слушаем событие!!!!!!!!', event.eventName, event.data); //Удалить потом
});

// Получаем товары с сервера
api
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
			const card = new CardView(cloneTemplate(template.cardCatalogTemplate), {
				onClick: (event: MouseEvent) => {
					event.stopPropagation(); // Предотвращаем всплытие
					const isInBasket = model.basket.isInBasket(item.id);
					if (!isInBasket) {
						model.basket.addToBasket(item);
						card.updateButtonState(true);
					}
					// Если товар уже в корзине, ничего не делаем при клике на кнопку
				},
			});

			const renderedCard = card.render(item);

			// Обновляем состояние кнопки при создании
			card.updateButtonState(model.basket.isInBasket(item.id));

			// Вешаем обработчик на всю карточку для открытия превью
			renderedCard.addEventListener('click', (event) => {
				// Проверяем, что клик не по кнопке
				if (!(event.target as HTMLElement).closest('.card__button')) {
					events.emit(AppStateChanges.select, { id: item.id });
				}
			});

			return renderedCard;
		})
	);
});

// Обработчик события выбора карточки товара
events.on(AppStateChanges.select, (data: { id: string }) => {
	// Находим товар по ID
	const item = model.card.items.find((product) => product.id === data.id);
	if (item) {
		// Создаем карточку превью
		const card = new CardView(cloneTemplate(template.cardPreviewTemplate), {
			onClick: () => {
				const isInBasket = model.basket.isInBasket(item.id);
				if (isInBasket) {
					model.basket.removeFromBasket(item.id);
					card.updateButtonState(false);
				} else {
					model.basket.addToBasket(item);
					card.updateButtonState(true);
				}
			},
		});

		const renderedCard = card.render(item);
		modal.modalContent = renderedCard;
		modal.modalOpen();

		// Устанавливаем начальное состояние кнопки
		card.updateButtonState(model.basket.isInBasket(item.id));
	}
});

// Обработчик изменения корзины
events.on(AppStateChanges.basket, () => {
	// Обновляем счетчик в хедере
	header.counter = model.basket.getBasketCount();

	// Генерируем карточки для корзины
	const basketCards = model.basket.getItems().map((item: IItem, index) => {
		const card = new CardView(cloneTemplate(template.cardBasketTemplate), {
			onClick: () => {
				model.basket.removeFromBasket(item.id);
			},
		});
		const renderedCard = card.render({
			...item,
			index: (index + 1).toString(), // Добавляем порядковый номер и преобразуем number в string
		});
		return renderedCard;
	});

	// Обновляем список товаров в корзине
	views.basket.updateItems(basketCards);
	// Обновляем итоговую сумму
	views.basket.setTotal(model.basket.getBasketTotal());
});

// Открытие корзины
events.on(AppStateChanges.basketOpen, () => {
	// просто показываем модалку с корзиной
	modal.modalContent = views.basket.element;
	modal.modalOpen();
});

// Обработчик открытия модального окна
events.on(AppStateChanges.modalOpen, () => {
	console.log('Модальное окно открыто');
	// блокировать прокрутку body
	document.body.style.overflow = 'hidden';
});

// Обработчик закрытия модального окна
events.on(AppStateChanges.modalClose, () => {
	console.log('Модальное окно закрыто');
	// Восстанавливаем прокрутку body
	document.body.style.overflow = '';
});

views.basket.onCheckout(() => {
	events.emit(AppStateChanges.orderOpen);
});

// Форма заказа
events.on(AppStateChanges.orderOpen, () => {
	// Проверяем, что корзина не пустая
	if (model.basket.getBasketCount() === 0) {
		console.log('Корзина пуста');
		return;
	}

	// Открываем форму заказа
	modal.modalContent = views.orderForm.render({
		address: '',
		payment: '',
		valid: false,
		errors: '',
	} as IOrderFormData);
	modal.modalOpen();
	console.log('Открываем форму заказа');
});

// Открываем форму контактов
events.on(AppStateChanges.orderSubmit, () => {
	modal.modalContent = views.contactsForm.render({
		email: '',
		phone: '',
		valid: false,
		errors: '',
	} as IOrderFormData);

	modal.modalOpen();
	console.log('Открываем форму контактов');
});

// сохраняем данные
// В index.ts добавьте этот обработчик
events.on(AppStateChanges.order, (data: any) => {
    // Сохраняем данные в AppState в зависимости от того, какие поля пришли
    if (data.address !== undefined) {
        model.appState.order.address = data.address;
    }
    if (data.payment !== undefined) {
        model.appState.order.payment = data.payment as 'card' | 'cash';
    }
    if (data.email !== undefined) {
        model.appState.order.email = data.email;
    }
    if (data.phone !== undefined) {
        model.appState.order.phone = data.phone;
    }
    console.log('Данные сохранены в AppState:', model.appState.order);
});

// После формы контактов открываем успешный заказ
events.on(AppStateChanges.contactsSubmit, (data: Record<string, string>) => {
	// Подготавливаем данные для заказа
	const orderData: IOrder = {
		payment: model.appState.order.payment,
		email: data.email,
		phone: data.phone,
		address: model.appState.order.address,
		total: model.basket.getBasketTotal(),
		items: model.basket.getItems().map((item) => item.id),
	};

	// Отправляем заказ на сервер с помощью postOrder
	api
		.postOrder(orderData)
		.then((response) => {
			console.log('Заказ успешно оформлен:', response);

			// Показываем успешное сообщение с данными с сервера
			modal.modalContent = views.success.render({
				total: response.total,
			});
			modal.modalOpen();

			console.log('Открываем успешный заказ');
		})
		.catch((error) => {
			console.error('Ошибка оформления заказа:', error);
		});
});

events.on(AppStateChanges.success, () => {
	// Очищаем корзину
	model.basket.clearBasket();

	// Закрываем модалку
	modal.modalClose();

	// Показываем главную страницу с каталогом
	views.gallery.setCatalog(
		model.card.items.map((item: IItem) => {
			const card = new CardView(cloneTemplate(template.cardCatalogTemplate), {
				onClick: (event: MouseEvent) => {
					event.stopPropagation();
					const isInBasket = model.basket.isInBasket(item.id);
					if (!isInBasket) {
						model.basket.addToBasket(item);
						card.updateButtonState(true);
					}
				},
			});

			const renderedCard = card.render(item);
			card.updateButtonState(model.basket.isInBasket(item.id));
			return renderedCard;
		})
	);
});
