window.onload = function () {
    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");
    var colorTheme = "#000080";

    // bricks variables
    var brickRowCount = 3;
    var brickColumnCount = 7;
    var brickWidth = 70;
    var brickHeight = 15;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 20;
    var maxBricks = brickRowCount * brickColumnCount;
    var destoryedBricks = 0;
    var bricks = [];

    // ball variables
    var ballRadius = 10;
    var x = canvas.width / 2;
    var y = canvas.height - 30;
    var dx = 2;
    var dy = -2;
    var speedFactor = 0.2;

    // paddle variables
    var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (canvas.width - paddleWidth) / 2;
    var rightPressed = false;
    var leftPressed = false;
    var rightCursor = 39;
    var leftCursor = 37;
    var paddleMoveFactor = 7;

    var lives = 3;
    var lostLiveFactor = 5;
    var score = 0;

    // initialize bricks array
    for (c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (r = 0; r < brickRowCount; r++) {
            bricks[c][r] = {
                x: 0,
                y: 0,
                status: 1
            };
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = colorTheme;
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = colorTheme;
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (c = 0; c < brickColumnCount; c++) {
            for (r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == 1) {
                    var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = colorTheme;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function drawLives() {
        ctx.font = "16px Arial";
        ctx.fillStyle = colorTheme;
        ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
    }

    function collisionDetection() {
        for (c = 0; c < brickColumnCount; c++) {
            for (r = 0; r < brickRowCount; r++) {
                var b = bricks[c][r];
                if (b.status == 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        destoryedBricks++;
                        dx = dx < 0 ? dx - speedFactor : dx + speedFactor;
                        dy = dy < 0 ? dy - speedFactor : dy + speedFactor;

                        if (destoryedBricks == brickRowCount * brickColumnCount) {
                            alert("YOU WIN, CONGRATULATIONS!");
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }

    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = colorTheme;
        ctx.fillText("Score: " + score, 8, 20);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawScore();
        drawLives();
        drawPaddle();
        collisionDetection();

        x += dx;
        console.log(x);
        y += dy;

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }

        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                lives--;
                score = score - lostLiveFactor;
                if (!lives) {
                    alert("GAME OVER");
                    document.location.reload();
                } else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    dy = -dy;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += paddleMoveFactor;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= paddleMoveFactor;
        }

        requestAnimationFrame(draw);
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    function keyDownHandler(e) {
        if (e.keyCode == rightCursor) {
            rightPressed = true;
        } else if (e.keyCode == leftCursor) {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.keyCode == rightCursor) {
            rightPressed = false;
        } else if (e.keyCode == leftCursor) {
            leftPressed = false;
        }
    }

    function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX >= paddleWidth / 2 && relativeX <= canvas.width - (paddleWidth / 2)) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }

    draw();
}
