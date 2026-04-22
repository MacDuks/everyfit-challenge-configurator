# EveryFit Challenge Configurator

Vite + React интерфейс для настройки корпоративного фитнес-челленджа.

## Локальный запуск

```bash
corepack enable
pnpm install
pnpm dev
```

Приложение поднимается на `http://127.0.0.1:4173/`.

## Сборка

```bash
pnpm build
```

## Публикация на Vercel

Для этого проекта Vercel сейчас предпочтительнее, чем GitHub Pages:

- Vite разворачивается без дополнительной настройки
- каждая правка в GitHub может автоматически деплоиться онлайн
- есть preview-ссылки для проверки изменений

### 1. Подготовить репозиторий

Создайте новый репозиторий на GitHub и загрузите проект:

```bash
git init
git checkout -b main
git add .
git commit -m "Initial Vercel deployment"
git remote add origin <ВАШ_GITHUB_REPO_URL>
git push -u origin main
```

### 2. Развернуть в Vercel

1. Зайдите в [https://vercel.com/](https://vercel.com/).
2. Нажмите `Add New Project`.
3. Подключите GitHub-аккаунт, если он еще не подключен.
4. Выберите ваш репозиторий с проектом.
5. Проверьте настройки проекта:
   - `Framework Preset`: `Vite`
   - `Build Command`: `pnpm build`
   - `Output Directory`: `dist`
   - `Install Command`: `pnpm install`
6. Нажмите `Deploy`.

После этого Vercel выдаст публичную ссылку на проект.

### 3. Дальше обновлять сайт

После первого деплоя схема простая:

```bash
git add .
git commit -m "Update configurator"
git push
```

После каждого `git push` Vercel будет автоматически пересобирать и обновлять сайт.

### 4. Где править дальше

Можно работать любым из способов:

- локально в этом проекте и пушить изменения в GitHub
- через веб-редактор GitHub
- через GitHub Codespaces
- через Vercel, используя подключенный GitHub-репозиторий как источник

## Что уже подготовлено

- `vite.config.js` настроен под обычный root-deploy на Vercel
- проект собирается командой `pnpm build`
- результат сборки лежит в `dist`

## Проверка перед деплоем

```bash
pnpm install
pnpm build
```

Если сборка проходит локально, Vercel обычно разворачивает такой проект без дополнительных действий.
