# Проектная работа "Веб-ларек"

План:
1.Используемый стек.
Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

  2.Инструкция по сборке и запуску.

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

Архитектура приложения
Приложение построено по парадигме MVP (Model-View-Presenter):

1. Model (Модель) - Слой данных и бизнес-логики
   BasketModel
   Назначение: Управляет состоянием корзины. Содержит методы для добавления, удаления товаров, подсчета суммы и количества.

Конструктор:

typescript
constructor(events: IEvents)
events: IEvents - система событий для уведомления об изменениях

Методы:

addToBasket(item: IItem): void - добавить товар в корзину

removeFromBasket(id: string): void - удалить товар из корзины

getBasketTotal(): number - получить общую сумму

getBasketCount(): number - получить количество товаров

isInBasket(id: string): boolean - проверить наличие товара

getItems(): IItem[] - получить все товары

clearBasket(): void - очистить корзину

AppState
Назначение: Хранит глобальное состояние приложения (товары, выбранный товар, корзина, данные заказа).

Конструктор:

typescript
constructor(data: Partial<AppState>, events: IEvents)
data: Partial<AppState> - начальные данные состояния

events: IEvents - система событий

Свойства:

items: IItem[] - список всех товаров

selectedItem: IItem | null - выбранный товар

basket: IBasket - данные корзины

order: IOrder - данные заказа

Методы:

setItems(items: IItem[]): void - установить список товаров

setSelectedItem(item: IItem): void - установить выбранный товар

setFieldsOder() - установить поля заказа

validation() - валидация данных

CardsModel
Назначение: Модель для каталога товаров. Хранит загруженные с сервера товары.

Конструктор:

typescript
constructor(events: IEvents)
events: IEvents - система событий

Методы:

setItems(items: IItem[]): void - установить список товаров

2. View (Представление) - Слой отображения
   CardView
   Назначение: Отображает карточку товара в каталоге и в превью.

Конструктор:

typescript
constructor(container: HTMLElement, events?: ICardActions)
container: HTMLElement - DOM-элемент контейнера

events?: ICardActions - обработчики событий

Методы:

updateButtonState(isInBasket: boolean): void - обновить состояние кнопки

BasketView
Назначение: Отображает содержимое корзины.

Конструктор:

typescript
constructor(container: HTMLElement, events: IEvents)
container: HTMLElement - DOM-элемент контейнера

events: IEvents - система событий

Методы:

updateItems(items: HTMLElement[]): void - обновить список товаров

setTotal(value: number): void - установить общую сумму

refreshIndices() - обновить порядковые номера

Header
Назначение: Отображает иконку корзины и счетчик товаров.

Конструктор:

typescript
constructor(container: HTMLElement, events: IEvents)
container: HTMLElement - DOM-элемент контейнера

events: IEvents - система событий

Gallery
Назначение: Контейнер для отображения каталога карточек товаров.

Конструктор:

typescript
constructor(container: HTMLElement, events: IEvents)
container: HTMLElement - DOM-элемент контейнера

events: IEvents - система событий

Методы:

setCatalog(items: HTMLElement[]): void - установить каталог товаров

Modal
Назначение: Универсальное модальное окно.

Конструктор:

typescript
constructor(container: HTMLElement, events: IEvents)
container: HTMLElement - DOM-элемент контейнера

events: IEvents - система событий

Методы:

modalOpen() - открыть модальное окно

modalClose() - закрыть модальное окно

Order (наследуется от Form)
Назначение: Форма ввода данных заказа (адрес и способ оплаты).

Конструктор:

typescript
constructor(container: HTMLFormElement, events: IEvents)
container: HTMLFormElement - DOM-элемент формы

events: IEvents - система событий

Методы:

selectPayment(payment: 'card' | 'cash'): void - выбрать способ оплаты

validateForm(): boolean - валидация формы

Contacts (наследуется от Form)
Назначение: Форма ввода контактных данных (email и телефон).

Конструктор:

