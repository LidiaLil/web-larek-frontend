import { IItem } from "../types";
import { Api, ApiPostMethods, ApiListResponse } from "./base/api";
import { IOrder, IOrderConfirmed } from "../types"; 

export interface IApi {
    cdn: string;  // Базовый URL для CDN
    items: IItem[]; // Кэшированный список товаров
    //GET-запрос
    get(uri: string): Promise<object>;
    // POST/PUT/DELETE запросы
    post<T>( 
    uri: string,        // путь к API методу - конкретный URL-адрес
    data: object,       // данные для отправки
    method?: ApiPostMethods, // HTTP метод 
    ): Promise<object>;

    // Бизнес-методы
    getItems(): Promise<IItem[]>; // Получение каталога товаров
    getItem(id: string): Promise<IItem>; // Получение одного товара по ID
    postOrder(order: IOrder): Promise<IOrderConfirmed>; // Оформление заказа
}
export class AppApi extends Api implements IApi {
    // baseUrl и options уже есть через наследование от Api
    readonly cdn: string; //добавлено
    items: IItem[] = []; // Инициализируем пустым массивом

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options); //вызывает конструктор родительского класса
        this.cdn = cdn;//Инициализация поля 'cdn' текущего класса, содержит переданный CDN URL
    }

    // Получение списка товаров с сервера
    getItems(): Promise<IItem[]> {
        return this.get('/product') // Выполняем GET запрос к endpoint '/product'
        .then((data: ApiListResponse<IItem>) => 
            data.items.map(item => ({
                ...item,
                image: this.cdn + item.image // Добавляем CDN к путям изображений
            }))
        );
    }

    // Получение информации о конкретном товаре по id
    getItem(id: string): Promise<IItem> {
        return this.get(`/product/${id}`).then(
            (item: IItem) => ({
                ...item,
                image: this.cdn + item.image // Добавляем CDN к пути изображения
            })
        );
    }

    // Оформление заказа
    postOrder(order: IOrder): Promise<IOrderConfirmed> {
        return this.post('/order', order).then(
            (data: IOrderConfirmed) => data
        );
    }

    
}