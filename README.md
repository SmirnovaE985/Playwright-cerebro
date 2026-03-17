# Cerebro E2E — автотесты на Playwright

Проект  **Cerebro** — рабочего места менеджера контакт-центра. Является учебным и служит демонстрацией навыков автоматизации **UI**  тестирования с использованием Playwright.


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
playwright/
│
├── .github/                     # конфигурация GitHub (CI, workflows)
│
├── e2e/                         # E2E тесты
│   ├── api/                     # API smoke / API тесты
│   │   └── api-smoke.spec.ts
│   │
│   ├── auth/                    # авторизация и подготовка
│   │   └── auth.setup.ts
│   │
│   ├── create-appeal.spec.ts          # тесты создания заказов
│   ├── create-order-debitor.spec.ts
│   ├── create-order-concrete.spec.ts
│   ├── create-order.spec.ts
│   ├── other-cases.spec.ts
│   └── example.spec.ts
│
├── helpers/                     # хелперы и кастомные команды
│   └── commands.ts
│
├── playwright/.auth/            # сохранённые состояния авторизации
│
├── test-results/                # результаты тестов (падения, логи)
├── playwright-report/           # HTML отчёт Playwright
├── allure-results/              # результаты для Allure
│
├── .env                         # переменные окружения
├── .env.example                 # пример env файла
├── .gitignore
│
├── package.json
├── package-lock.json
├── yarn.lock
│
├── playwright.config.ts         # конфигурация Playwright
│
├── README.md
│
├── .gitlab-ci.yml               # CI (если используется GitLab)
│
└── devops/                      # (опционально) скрипты/конфиги для CI/CD
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
