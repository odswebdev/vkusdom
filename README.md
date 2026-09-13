<div align="center">

# 🛒 ВкусДом — страница «Все бренды»

**Каталог брендов гипермаркета с алфавитным фильтром, слайдером популярных марок и полной адаптивностью.**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![Swiper](https://img.shields.io/badge/Swiper_11-6332F6?style=for-the-badge&logo=swiper&logoColor=white)](https://swiperjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-5B846E?style=for-the-badge)](LICENSE)

</div>

---

## 📸 Скриншот

<div align="center">

![Скриншот страницы «Все бренды»](docs/vkusdom-desktop.png)

*Десктопная версия — популярные бренды и алфавитный каталог*

</div>

## ✨ Что на странице

<table>
<tr>
<td width="50%" valign="top">

### 🖥️ Десктоп

- **Хедер** — логотип, поиск с кнопкой «Каталог», выбор способа получения, иконки (избранное, корзина, ЛК), горизонтальное меню разделов со скроллом
- **Хлебные крошки** — «Главная → Бренды»
- **Популярные бренды** — слайдер с логотипами и стрелками
- **Все бренды** — фильтр по буквам в три колонки
- **Футер** — меню, приложения, подписка, контакты, соцсети

</td>
<td width="50%" valign="top">

### 📱 Мобильный

- **Хедер** — компактный логотип, поиск, бургер
- **Переключатель** «Доставка / Самовывоз»
- **Drawer-меню** с фокус-трапом и блокировкой скролла
- **Слайдер брендов** — компактные карточки
- **Фильтр по буквам** — разбит на строки
- **Футер** — аккордеонный, с бейджами приложений

</td>
</tr>
</table>

---

## 🛠 Стек

<div align="center">

| Слой | Технология |
|:---|:---|
| **Разметка** | HTML5, семантические теги, SVG-спрайт для иконок |
| **Стили** | CSS3, переменные (`--vkusdom-*`), Flexbox, Grid |
| **Логика** | Vanilla JS (ES5-совместимый, IIFE, без сборки) |
| **Слайдеры** | Swiper 11 (CDN) + нативный fallback через `scroll-snap` |
| **Шрифты** | Google Fonts — Geologica (400, 600) |
| **Изображения** | WebP с `srcset`/`sizes`, SVG для логотипов и соцсетей |
| **Интерактив** | IntersectionObserver (reveal), Pointer Events (ripple), `prefers-reduced-motion` |
| **SEO** | Open Graph, Twitter Cards, JSON-LD (`BreadcrumbList`, `CollectionPage`), `canonical` |
| **Доступность** | ARIA, focus-trap, skip-link, скрытие декоративных SVG |

</div>

> 📦 **Без сборщиков.** Никакого webpack / vite / gulp. Внешние зависимости — только CDN Swiper и Google Fonts.

<div align="center">

## 📁 Структура

<pre>
vkusdom-f-6/
├── index.html           — страница целиком
├── css/
│   └── style.css        — стили (CSS3 + переменные)
├── js/
│   └── main.js          — логика (vanilla JS)
├── img/                 — ассеты
│   ├── brand_N.png      — исходники логотипов
│   ├── brand_N-115.webp — мобильный слайдер
│   ├── brand_N-215.webp — десктоп-слайдер
│   ├── brand_N-430.webp — retina-версия
│   ├── badge-*.svg      — иконки магазинов приложений
│   ├── social-*.svg     — иконки соцсетей
│   └── logo_*.svg       — логотипы ВкусДом
├── scripts/
│   ├── build-images.bat — генерация WebP (Windows)
│   └── build-images.sh  — генерация WebP (*nix)
└── README.md
</pre>

</div>

## 🚀 Запуск

### Вариант 1 — просто открыть

Дважды кликни `index.html`.

VS Code: расширение Live Server → правый клик на index.html → Open with Live Server.

✅ Мобильное меню открывается на мобильном (< 768px)

✅ Фильтр по буквам переключает списки

✅ Tab-навигация не выходит за пределы открытого drawer

Исходные логотипы лежат в img/*.png. Скрипты создают три размера WebP: 115, 215 и 430 px.

Проект полностью статический — сборка не нужна.

📱 Проверено в браузерах
<div align="center">

[![Chrome](https://img.shields.io/badge/Chrome-4285F4?style=flat-square&logo=googlechrome&logoColor=white)]
[![Safari](https://img.shields.io/badge/Safari-000000?style=flat-square&logo=safari&logoColor=white)]
[![Firefox](https://img.shields.io/badge/Firefox-FF7139?style=flat-square&logo=firefox&logoColor=white)]
[![Edge](https://img.shields.io/badge/Firefox-FF7139?style=flat-square&logo=firefox&logoColor=white)]

</div>

📄 Лицензия
Распространяется под лицензией MIT. Подробнее — в файле LICENSE.

<div align="center">
Сделано с 💚 для ВкусДом
</div>