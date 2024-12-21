console.log('JavaScript загружен'); // Проверка загрузки JavaScript

// Инициализация канваса и контекста
const canvas = document.getElementById('gameCanvas');
canvas.width = 960; // Ширина канваса
canvas.height = 540; // Высота канваса
const ctx = canvas.getContext('2d');

// Размер ячейки сетки
let gridSize = 30; // Размер ячейки сетки

// Начальные координаты дракона
let dragon = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 }
];

// Начальное направление движения (вправо)
let dx = 1;
let dy = 0;

// Позиция еды
let food = getRandomFoodPosition();

// Счёт
let score = 0;
const scoreElement = document.getElementById('score');

// Устанавливаем начальную скорость игры
let gameSpeed = 400; // начальная скорость для легкого уровня
let gameInterval;

// Загрузка изображения дракона
const dragonImage = new Image();
dragonImage.src = 'assets/images/dragon.png';

// Загрузка изображения фона
const backgroundImage = new Image();
backgroundImage.src = 'assets/images/background1.png'; // Убедитесь, что путь правильный

// Загрузка изображения бургера
const burgerImage = new Image();
burgerImage.src = 'assets/images/burger.png'; // Убедитесь, что путь правильный

// Получаем элемент выбора сложности
const difficultySelect = document.getElementById('difficulty');

// Обработчик изменения уровня сложности
difficultySelect.addEventListener('change', (event) => {
    const difficulty = event.target.value;
    switch (difficulty) {
        case 'easy':
            gameSpeed = 800; // Легкий уровень
            break;
        case 'medium':
            gameSpeed = 600; // Средний уровень
            break;
        case 'hard':
            gameSpeed = 400; // Сложный уровень
            break;
    }
    resetGame(); // Сброс игры с новой скоростью
});

// Обработка загрузки изображения дракона
dragonImage.onload = () => {
    if (backgroundImage.complete && burgerImage.complete) {
        gameLoop();
    }
};

// Обработка загрузки изображения фона
backgroundImage.onload = () => {
    console.log('Фоновое изображение загружено');
    if (dragonImage.complete && burgerImage.complete) {
        gameLoop();
    }
};

// Обработка загрузки изображения бургера
burgerImage.onload = () => {
    console.log('Изображение бургера загружено');
    if (dragonImage.complete && backgroundImage.complete) {
        gameLoop();
    }
};

// Обработка нажатия кнопки для полноэкранного режима
document.getElementById('fullscreenBtn').addEventListener('click', () => {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if (canvas.mozRequestFullScreen) { // Firefox
        canvas.mozRequestFullScreen();
    } else if (canvas.webkitRequestFullscreen) { // Chrome, Safari и Opera
        canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) { // IE/Edge
        canvas.msRequestFullscreen();
    }
});

// Основной игровой цикл
function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, gameSpeed); // Запускаем следующий цикл
}

// Обновление состояния игры
function update() {
    const head = { x: dragon[0].x + dx, y: dragon[0].y + dy };

    // Проверка столкновений с границами
    if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
        resetGame(); // Начать игру заново при столкновении с краем
        return;
    }

    // Проверка столкновения с собой
    for (let segment of dragon) {
        if (head.x === segment.x && head.y === segment.y) {
            resetGame();
            return;
        }
    }

    dragon.unshift(head);

    // Проверка поедания еды
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = `Очки: ${score}`; // Обновление отображения очков
        food = getRandomFoodPosition();

        // Ускорение игры каждые 8 очков
        if (score % 8 === 0) {
            clearTimeout(gameInterval);
            gameSpeed = Math.max(50, gameSpeed - 10); // минимальная скорость 50ms
            gameLoop();
        }
    } else {
        dragon.pop();
    }
}

// Отрисовка элементов игры
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Отрисовка фона
    if (backgroundImage.complete) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = '#000'; // резервный цвет фона
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Отрисовка дракона
    for (let segment of dragon) {
        drawDragon(segment.x, segment.y);
    }

    // Отрисовка еды (бургера)
    drawCell(food.x, food.y, burgerImage);
}

// Функция для отрисовки сегмента дракона
function drawDragon(x, y) {
    ctx.drawImage(dragonImage, x * gridSize, y * gridSize, gridSize, gridSize);
}

// Функция для отрисовки одной ячейки (еды)
function drawCell(x, y, image) {
    ctx.drawImage(image, x * gridSize, y * gridSize, gridSize, gridSize);
}

// Генерация случайной позиции для еды
function getRandomFoodPosition() {
    let newFood;
    let collision;

    do {
        newFood = {
            x: Math.floor(Math.random() * (canvas.width / gridSize - 2)) + 1, // Изменено: избегаем краев
            y: Math.floor(Math.random() * (canvas.height / gridSize - 2)) + 1 // Изменено: избегаем краев
        };
        collision = dragon.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    } while (collision);

    return newFood;
}

// Сброс игры
function resetGame() {
    clearTimeout(gameInterval);
    dragon = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 }
    ];
    dx = 1;
    dy = 0;
    score = 0;
    scoreElement.textContent = `Очки: ${score}`; // Сброс очков
    gameSpeed = 800; // Сброс скорости для легкого уровня
    food = getRandomFoodPosition();
    gameLoop();
}

// Обработка нажатий клавиш для управления
document.addEventListener('keydown', changeDirection);

// Обработка нажатий кнопок управления для мобильных устройств
document.getElementById('upBtn').addEventListener('click', () => {
    if (dy === 0) {
        dx = 0;
        dy = -1; // Поворот вверх
    }
});

document.getElementById('downBtn').addEventListener('click', () => {
    if (dy === 0) {
        dx = 0;
        dy = 1; // Поворот вниз
    }
});

document.getElementById('leftBtn').addEventListener('click', () => {
    if (dx === 0) {
        dx = -1; // Поворот влево
        dy = 0;
    }
});

document.getElementById('rightBtn').addEventListener('click', () => {
    if (dx === 0) {
        dx = 1; // Поворот вправо
        dy = 0;
    }
});

// Функция для смены направления движения
function changeDirection(event) {
    const key = event.key;
    if (key === 'ArrowUp' && dy === 0) {
        dx = 0;
        dy = -1; // Поворот вверх
    } else if (key === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = 1; // Поворот вниз
    } else if (key === 'ArrowLeft' && dx === 0) {
        dx = -1; // Поворот влево
        dy = 0;
    } else if (key === 'ArrowRight' && dx === 0) {
        dx = 1; // Поворот вправо
        dy = 0;
    }
}
