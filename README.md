# Мій Особистий Бюджет — Supabase

Цей проєкт — простий веб-застосунок для обліку доходів і витрат з онлайн-синхронізацією через Supabase.

## Що вже зроблено
- Є `index.html` з інтерфейсом для введення витрат/доходів
- Додано email/password автентифікацію через Supabase
- Додано поле `familyId`, щоб двоє людей могли дивитися спільні записи
- Синхронізація даних відбувається в реальному часі через Supabase Realtime

---

## Крок 1 — Створіть Supabase проєкт
1. Зайдіть на https://supabase.com
2. Зареєструйтеся або увійдіть
3. Створіть новий проєкт
4. Зачекайте, поки проєкт підготується

---

## Крок 2 — Налаштуйте таблиці у Supabase
1. Відкрийте Dashboard вашого проєкту
2. Перейдіть до `SQL Editor`
3. У SQL Editor вставляйте тільки самі SQL-запити — без рядків `sql`, ```sql або ```.

Вставляйте цей текст прямо у поле редактора запитів:

-- profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY,
  email text,
  family_id text,
  created_at timestamptz DEFAULT now()
);

-- entries
CREATE TABLE IF NOT EXISTS public.entries (
  id bigserial PRIMARY KEY,
  user_id uuid,
  family_id text,
  type text,
  user_name text,
  curr text,
  amount numeric,
  cat text,
  date timestamptz,
  month_key text,
  created_at timestamptz DEFAULT now()
);

4. Натисніть `RUN`

> Якщо зʼявиться повідомлення про RLS, оберіть `Запуск та увімкнення RLS`.
> Це найкраще для безпеки, бо дозволяє обмежити доступ до таблиць лише авторизованим користувачам.

---

## Крок 3 — Налаштуйте RLS-політики (потрібно після створення таблиць)
1. У тому ж `SQL Editor` виконайте наступний SQL:

```sql
-- Увімкнути RLS і політики для profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;
CREATE POLICY "Users can manage own profile" ON public.profiles
  FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Увімкнути RLS і політики для entries
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Family members can select entries" ON public.entries
  FOR SELECT USING (
    family_id = (SELECT family_id FROM public.profiles WHERE id = auth.uid())
  );
CREATE POLICY "Users can insert own entries" ON public.entries
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND family_id = (SELECT family_id FROM public.profiles WHERE id = auth.uid())
  );
CREATE POLICY "Users can update own entries" ON public.entries
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own entries" ON public.entries
  FOR DELETE USING (auth.uid() = user_id);
```

2. Натисніть `RUN`

> Якщо ви не хочете зараз налаштовувати RLS — можна вибрати `Запуск без RLS` у вікні, але тоді ваші таблиці будуть доступні ширше. Для безпечної роботи рекомендовано вмикати RLS.

---

## Крок 4 — Вставте свої Supabase ключі у `index.html`
1. Відкрийте файл `c:\Users\Назар\проект\index.html`
2. Знайдіть блок:

```js
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

3. В Dashboard Supabase перейдіть у `Settings` → `API`
4. Скопіюйте `URL` і `anon key`
5. Вставте їх замість `YOUR_SUPABASE_URL` і `YOUR_ANON_KEY`
> Важливо: в `Authentication` → `Settings` → `Sign-up` має бути дозволено реєстрацію по email. Якщо цей параметр вимкнений, реєстрація видасть помилку.
> Приклад:
> ```js
> const SUPABASE_URL = 'https://xxxxxx.supabase.co';
> const SUPABASE_ANON_KEY = 'eyJhbGciOi...';
> ```

---

## Крок 4 — Запустіть локальний сайт
1. Відкрийте термінал у папці `c:\Users\Назар\проект`
2. Запустіть команду:

```bash
python -m http.server 8000
```

3. Відкрийте у браузері:

```
http://localhost:8000/index.html
```

> Якщо у вас немає Python, можна скористатися будь-яким простим HTTP-сервером або відкривати HTML через локальний веб-сервер.

---

## Крок 5 — Зареєструйтесь і підключіться до сім'ї
1. У формі натисніть `Увійти`
2. Вкажіть email та пароль
3. Натисніть `Зареєструватися`
4. Якщо потрібно, підтвердіть email (залежить від налаштувань Supabase)
5. Увійдіть через ту ж саму форму
6. Введіть однаковий `familyId` для обох користувачів
7. Натисніть `Join`

> `familyId` може бути будь-яким словом або кодом, наприклад `myfamily123`.

---

## Крок 6 — Перевірка синхронізації
1. Введіть витрату або дохід на одному пристрої
2. Інший пристрій має бути також увійшов і підключений до того самого `familyId`
3. Зміни повинні з'явитися автоматично

---

## Крок 7 — Додаткові кроки
- Якщо хочете опублікувати сайт онлайн, можна використовувати Supabase Hosting або будь-який інший статичний хостинг.
- Для супроводу сайту на Supabase можна додати `index.html` до GitHub Pages, Vercel або Netlify.

---

## Проблеми й виправлення
- Якщо сайт не працює, перевірте в консолі браузера (`F12`) на помилки
- Переконайтеся, що `SUPABASE_URL` і `SUPABASE_ANON_KEY` в файлі вказані правильно
- Якщо таблиці не створено, виконайте SQL ще раз

---

## Як опублікувати сайт

### Варіант 1 — Vercel (рекомендовано)
1. Відкрийте https://vercel.com
2. Увійдіть або створіть акаунт
3. Натисніть `New Project`
4. Підключіть GitHub, GitLab або Bitbucket, якщо ще не підключено
5. Натисніть `Import Git Repository`
6. Виберіть репозиторій, в якому знаходиться цей проєкт
7. Vercel автоматично знайде `index.html` і розгорне сайт
8. Після завершення отримаєте публічний URL на кшталт `https://your-project.vercel.app`

> Якщо у вас ще немає репозиторію, зробіть так:
> 1. Створіть новий репозиторій на GitHub
> 2. Виконайте `git init`, `git add .`, `git commit -m "Initial commit"`, `git branch -M main`
> 3. Додайте віддалений репозиторій GitHub та виконайте `git push -u origin main`
> 4. Поверніться в Vercel і імпортуйте цей репозиторій.

> Якщо git недоступний, завантажте файли через веб-інтерфейс GitHub або використайте файл `GITHUB_UPLOAD.md`.

> В проєкті вже додано `vercel.json`, тому Vercel точно запустить статичний сайт і віддаватиме `index.html`.

### Варіант 2 — Netlify
1. Відкрийте https://app.netlify.com
2. Увійдіть або створіть акаунт
3. Натисніть `Add new site` → `Deploy manually`
4. Перетягніть у вікно файл `index.html` і `supabase.min.js`
5. Після завершення ви отримаєте публічний URL

> Якщо хочете, можна додати проект на GitHub і підключити Netlify через `New site from Git`.

### Варіант 3 — Supabase Hosting
1. Відкрийте ваш Supabase проєкт
2. Перейдіть у розділ `Hosting`
3. Натисніть `Deploy a new site` або `New site`
4. Вкажіть папку з сайтом (за потреби завантажте `index.html` і `supabase.min.js`)
5. Supabase створить публічний URL на кшталт `https://your-site-name.supabase.co`

> Якщо у Supabase немає розділу `Hosting`, значить на безкоштовному плані його може не бути. У такому випадку використайте Vercel або Netlify.

---

## Що робити далі
Якщо хочете, я можу:
- додати автоматичне перенаправлення на вхід/реєстрацію
- додати валідацію email і красиві повідомлення помилок
- зробити окремий файл `config.js` для ключів Supabase
