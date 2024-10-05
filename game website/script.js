let currentGame = null;

function showGame(game) {
    const container = document.getElementById('game-container');
    container.innerHTML = ''; // Clear previous game
    container.style.display = 'block'; // Show game container

    if (game === 'snake') {
        startSnakeGame(container);
    } else if (game === 'tic-tac-toe') {
        startTicTacToe(container);
    } else if (game === 'car-race') {
        startCarRace(container);
    }
}

// Snake Game
function startSnakeGame(container) {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let snake = [{ x: 10, y: 10 }];
    let direction = { x: 1, y: 0 };
    let food = { x: 5, y: 5 };

    document.addEventListener('keydown', changeDirection);
    setInterval(gameLoop, 100);

    function gameLoop() {
        moveSnake();
        draw();
    }

    function moveSnake() {
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            food = { x: Math.floor(Math.random() * (canvas.width / 10)), y: Math.floor(Math.random() * (canvas.height / 10)) };
        } else {
            snake.pop();
        }
    }

    function changeDirection(event) {
        if (event.key === 'ArrowUp') direction = { x: 0, y: -1 };
        else if (event.key === 'ArrowDown') direction = { x: 0, y: 1 };
        else if (event.key === 'ArrowLeft') direction = { x: -1, y: 0 };
        else if (event.key === 'ArrowRight') direction = { x: 1, y: 0 };
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'green';
        snake.forEach(segment => ctx.fillRect(segment.x * 10, segment.y * 10, 10, 10));
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * 10, food.y * 10, 10, 10);
    }
}

// Tic Tac Toe Game
function startTicTacToe(container) {
    const board = document.createElement('div');
    board.className = 'tic-tac-toe-board';
    container.appendChild(board);
    let currentPlayer = 'X';
    const cells = Array(9).fill(null);

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'tic-tac-toe-cell';
        cell.addEventListener('click', () => makeMove(i));
        board.appendChild(cell);
    }

    function makeMove(index) {
        if (!cells[index]) {
            cells[index] = currentPlayer;
            updateBoard();
            if (checkWinner()) {
                setTimeout(() => alert(currentPlayer + ' wins!'), 100);
                resetGame();
            } else if (cells.every(cell => cell)) {
                setTimeout(() => alert('It\'s a draw!'), 100);
                resetGame();
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            }
        }
    }

    function updateBoard() {
        const cellElements = board.children;
        for (let i = 0; i < cells.length; i++) {
            cellElements[i].textContent = cells[i];
        }
    }

    function checkWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return winningCombinations.some(combination => {
            const [a, b, c] = combination;
            return cells[a] && cells[a] === cells[b] && cells[a] === cells[c];
        });
    }

    function resetGame() {
        cells.fill(null);
        currentPlayer = 'X';
        updateBoard();
    }
}

// Car Race Game
function startCarRace(container) {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 600;
    canvas.className = 'car-race-canvas';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let car = { x: 180, y: 500 };
    let obstacles = [];
    let score = 0;

    document.addEventListener('keydown', moveCar);
    setInterval(gameLoop, 100);

    function gameLoop() {
        if (Math.random() < 0.1) {
            createObstacle();
        }
        moveObstacles();
        if (checkCollision()) {
            alert('Game Over! Score: ' + score);
            resetGame();
        }
        draw();
    }

    function createObstacle() {
        const x = Math.floor(Math.random() * (canvas.width - 50));
        obstacles.push({ x: x, y: 0 });
    }

    function moveObstacles() {
        for (let i = 0; i < obstacles.length; i++) {
            obstacles[i].y += 5;
            if (obstacles[i].y > canvas.height) {
                obstacles.splice(i, 1);
                score++;
                i--;
            }
        }
    }

    function moveCar(event) {
        if (event.key === 'ArrowLeft' && car.x > 0) {
            car.x -= 15;
        } else if (event.key === 'ArrowRight' && car.x < canvas.width - 50) {
            car.x += 15;
        }
    }

    function checkCollision() {
        return obstacles.some(obstacle => {
            return car.x < obstacle.x + 50 && car.x + 50 > obstacle.x && car.y < obstacle.y + 20 && car.y + 50 > obstacle.y;
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'blue';
        ctx.fillRect(car.x, car.y, 50, 50);
        ctx.fillStyle = 'red';
        obstacles.forEach(obstacle => ctx.fillRect(obstacle.x, obstacle.y, 50, 20));
        ctx.fillStyle = 'black';
        ctx.fillText('Score: ' + score, 10, 20);
    }

    function resetGame() {
        car.x = 180;
        obstacles = [];
        score = 0;
    }
}