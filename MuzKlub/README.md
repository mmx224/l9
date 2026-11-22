# MuzKlub

Сайт музыкальной группы на React + TypeScript + Vite. Работает с учебным JWT API: https://inai-col3.fishrungames.com/api/docs/

Возможности: регистрация, вход, выход, просмотр и редактирование своего профиля (имя, инструмент, описание, гонорар). Есть плашка загрузки, блокировка повторной отправки и отображение ошибок сервера. Профиль сохраняется на бэкенде.

## Структура

```
src/
  main.tsx            точка входа
  App.tsx             состояние и обработчики
  components/         Brand, AuthForm, ProfileCard, ProfileForm, Notice
  services/api.ts     JWT-клиент для API
  constants/          список инструментов по умолчанию
  styles/             tokens.css, base.css, components.css
tests/api.test.mjs    тесты API-клиента
```

## Локальный запуск

Нужен Node.js 24.

```sh
npm ci
npm run dev
```

Откройте адрес, который напечатает Vite. Проверка TypeScript и production-сборка:

```sh
npm run build
npm test
npm run preview
```

## Авторизация

Запросы отправляются на `https://inai-col3.fishrungames.com/api/`. Регистрация и вход возвращают JWT access в JSON и устанавливают refresh в HttpOnly cookie. Access хранится только в памяти приложения и передаётся для профиля в заголовке `Authorization: Bearer <access>`. Пароли и токены не записываются в localStorage или sessionStorage.

При перезагрузке страницы приложение вызывает `POST /token/refresh/` без тела, получает access и загружает профиль. При ответе `401` на запрос профиля оно обновляет access и один раз повторяет исходный запрос. Одновременные запросы используют одно обновление токена. Если refresh истёк, отображается форма входа. Сетевые ошибки не подменяются сообщением об истечении сессии.

Для refresh cookie используется `credentials: 'include'`; браузер должен разрешать cookie учебного API. При выходе приложение вызывает `POST /logout/`, очищает access из памяти и записывает только отметку `muzklub.loggedOut=1` в localStorage. Она запрещает автоматическое восстановление входа после выхода и удаляется при следующем успешном входе или регистрации. Если сервер недоступен, приложение показывает ошибку выхода, чтобы можно было повторить запрос.

При проверке 11 ноября 2026 года сервер выдавал refresh cookie с `HttpOnly; Secure; SameSite=None; Path=/api/`, но ответ logout удалял её без `SameSite=None; Secure`. Браузер отклонял удаление при запросе с другого сайта. Отметка выхода предотвращает повторный вход в этом браузере; для удаления самой HttpOnly cookie нужно исправить бэкенд: `response.delete_cookie('refresh_token', path='/api/', samesite='None')`. Django при `samesite='None'` автоматически добавляет `Secure`. JavaScript сайта не может удалить HttpOnly cookie другого домена. Если localStorage запрещён браузером, отметка действует только до перезагрузки вкладки.

Методы: `POST /register/`, `POST /login/`, `POST /token/refresh/`, `POST /logout/`, `GET /profile/`, `PATCH /profile/`, `GET /specializations/`. Схема: https://inai-col3.fishrungames.com/api/schema/

`npm test` проверяет JWT-запросы, восстановление входа, повтор после `401`, одновременное обновление токена, выход и обработку ошибок без обращения к реальному API.

## GitHub Pages

Публикация: https://neji79568-cmd.github.io/MuzKlub/

Workflow `.github/workflows/pages.yml` запускается при push в `main`: `npm ci`, тесты JWT, проверка TypeScript и сборка, загрузка `dist`, публикация на Pages. Источник Pages в настройках репозитория — **GitHub Actions**. Путь `/MuzKlub/` задан в `vite.config.ts`; workflow также передаёт имя репозитория в `--base`.
