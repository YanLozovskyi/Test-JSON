# Проект: Простий REST API для управління блог-постами з мінімальним користувацьким інтерфейсом.

## Встановлення

1. Клонуйте репозиторій: `git clone https://github.com/YanLozovskyi/Test-JSON.git`
2. Запустіть лайф сервер.

## Використання

### Отримати всі пости

blogPostApi.getAllPosts();

Ця команда використовується для отримання всіх постів з сервера.

### Отримати пост за ID

blogPostApi.getPostById(2);

Ця команда використовується для отримання конкретного поста за його унікальним ідентифікатором.

### Створити новий пост

blogPostApi.createPost({
title: "New Post",
body: "This is a new post.",
userId: 1,
});

Ця команда використовується для створення нового поста і відправки його на сервер.

### Оновити інформацію про пост

blogPostApi.updatePost(1, {
title: "Updated Post",
body: "This post has been updated.",
});

Ця команда використовується для оновлення інформації про конкретний пост за його унікальним ідентифікатором.

### Вилучити пост

blogPostApi.deletePost(1);

Ця команда використовується для видалення поста за його унікальним ідентифікатором.

## API Документація

https://jsonplaceholder.typicode.com/
