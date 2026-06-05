# GitHub Repo Setup for My Budget Project

## 1. Створити репозиторій на GitHub
1. Відкрийте https://github.com
2. Увійдіть у свій акаунт
3. Натисніть кнопку `+` у правому верхньому куті → `New repository`
4. Введіть назву (наприклад, `my-budget-supabase`)
5. Залиште `Public` або `Private` за потребою
6. Не додавайте `README`, `.gitignore` чи ліцензію зараз, бо у вас вже є файли
7. Натисніть `Create repository`

## 2. Завантажити файли через веб-інтерфейс
1. Після створення репозиторію на GitHub ви побачите сторінку з інструкцією
2. Натисніть `uploading an existing file`
3. Перетягніть у вікно або виберіть файли з папки `c:\Users\Назар\проект`:
   - `index.html`
   - `supabase.min.js`
   - `README.md`
   - `vercel.json`
   - `netlify.toml`
   - `.gitignore`
   - `GITHUB_UPLOAD.md`
4. Натисніть `Commit changes`

## 3. Якщо хочете використовувати Git локально (коли git з'явиться)
1. Відкрийте термінал у папці `c:\Users\Назар\проект`
2. Виконайте:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГІН/ВАШ_РЕПОЗИТОРІЙ.git
git push -u origin main
```

> Замініть `ВАШ_ЛОГІН` і `ВАШ_РЕПОЗИТОРІЙ` на свої значення.

## 4. Після завантаження на GitHub
- поверніться до Vercel
- натисніть `New Project`
- підключіть репозиторій
- розгорніть сайт

Якщо хочеш, можу зараз ще коротко пояснити кожен крок із картинками у тексті. 