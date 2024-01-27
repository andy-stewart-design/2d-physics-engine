import Ball from "./Classes/Ball";
import canvas from "./Classes/Canvas";
import Vector from "./Classes/Vector";
import Wall from "./Classes/Wall";

const main = () => {
  const ball1 = new Ball({
    pos: new Vector(
      canvas.element.clientWidth / 2,
      canvas.element.clientHeight / 2
    ),
    radius: 50,
    mass: 10,
    color: "red",
    controls: true,
  });
  const ball2 = new Ball({
    pos: new Vector(
      canvas.element.clientWidth / 2 + 300,
      canvas.element.clientHeight / 2
    ),
    radius: 50,
    mass: 0,
    color: "black",
  });

  const balls = [ball1, ball2];

  const wall1 = new Wall({
    start: new Vector(
      canvas.element.clientWidth / 2,
      canvas.element.clientHeight / 2
    ),
    end: new Vector(
      canvas.element.clientWidth / 2 + 300,
      canvas.element.clientHeight / 2
    ),
    elasticity: 4,
    color: "blue",
  });

  // Create canvas bounds
  const bounds = [];
  const edges = [
    new Vector(0, 0),
    new Vector(0, canvas.element.clientHeight),
    new Vector(canvas.element.clientWidth, canvas.element.clientHeight),
    new Vector(canvas.element.clientWidth, 0),
  ];
  for (let i = 0; i <= 3; i++) {
    const bound = new Wall({
      start: edges[i],
      end: edges[(i + 1) % edges.length],
    });

    bounds.push(bound);
  }

  const walls = [wall1, ...bounds];

  const mainLoop = () => {
    // Clear Canvas for next frame
    canvas.clear();

    // Render walls
    walls.forEach((wall, i) => {
      wall.draw();
    });

    // Render balls
    balls.forEach((ball1, i) => {
      // Draw ball
      ball1.draw();
      ball1.reposition();

      // Check if penetrating any other balls
      balls.forEach((ball2, j) => {
        if (i === j) return;

        const isPenetratingBall = ball1.isPenetratingBall(ball2);
        if (isPenetratingBall) {
          ball1.resolveBallPenetration(ball2);
          ball1.resolveBallCollision(ball2);
        }
      });

      // Check if penetrating any walls
      walls.forEach((wall, i) => {
        const isPenetratingWall = ball1.isPenetratingWall(wall);
        if (isPenetratingWall) {
          ball1.resolveWallPenetration(wall);
          ball1.resolveWallCollision(wall);
        }
      });
    });

    requestAnimationFrame(mainLoop);
  };

  requestAnimationFrame(mainLoop);
};
main();
