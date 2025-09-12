//константы для определения основного адреса для запросов на сервер.
//API_URL - используется для запросов данных о товарах и отправки заказа
export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
//CDN_URL - используется для формирования адреса картинки в товаре.
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

// export const settings = {
//   headers: {
//     authorization: `${process.env.API_TOKEN}`,
//     'Content-Type': 'application/json',
//   },
// };