typescript
constructor(container: HTMLFormElement, events: IEvents)
container: HTMLFormElement - DOM-элемент формы

events: IEvents - система событий

SuccessView
Назначение: Отображение успешного оформления заказа.

Конструктор:

typescript
constructor(container: HTMLElement, events: IEvents)
container: HTMLElement - DOM-элемент контейнера

events: IEvents - система событий

3. Базовые классы
   Api
   Назначение: Базовый класс для работы с API.

Конструктор:

typescript
constructor(baseUrl: string, options: RequestInit = {})
baseUrl: string - базовый URL API

options: RequestInit - настройки запросов

Методы:

get(uri: string): Promise<object> - GET запрос

post(uri: string, data: object, method?: ApiPostMethods): Promise<object> - POST/PUT/DELETE запросы

Component
Назначение: Базовый компонент для создания всех классов представления.

Конструктор:

typescript
constructor(protected readonly container: HTMLElement)
container: HTMLElement - DOM-элемент для рендеринга

Методы:

render(data?: Partial<T>): HTMLElement - отрисовка компонента

Утилиты для работы с DOM: toggleClass, setText, setDisabled, setHidden, setVisible, setImage

EventEmitter
Назначение: Брокер событий для реализации паттерна Observer.

Конструктор:

typescript
constructor()
Методы:

on<T extends object>(eventName: EventName, callback: (event: T) => void) - подписка на событие

off(eventName: EventName, callback: Subscriber) - отписка от события

emit<T extends object>(eventName: string, data?: T) - инициация события

trigger<T extends object>(eventName: string, context?: Partial<T>) - создание триггера события

4. Presenter (Посредник)
   Роль презентера выполняет главный контроллер в файле index.ts, который связывает все компоненты через систему событий.

Основные типы и интерфейсы
typescript
// Полное описание товара
interface IItem {
id: string;
description: string;
image: string;
title: string;
category: string;
price: number | null;
index?: string;
}

// Данные о заказе
interface IOrder {
payment: PaymentMethod;
email: string;
phone: string;
address: string;
total: number;
items: string[];
}

// Подтверждение заказа
interface IOrderConfirmed {
id: string;
total: number;
}

// Корзина
interface IBasket {
items: string[];
total: number;
}

// Данные покупателя
interface IUser {
payment?: PaymentMethod;
address?: string;
email?: string;
phone?: string;
}

// Действия с карточкой
interface ICardActions {
onClick: (event: MouseEvent) => void;
}

// Способ оплаты
type PaymentMethod = 'card' | 'cash' | '';

// Ответ API со списком
type ApiListResponse<Type> = {
total: number;
items: Type[];
};

// HTTP методы для изменения данных
type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
События приложения
Приложение использует систему событий для коммуникации между компонентами:

typescript
enum AppStateChanges {
items = 'items:change', // загрузка товаров
select = 'item:select', // выбор товара
modalOpen = 'modal:open', // открытие модалки
modalClose = 'modal:close', // закрытие модалки
basket = 'basket:changed', // корзина изменилась
basketOpen = 'basket:open', // открытие корзины
order = 'order:change', // изменения данных заказа
orderOpen = 'order:open', // открытие формы заказа
orderSubmit = 'order:submit', // отправка формы заказа
contactsSubmit = 'contacts:submit', // отправка формы контактов
orderDone = 'order:done', // заказ готов
error = 'message:error', // ошибки формы или приложения
success = 'success:newPurchase' // заказ успешно оформлен
}
Работа с DOM
Для безопасной работы с DOM элементами используются утилиты:

ensureElement<T>(selector: string, container?: HTMLElement): T - гарантированное получение элемента

cloneTemplate<T extends HTMLElement>(template: HTMLTemplateElement): T - клонирование шаблона

createElement<T extends HTMLElement>(tagName: string, options?: ElementCreationOptions): T - создание элемента

Эта архитектура обеспечивает четкое разделение ответственности между компонентами и легкость тестирования и поддержки кода.
