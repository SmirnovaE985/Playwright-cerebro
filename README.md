# Cerebro E2E — автотесты на Playwright

Проект предназначен для автоматизированного **end-to-end тестирования** системы **Cerebro** — рабочего места менеджера контакт-центра.

Основная цель проекта — проверка ключевых пользовательских сценариев, снижение рисков при изменениях и поддержка регрессионного тестирования.  
В репозитории содержатся только e2e-тесты, реализованные на **Playwright**.

---

## Описание проекта

Cerebro — это единый интерфейс для работы сотрудников контакт-центра.  
Автотесты в данном репозитории покрывают основные пользовательские сценарии в UI, а также часть API-проверок.

Проект используется для:

- локального запуска и отладки тестов;
- запуска регрессионных наборов;
- интеграции с CI;
- формирования отчётности в **Allure**.

---

## Стек

- **Язык:** TypeScript
- **Фреймворк автотестов:** Playwright
- **Среда выполнения:** Node.js
- **Менеджер пакетов:** npm
- **Отчёты:** Allure Report
- **CI:** GitLab CI / GitHub repository
- **Дополнительно:** allure-playwright, allure-js-commons

---

## Структура проекта

```text
.
├── .github/                    # служебные файлы GitHub
├── allure-results/             # результаты для Allure
├── e2e/                        # e2e-тесты
│   ├── api-smoke/              # API smoke тесты
│   ├── auth.setup.ts           # подготовка / авторизация
│   ├── create-appeal.spec.ts
│   ├── create-order-debitor.spec.ts
│   ├── create-order.concrete.spec.ts
│   ├── create-order.spec.ts
│   ├── example.spec.ts
│   └── other-cases.spec.ts
├── helpers/                    # хелперы и вспомогательные команды
│   └── commands.ts
├── playwright/.auth/           # сохранённые данные авторизации
├── test-results/               # артефакты падений / результаты Playwright
├── package.json
├── playwright.config.ts
└── README.md
```

### Установка:

```bash
git clone git@github.com:SmirnovaE985/playwrite.git
cd playwrite
npm install
npx playwright install
```

## Запуск тестов
### Все тесты:

```bash
npm run test:e2e
```

#### Только regress:

```bash
npm run test:regress
```

#### Конкретный файл:

```bash
npx playwright test e2e/create-order.spec.ts
```

#### По названию теста:

```bash
npx playwright test -g "Создать заказ"
```

### Allure

Результаты тестов сохраняются в папку:

```bash
allure-results
```

### Сгенерировать отчёт

```bash
allure generate allure-results --clean -o allure-report
```

### Открыть отчёт

```bash
allure open allure-report
```

### Установка Allure CLI

```bash
npm install -g allure-commandline
```

### Запуск тестов через job
Тесты можно запускать не только локально, но и через job в Allure / TestOps.
По текущей настройке используется запуск job с параметрами:

**Branch: ci-add-regress**
**Grep: @regress**


### Пример сценария запуска через job
1. Открыть job в Allure / TestOps.
2. Выбрать нужную ветку.
3. Указать grep-фильтр, например:
   
```bash
@regress
```
4. Запустить job.
После завершения посмотреть результаты запуска в Allure

## Полезные команды

```bash
npm install
npx playwright install
npm run test:e2e
npm run test:regress
allure generate allure-results --clean -o allure-report
allure open allure-report
```
