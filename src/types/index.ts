// ========== БАЗОВЫЕ СУЩНОСТИ ==========
// Эти типы описывают данные, которые приходят непосредственно с сервера.

// Полное описание товара, полученное с API 
export interface IItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null; // если не указана, то null
    index?: string;
}

// Данные о заказе, которые отправляются на сервер
export interface IOrder {
payment: 'card' | 'cash' | '';//картой, при получении и если не выбрано
email: string;
phone: string;
address: string;
total: number; // Сумма заказа
items: string[]; // Массив ID товаров
}

export interface IOrderConfirmed {
  id: string;
  total: number;
}

