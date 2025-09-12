// Определение типов для ответов API
// Базовый класс для работы с API
export type ApiListResponse<Type> = {
    total: number,      // Общее количество элементов
    items: Type[]       // Массив элементов указанного типа
};

// Тип для HTTP-методов, изменяющих данные  на сервере
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Базовый класс для работы с API
export class Api {
    readonly baseUrl: string; // Базовый URL API
    protected options: RequestInit;  // Настройки запросов по умолчанию
    
    // Конструктор класса
    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json', // Устанавливаем JSON-заголовок
                ...(options.headers as object ?? {}) // Добавляем пользовательские заголовки
            }
        };
    }

    // Обработчик ответов от сервера
    protected handleResponse(response: Response): Promise<object> {
        if (response.ok) return response.json();// Успешный ответ - возвращаем JSON
        else return response.json() // Ошибка - пытаемся получить JSON с ошибкой
            .then(data => Promise.reject(data.error ?? response.statusText)); // Отклоняем промис с ошибкой
    }

    // GET-запрос
    get(uri: string) {
        return fetch(this.baseUrl + uri, {
            ...this.options, // Используем базовые настройки
            method: 'GET'
        }).then(this.handleResponse); // Обрабатываем ответ
    }

    // POST/PUT/DELETE запросы
    post(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, {
            ...this.options,          // Базовые настройки
            method,                   // Указанный метод (POST, PUT, DELETE)
            body: JSON.stringify(data) // Преобразуем данные в JSON-строку
        }).then(this.handleResponse);  // Обрабатываем ответ
    }
}
