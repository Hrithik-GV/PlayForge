import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Game from '../models/game.model.js';

// Game templates compiled function
const compileGameCode = (html, css, javascript) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    * {
      box-sizing: border-box;
      user-select: none;
      -webkit-user-select: none;
    }
    body {
      margin: 0;
      padding: 0;
      background: #121212;
      color: #ffffff;
      font-family: system-ui, -apple-system, sans-serif;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      width: 100vw;
    }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    ${javascript}
  </script>
</body>
</html>`;
};

const fallbackGames = [
  {
    title: 'Retro Snake',
    description: 'Control the snake and eat the red food. Don\'t crash into the walls or yourself! Use keyboard arrows or swipe on mobile to play.',
    html: `
      <div id="gameUi" style="position: absolute; top: 10px; font-family: monospace; font-size: 20px; z-index: 10;">Score: <span id="scoreVal">0</span></div>
      <canvas id="gameCanvas" width="400" height="400" style="border: 2px solid #333; background: #000; max-width: 90vw; max-height: 90vw;"></canvas>
      <div id="controls" style="display: flex; margin-top: 15px; gap: 10px;">
        <button id="btnLeft" style="padding: 15px; font-size: 18px; background: #333; color: #fff; border: none; border-radius: 5px;">◀</button>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <button id="btnUp" style="padding: 15px; font-size: 18px; background: #333; color: #fff; border: none; border-radius: 5px;">▲</button>
          <button id="btnDown" style="padding: 15px; font-size: 18px; background: #333; color: #fff; border: none; border-radius: 5px;">▼</button>
        </div>
        <button id="btnRight" style="padding: 15px; font-size: 18px; background: #333; color: #fff; border: none; border-radius: 5px;">▶</button>
      </div>
    `,
    css: `
      #gameCanvas {
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.2);
      }
      button {
        width: 60px;
        height: 60px;
        cursor: pointer;
      }
      button:active {
        background: #555 !important;
      }
    `,
    javascript: `
      const canvas = document.getElementById('gameCanvas');
      const ctx = canvas.getContext('2d');
      const scoreVal = document.getElementById('scoreVal');
      
      const grid = 20;
      let count = 0;
      let score = 0;
      
      let snake = {
        x: 160,
        y: 160,
        dx: grid,
        dy: 0,
        cells: [],
        maxCells: 4
      };
      
      let apple = {
        x: 320,
        y: 320
      };
      
      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      }
      
      function loop() {
        requestAnimationFrame(loop);
        if (++count < 6) { return; }
        count = 0;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        
        snake.x += snake.dx;
        snake.y += snake.dy;
        
        if (snake.x < 0) snake.x = canvas.width - grid;
        else if (snake.x >= canvas.width) snake.x = 0;
        
        if (snake.y < 0) snake.y = canvas.height - grid;
        else if (snake.y >= canvas.height) snake.y = 0;
        
        snake.cells.unshift({x: snake.x, y: snake.y});
        if (snake.cells.length > snake.maxCells) {
          snake.cells.pop();
        }
        
        // draw apple
        ctx.fillStyle = '#ff0055';
        ctx.fillRect(apple.x, apple.y, grid-1, grid-1);
        
        // draw snake
        ctx.fillStyle = '#00ff66';
        snake.cells.forEach(function(cell, index) {
          ctx.fillRect(cell.x, cell.y, grid-1, grid-1);  
          if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            score += 10;
            scoreVal.textContent = score;
            apple.x = getRandomInt(0, 20) * grid;
            apple.y = getRandomInt(0, 20) * grid;
          }
          for (let i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
              snake.x = 160;
              snake.y = 160;
              snake.cells = [];
              snake.maxCells = 4;
              snake.dx = grid;
              snake.dy = 0;
              score = 0;
              scoreVal.textContent = score;
              apple.x = getRandomInt(0, 20) * grid;
              apple.y = getRandomInt(0, 20) * grid;
            }
          }
        });
      }
      
      document.addEventListener('keydown', function(e) {
        if (e.which === 37 && snake.dx === 0) { snake.dx = -grid; snake.dy = 0; }
        else if (e.which === 38 && snake.dy === 0) { snake.dy = -grid; snake.dx = 0; }
        else if (e.which === 39 && snake.dx === 0) { snake.dx = grid; snake.dy = 0; }
        else if (e.which === 40 && snake.dy === 0) { snake.dy = grid; snake.dx = 0; }
      });
      
      document.getElementById('btnLeft').addEventListener('click', () => { if (snake.dx === 0) { snake.dx = -grid; snake.dy = 0; } });
      document.getElementById('btnRight').addEventListener('click', () => { if (snake.dx === 0) { snake.dx = grid; snake.dy = 0; } });
      document.getElementById('btnUp').addEventListener('click', () => { if (snake.dy === 0) { snake.dy = -grid; snake.dx = 0; } });
      document.getElementById('btnDown').addEventListener('click', () => { if (snake.dy === 0) { snake.dy = grid; snake.dx = 0; } });
      
      requestAnimationFrame(loop);
    `
  },
  {
    title: 'Brick Breaker Classic',
    description: 'Bounce the ball and break all the bricks. Don\'t let the ball fall past your paddle! Slide to move paddle or use Left/Right keys.',
    html: `
      <div id="gameUi" style="position: absolute; top: 10px; font-family: monospace; font-size: 20px;">Bricks Left: <span id="brickCount">15</span></div>
      <canvas id="gameCanvas" width="360" height="400" style="border: 2px solid #444; background: #111; max-width: 90vw; max-height: 90vw;"></canvas>
      <div style="font-family: monospace; margin-top: 10px; color: #888;">Drag Canvas to Move Paddle</div>
    `,
    css: `
      #gameCanvas {
        touch-action: none;
      }
    `,
    javascript: `
      const canvas = document.getElementById('gameCanvas');
      const ctx = canvas.getContext('2d');
      const brickCountEl = document.getElementById('brickCount');
      
      let paddle = { x: 140, y: 380, width: 80, height: 10, speed: 8 };
      let ball = { x: 180, y: 300, dx: 3, dy: -3, radius: 6 };
      
      let bricks = [];
      const rows = 3;
      const cols = 5;
      const brickWidth = 60;
      const brickHeight = 15;
      const brickPadding = 8;
      const brickOffsetTop = 50;
      const brickOffsetLeft = 15;
      
      for(let c=0; c<cols; c++) {
        bricks[c] = [];
        for(let r=0; r<rows; r++) {
          bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
      }
      
      let activeBricks = rows * cols;
      brickCountEl.textContent = activeBricks;
      
      function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
        ctx.fillStyle = "#ffaa00";
        ctx.fill();
        ctx.closePath();
      }
      
      function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
        ctx.fillStyle = "#00aaff";
        ctx.fill();
        ctx.closePath();
      }
      
      function drawBricks() {
        for(let c=0; c<cols; c++) {
          for(let r=0; r<rows; r++) {
            if(bricks[c][r].status === 1) {
              let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
              let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
              bricks[c][r].x = brickX;
              bricks[c][r].y = brickY;
              ctx.beginPath();
              ctx.rect(brickX, brickY, brickWidth, brickHeight);
              ctx.fillStyle = r === 0 ? "#ff4444" : r === 1 ? "#ffaa00" : "#aaff00";
              ctx.fill();
              ctx.closePath();
            }
          }
        }
      }
      
      function collisionDetection() {
        for(let c=0; c<cols; c++) {
          for(let r=0; r<rows; r++) {
            let b = bricks[c][r];
            if(b.status === 1) {
              if(ball.x > b.x && ball.x < b.x+brickWidth && ball.y > b.y && ball.y < b.y+brickHeight) {
                ball.dy = -ball.dy;
                b.status = 0;
                activeBricks--;
                brickCountEl.textContent = activeBricks;
                if(activeBricks === 0) {
                  alert("You Win!");
                  document.location.reload();
                }
              }
            }
          }
        }
      }
      
      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        collisionDetection();
        
        if(ball.x + ball.dx > canvas.width-ball.radius || ball.x + ball.dx < ball.radius) {
          ball.dx = -ball.dx;
        }
        if(ball.y + ball.dy < ball.radius) {
          ball.dy = -ball.dy;
        } else if(ball.y + ball.dy > canvas.height-ball.radius) {
          if(ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.dy = -ball.dy;
          } else {
            // reset ball
            ball.x = 180;
            ball.y = 300;
            ball.dx = 3;
            ball.dy = -3;
          }
        }
        
        ball.x += ball.dx;
        ball.y += ball.dy;
        requestAnimationFrame(draw);
      }
      
      // Keyboard input
      let rightPressed = false;
      let leftPressed = false;
      document.addEventListener("keydown", (e) => {
        if(e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
        else if(e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
      });
      document.addEventListener("keyup", (e) => {
        if(e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
        else if(e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
      });
      
      // Touch/mouse drag input
      function movePaddle(clientX) {
        const rect = canvas.getBoundingClientRect();
        const root = document.documentElement;
        const relativeX = clientX - rect.left - paddle.width/2;
        if(relativeX > 0 && relativeX < canvas.width - paddle.width) {
          paddle.x = relativeX;
        }
      }
      
      canvas.addEventListener('touchmove', (e) => {
        movePaddle(e.touches[0].clientX);
      });
      canvas.addEventListener('mousemove', (e) => {
        if(e.buttons > 0) movePaddle(e.clientX);
      });
      
      draw();
    `
  },
  {
    title: 'Space Shooter Blockbuster',
    description: 'Destroy descending blocks before they hit you! Drag to move side to side. Shoots automatically.',
    html: `
      <div id="gameUi" style="position: absolute; top: 10px; font-family: monospace; font-size: 20px;">Score: <span id="scoreVal">0</span></div>
      <canvas id="gameCanvas" width="360" height="420" style="border: 2px solid #555; background: #0b0b1a; max-width: 90vw; max-height: 90vw;"></canvas>
    `,
    css: `
      #gameCanvas {
        touch-action: none;
      }
    `,
    javascript: `
      const canvas = document.getElementById('gameCanvas');
      const ctx = canvas.getContext('2d');
      const scoreVal = document.getElementById('scoreVal');
      
      let player = { x: 160, y: 380, width: 40, height: 20 };
      let bullets = [];
      let enemies = [];
      let score = 0;
      let frameCount = 0;
      
      function spawnEnemy() {
        const size = 30;
        const x = Math.random() * (canvas.width - size);
        enemies.push({ x, y: 0, size, speed: 1.5 });
      }
      
      function loop() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        
        // draw player
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(player.x, player.y, player.width, player.height);
        
        // bullets
        if (frameCount % 10 === 0) {
          bullets.push({ x: player.x + player.width/2 - 2, y: player.y, width: 4, height: 10, speed: 6 });
        }
        
        // draw bullets
        ctx.fillStyle = '#ffff00';
        bullets.forEach((b, i) => {
          b.y -= b.speed;
          ctx.fillRect(b.x, b.y, b.width, b.height);
          if (b.y < 0) bullets.splice(i, 1);
        });
        
        // spawn enemy
        if (frameCount % 60 === 0) {
          spawnEnemy();
        }
        
        // draw enemies
        ctx.fillStyle = '#ff3333';
        enemies.forEach((e, i) => {
          e.y += e.speed;
          ctx.fillRect(e.x, e.y, e.size, e.size);
          
          if (e.y + e.size > canvas.height) {
            score = Math.max(0, score - 5);
            scoreVal.textContent = score;
            enemies.splice(i, 1);
          }
          
          // collision with bullet
          bullets.forEach((b, bi) => {
            if (b.x > e.x && b.x < e.x + e.size && b.y > e.y && b.y < e.y + e.size) {
              enemies.splice(i, 1);
              bullets.splice(bi, 1);
              score += 10;
              scoreVal.textContent = score;
            }
          });
        });
        
        frameCount++;
        requestAnimationFrame(loop);
      }
      
      canvas.addEventListener('touchmove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const touchX = e.touches[0].clientX - rect.left - player.width/2;
        player.x = Math.max(0, Math.min(canvas.width - player.width, touchX));
      });
      
      canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left - player.width/2;
        player.x = Math.max(0, Math.min(canvas.width - player.width, mouseX));
      });
      
      loop();
    `
  },
  {
    title: 'Bubble Pop Blast',
    description: 'Pop as many bubbles as you can before they float away! Click or tap on bubbles to score.',
    html: `
      <div id="gameUi" style="position: absolute; top: 10px; font-family: monospace; font-size: 20px;">Score: <span id="scoreVal">0</span></div>
      <canvas id="gameCanvas" width="360" height="420" style="border: 2px solid #555; background: #000; max-width: 90vw; max-height: 90vw;"></canvas>
    `,
    css: `
      #gameCanvas {
        touch-action: none;
      }
    `,
    javascript: `
      const canvas = document.getElementById('gameCanvas');
      const ctx = canvas.getContext('2d');
      const scoreVal = document.getElementById('scoreVal');
      
      let bubbles = [];
      let score = 0;
      let frameCount = 0;
      
      function spawnBubble() {
        const radius = Math.random() * 20 + 15;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const speed = Math.random() * 2 + 1;
        bubbles.push({ x, y: canvas.height + radius, radius, speed, color: 'hsl(' + Math.random()*360 + ', 80%, 60%)' });
      }
      
      function checkPop(clientX, clientY) {
        const rect = canvas.getBoundingClientRect();
        const clickX = clientX - rect.left;
        const clickY = clientY - rect.top;
        
        bubbles.forEach((b, i) => {
          const dist = Math.hypot(b.x - clickX, b.y - clickY);
          if (dist < b.radius) {
            bubbles.splice(i, 1);
            score += 15;
            scoreVal.textContent = score;
          }
        });
      }
      
      function loop() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        
        if (frameCount % 45 === 0) spawnBubble();
        
        bubbles.forEach((b, i) => {
          b.y -= b.speed;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI*2);
          ctx.fillStyle = b.color;
          ctx.globalAlpha = 0.6;
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();
          ctx.globalAlpha = 1.0;
          ctx.closePath();
          
          if (b.y + b.radius < 0) bubbles.splice(i, 1);
        });
        
        frameCount++;
        requestAnimationFrame(loop);
      }
      
      canvas.addEventListener('touchstart', (e) => {
        checkPop(e.touches[0].clientX, e.touches[0].clientY);
      });
      canvas.addEventListener('mousedown', (e) => {
        checkPop(e.clientX, e.clientY);
      });
      
      loop();
    `
  },
  {
    title: 'Retro Pong',
    description: 'Keep the ball bouncing off your paddle. Move your paddle side to side using keyboard left/right keys or dragging on screen.',
    html: `
      <div id="gameUi" style="position: absolute; top: 10px; font-family: monospace; font-size: 20px;">Score: <span id="scoreVal">0</span></div>
      <canvas id="gameCanvas" width="360" height="400" style="border: 2px solid #555; background: #111; max-width: 90vw; max-height: 90vw;"></canvas>
    `,
    css: `
      #gameCanvas {
        touch-action: none;
      }
    `,
    javascript: `
      const canvas = document.getElementById('gameCanvas');
      const ctx = canvas.getContext('2d');
      const scoreVal = document.getElementById('scoreVal');
      
      let paddle = { x: 140, y: 380, width: 80, height: 10 };
      let ball = { x: 180, y: 200, dx: 3, dy: 3, radius: 8 };
      let score = 0;
      
      function loop() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        
        // draw paddle
        ctx.fillStyle = '#00ff88';
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        
        // draw ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.closePath();
        
        // physics
        ball.x += ball.dx;
        ball.y += ball.dy;
        
        if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) ball.dx = -ball.dx;
        if (ball.y - ball.radius < 0) ball.dy = -ball.dy;
        
        if (ball.y + ball.radius > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
          ball.dy = -Math.abs(ball.dy) - 0.2; // Speed up slightly
          ball.dx += (Math.random() - 0.5) * 2;
          score++;
          scoreVal.textContent = score;
        } else if (ball.y - ball.radius > canvas.height) {
          // Reset game
          score = 0;
          scoreVal.textContent = score;
          ball.x = 180;
          ball.y = 200;
          ball.dx = 3;
          ball.dy = 3;
        }
        
        requestAnimationFrame(loop);
      }
      
      function move(clientX) {
        const rect = canvas.getBoundingClientRect();
        const relativeX = clientX - rect.left - paddle.width/2;
        paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, relativeX));
      }
      
      canvas.addEventListener('touchmove', (e) => move(e.touches[0].clientX));
      canvas.addEventListener('mousemove', (e) => move(e.clientX));
      
      loop();
    `
  }
];

const seed = async () => {
  try {
    await connectDB();
    
    // Clear out any previous fallback games so we don't duplicate
    console.log('Clearing old fallback games...');
    await Game.deleteMany({ isFallback: true });
    
    console.log('Inserting fallback games...');
    for (const g of fallbackGames) {
      const compiledCode = compileGameCode(g.html, g.css, g.javascript);
      await Game.create({
        title: g.title,
        description: g.description,
        html: g.html,
        css: g.css,
        javascript: g.javascript,
        gameCode: compiledCode,
        isFallback: true,
        prompt: `Fallback seed: ${g.title}`,
        promptHash: `fallback-${g.title.toLowerCase().replace(/\s+/g, '-')}`
      });
      console.log(`- Seeded: ${g.title}`);
    }
    
    console.log('✅ Seeding fallbacks completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();
