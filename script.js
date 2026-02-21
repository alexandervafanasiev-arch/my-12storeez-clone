// 1. Создаем переменную-счетчик. Начинаем с нуля.
let count = 0;

// 2. Находим элемент счетчика в шапке по его ID
const countDisplay = document.getElementById('cart-count');

// 3. Находим все кнопки "В корзину"
const buttons = document.querySelectorAll('.add-to-cart-btn');

// 4. Вешаем событие на каждую кнопку
buttons.forEach(button => {
    button.addEventListener('click', () => {
        // Увеличиваем значение переменной на 1
        count = count + 1; 
        
        // Обновляем текст на странице новым значением
        countDisplay.textContent = count;

        // --- Тот код, который мы писали раньше (эффект кнопки) ---
        button.textContent = 'Добавлено ✓';
        button.style.backgroundColor = '#888';
        
        setTimeout(() => {
            button.textContent = 'В корзину';
            button.style.backgroundColor = '#000';
        }, 1000);
    });
});

// Находим элементы модального окна
const modal = document.getElementById('modal');
const fullImg = document.getElementById('full-img');
const closeBtn = document.querySelector('.close');

// Находим все картинки товаров
const images = document.querySelectorAll('.product-image');

// Для каждой картинки добавляем событие клика
images.forEach(img => {
    img.addEventListener('click', () => {
        modal.style.display = "block"; // Показываем окно
        fullImg.src = img.src; // Копируем адрес картинки, на которую нажали
    });
});

// Закрытие при клике на крестик
closeBtn.onclick = () => {
    modal.style.display = "none";
}

// Закрытие при клике на любое место фона
modal.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}
// Слушаем событие прокрутки (scroll) окна браузера
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    
    // Если прокрутили больше чем на 50 пикселей вниз
    if (window.scrollY > 50) {
        // Добавляем класс .scrolled, который мы описали в CSS
        header.classList.add('scrolled');
    } else {
        // Если вернулись в самое начало — убираем этот класс
        header.classList.remove('scrolled');
    }
});

// Находим все кнопки сердечек
const wishlistButtons = document.querySelectorAll('.wishlist-btn');

wishlistButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Находим внутри кнопки элемент с иконкой
        const icon = btn.querySelector('.heart-icon');
        
        // toggle — это команда "если класс есть — удали, если нет — добавь"
        btn.classList.toggle('active');
        
        // Меняем символ внутри: закрашенное сердце (♥) или пустое (♡)
        if (btn.classList.contains('active')) {
            icon.innerHTML = '&#9829;'; // Код закрашенного сердца
        } else {
            icon.innerHTML = '&#9825;'; // Код пустого сердца
        }
    });
});

// 1. Находим кнопки и все карточки товаров
const filterButtons = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.product-card');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Убираем активный стиль у всех кнопок и даем нажатой
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        cards.forEach(card => {
            // Если выбрано "all" или категория совпадает — показываем
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = "block";
            } else {
                // Иначе — скрываем
                card.style.display = "none";
            }
        });
    });
});
// 1. Находим форму и элементы сообщения
const subscribeForm = document.getElementById('subscribe-form');
const emailInput = document.getElementById('user-email');
const subscribeMessage = document.getElementById('subscribe-message');

// 2. Слушаем событие "submit" (отправка формы)
subscribeForm.addEventListener('submit', (event) => {
    // ВАЖНО: останавливаем перезагрузку страницы (стандартное поведение браузера)
    event.preventDefault();

    // Забираем значение из поля ввода
    const emailValue = emailInput.value;

    // Имитируем отправку на сервер
    console.log("Email отправлен на сервер:", emailValue);

    // Показываем пользователю, что всё получилось
    subscribeForm.classList.add('hidden'); // Скрываем саму форму
    subscribeMessage.textContent = `Спасибо! Мы отправили письмо на ${emailValue}`;
    subscribeMessage.classList.remove('hidden'); // Показываем сообщение
});