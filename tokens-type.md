# Типографика Web DS · Алиса AI

Источник: файл `W2sAt3o3pqhU9p07YAoC2S`, узел `1926:5773` (Example). Числа — resolved `get_variable_defs` в режиме кадра. В колонку 375 подставлены mobile-значения. `letter-spacing` у всех этих токенов `0`.

`get_design_context` в CSS-фолбэках показывает desktop-режим той же переменной (например `title/L` 56/50 даже на мобильном узле). Ниже — значения, которые переменная реально отдаёт на узле.

## Заголовки

| Токен | Desktop | Mobile | Family | Weight | Line-height | Features |
| --- | --- | --- | --- | --- | --- | --- |
| title/L | 56 / 50 | 45 / 42 | YS Compressed | 700 Bold | desktop 50, mobile 42 | `"ss01" 1` |
| title/M | 38 / 40 | 30 / 32 | YS Compressed | 700 Bold | desktop 40, mobile 32 | `"ss01" 1` |
| title/S | 36 / 48 | 20 / 30 | YS Text Compact | 400 Regular | desktop 48, mobile 30 | нет |

На лендинг: крупные заголовки секций → mobile `title/L` (45/42). Заголовки карточек и второстепенные → mobile `title/S` (20/30). `title/M` в вёрстку 375 не ставился.

Узлы: title/L desktop `1972:47134`, `1926:6232`, `1926:6338`; title/L mobile `1957:20341` (кадр Mobile 375). title/M desktop `1957:19507`; title/M mobile `1957:20174`. title/S desktop `1948:18886`; title/S mobile `2345:2431`.

## Прочие шрифты (на сайт не применялись)

| Токен | Desktop | Mobile | Family | Weight | Line-height |
| --- | --- | --- | --- | --- | --- |
| paragraph/L | 19 / 30 | 16 / 24 | YS Text Compact | 400 | desktop 30, mobile 24 |
| body/M | 17 / 24 | 17 / 22 | YS Text Compact | desktop 400; на мобильной карточке Font weight 450, алиас weight/regular = «400» | desktop 24, mobile 22 |
| body/S | — | 15 / 22 | YS Text Compact | 400 | 22 |
| label/S | — | 15 / 20 | YS Text Compact | 500 Medium | 20 |

body/S mobile — узел `2037:59991`. body/M desktop — `1926:6349`. label/S mobile — `1957:20340`. paragraph/L desktop `1972:47135`, mobile `1957:20175`.

Заголовок карточки в компоненте Cards на desktop — `title/M`, на mobile — `body/M` (не title). На лендинге карточки железа приведены к heading-токену `title/S`, как к маленькому уровню заголовка.

## Цвета, которые пришли вместе (на сайт не применялись)

- `type-and-icons/primary` `#302b31e5` → rgba(48, 43, 49, 0.9)
- `type-and-icons/primary-inverted` `#ffffff`
- `type-and-icons/secondary` `#302b317a` → rgba(48, 43, 49, ~0.48)
