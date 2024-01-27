import Ball from "./Classes/Ball";
import canvas from "./Classes/Canvas";
import Fractal from "./Classes/Fractal";
import Vector from "./Classes/Vector";
import Wall from "./Classes/Wall";

const main = () => {
  const balls = [];
  const walls = [];

  const fractal = new Fractal({
    layers: 12,
    pos: new Vector(
      canvas.element.clientWidth / 2,
      canvas.element.clientHeight / 2 - 300
    ),
  });

  const mainLoop = () => {
    // Clear Canvas for next frame
    canvas.clear();

    fractal.draw();

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
