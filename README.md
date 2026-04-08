# Cerebro E2E — автотесты на Playwright

Проект  **Cerebro** — рабочее место менеджера контакт-центра. Демонстрация комплексного подхода к автоматизированному тестированию веб‑приложения на базе фреймворка Playwright. 

---
#### Описание проекта
Основная цель проекта — проверка ключевых пользовательских сценариев, снижение рисков при изменениях и поддержка регрессионного тестирования.  
В репозитории содержатся e2e-тесты, реализованные на **Playwright**. Тесты охватывают ключевые сценарии взаимодействия с пользовательским интерфейсом, включая:

1. проверку аутентификации и авторизации;
2. тестирование CRUD‑операций с основными сущностями системы;
3. валидацию корректности отображения данных;
4. проверку обработки ошибок на фронтенде;
5. проверка пользовательских сценариев. 
---

#### Генерация отчётов

После выполнения тестов результаты сохраняются для последующей генерации отчёта в **Allure**.

Allure-отчёт позволяет получить детальную информацию по выполнению тестов, включая:

1. статус выполнения каждого теста;
2. время выполнения сценариев;
3. шаги теста;
4. информацию об ошибках при падении;
5. вложения и дополнительные артефакты (при наличии).

Для генерации и просмотра отчёта необходимо выполнить следующие шаги:

Для генерации и просмотра отчёта необходимо выполнить следующие шаги:

1. Запустить тесты:
```bash
npx playwright test
```

2. Сгенерировать Allure-отчёт:
```
allure generate ./allure-results --clean
```
3. Открыть отчёт в браузере:
```
allure open ./allure-report
```

Результаты выполнения тестов сохраняются в папке allure-results, сгенерированный отчёт — в папке allure-report.



---
## Стек

- **Язык:** TypeScript
- **Фреймворк автотестов:** Playwright
- **Среда выполнения:** Node.js
- **Менеджер пакетов:** npm
- **Отчёты:** Allure Report/ HTML
- **CI:** GitLab CI / GitHub repository
- **Дополнительно:** allure-playwright, allure-js-commons

---

## Структура проекта

```text
.
playwright/
│
├── .github/
│ └── workflows/ │
│      └── playwright.yml
├── allure-results/              # Результаты Allure отчетов                     
│
├── e2e/                         # E2E тесты
│   ├── api/                     
│   │   └── api-smoke.spec.ts    # API smoke / API тесты
│   ├── pom/                     # Тесты с использованием Page Object Model (POM)
│   │ └── create-order.pom.spec.ts
│   │
│   ├── auth/                    # авторизация и подготовка
│   │   └── auth.setup.ts
│   │
│   ├── create-appeal.spec.ts          # тесты
│   ├── create-order-debitor.spec.ts
│   ├── create-order-concrete.spec.ts
│   ├── create-order.spec.ts
│   ├── other-cases.spec.ts
│   └── example.spec.ts
│
├── helpers/                     # хелперы и кастомные команды
│   └── commands.ts
├── pages/
│   ├── appeal/
│   │    └── AppealStartPage.ts
│   │
│   ├── components/             # Общие UI-компоненты (если будут)
│   │
│   └── order/
│         └── OrderCreatePage.ts
│
├── playwright/.auth/            # сохранённые состояния авторизации
│
├── playwright-report/           # HTML отчёты Playwright
├── test-results/                # Результаты тестов
│
├── .env                         # переменные окружения
├── .env.example                 # пример env файла
├── .gitignore
├── .gitlab-ci.yml
├── allurectl.exe
├── package.json
├── package-lock.json
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

```
npx playwright test e2e
```

#### Все тесты из e2e в браузере:
```
npx playwright test e2e --headed
```

#### Для запуска по очереди:
```
npx playwright test e2e --headed --workers=1
```

#### Только regress:

```
npx playwright test regress
```

#### Конкретный файл:

```
npx playwright test e2e/create-order.spec.ts
```

#### По названию теста:

```
npx playwright test -g "Создать заказ"
```

#### С html-отчетом:

```
npx playwright test e2e --reporter=html
npx playwright show-report
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
