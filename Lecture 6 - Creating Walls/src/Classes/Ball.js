import canvas from "./Canvas";
import Vector from "./Vector";

class Ball {
  acceleration = new Vector(0, 0);
  moving = {
    up: false,
    down: false,
    right: false,
    left: false,
  };

  constructor({
    pos = new Vector(0, 0),
    radius = 100,
    color = "red",
    controls = false,
    drawVectors = false,
    mass = 1,
    elasticity = 1,
    friction = 0.03,
  }) {
    // Vectors
    this.pos = pos;
    this.vel = new Vector(0, 0);
    this.acc = new Vector(0, 0);

    // Scalars
    this.radius = radius;
    this.color = color;
    this.friction = friction;
    this.mass = mass;
    this.inverseMass = mass > 0 ? 1 / mass : 0;
    this.elasticity = elasticity;

    this.controls = controls;
    this.drawVectors = drawVectors;

    if (this.controls) {
      this.controlMovement();
    }
  }

  draw() {
    canvas.ctx.beginPath();
    canvas.ctx.arc(
      this.pos.x,
      canvas.toCanvasY(this.pos.y),
      this.radius,
      0,
      2 * Math.PI
    );
    canvas.ctx.strokeStyle = this.color;
    canvas.ctx.stroke();
    // canvas.ctx.fillStyle = this.color;
    // canvas.ctx.fill();

    if (this.drawVectors) {
      this.drawVectors();
    }
  }

  drawVectors() {
    this.vel
      .unit()
      .multiply(2 * this.radius)
      .draw(this.pos.x, this.pos.y, "blue");
    this.acc.unit().multiply(this.radius).draw(this.pos.x, this.pos.y, "red");
  }

  reposition() {
    this.acc = this.acceleration;
    this.vel = this.vel.add(this.acc).multiply(1 - this.friction);
    this.pos = this.pos.add(this.vel);
  }

  controlMovement() {
    const events = ["keydown", "keyup"];

    const magnitude = 0.4;
    const direction = new Vector(0, 0);

    events.forEach((event) => {
      window.addEventListener(event, (e) => {
        if (e.key === "w") {
          this.moving.up = e.type === "keydown" ? true : false;
        }
        if (e.key === "s") {
          this.moving.down = e.type === "keydown" ? true : false;
        }
        if (e.key === "d") {
          this.moving.right = e.type === "keydown" ? true : false;
        }
        if (e.key === "a") {
          this.moving.left = e.type === "keydown" ? true : false;
        }

        if (this.moving.up) {
          direction.y = 1;
        }
        if (this.moving.down) {
          direction.y = -1;
        }
        if (this.moving.right) {
          direction.x = 1;
        }
        if (this.moving.left) {
          direction.x = -1;
        }

        if (!this.moving.up && !this.moving.down) {
          direction.y = 0;
        }

        if (!this.moving.right && !this.moving.left) {
          direction.x = 0;
        }

        this.acceleration = direction.unit().multiply(magnitude);
      });
    });
  }

  isPenetratingBall(ball) {
    return this.radius + ball.radius >= ball.pos.subtract(this.pos).magnitude();
  }

  resolveBallPenetration(ball) {
    // Distance between center of the balls
    const distance = this.pos.subtract(ball.pos);

    // Depth of penetration
    let penetrationDepth = 0;

    penetrationDepth += this.radius + ball.radius - distance.magnitude();

    const velocityMagnitudeAlongDistance =
      distance.dot(this.vel) / distance.magnitude();

    const velocityAlongDistance = distance
      .unit()
      .multiply(velocityMagnitudeAlongDistance);

    penetrationDepth += velocityAlongDistance.magnitude() / 2;

    // Penetration Resolution
    const penetrationResolution = distance
      .unit()
      .multiply(penetrationDepth / (this.inverseMass + ball.inverseMass));

    // Apply resolution onto the balls
    this.pos = this.pos.add(penetrationResolution.multiply(this.inverseMass));
    ball.pos = ball.pos.add(penetrationResolution.multiply(-ball.inverseMass));
  }

  resolveBallCollision(ball) {
    // Unit normal vetor of collision tangent
    const normal = this.pos.subtract(ball.pos).unit();

    // Relative of ball 2 to ball 1
    const relativeVelocity = this.vel.subtract(ball.vel);

    // Relative velocity along unit normal
    const separatingVelocity = relativeVelocity.dot(normal);
    const newSeparatingVelocity =
      -separatingVelocity * Math.min(this.elasticity, ball.elasticity);

    // Calculate impulse
    const separatingVelocityDifference =
      newSeparatingVelocity - separatingVelocity;
    const impulse =
      separatingVelocityDifference / (this.inverseMass + ball.inverseMass);
    const impulseVector = normal.multiply(impulse);

    // Apply collision respond to balls
    this.vel = this.vel.add(impulseVector.multiply(this.inverseMass));
    ball.vel = ball.vel.add(impulseVector.multiply(-ball.inverseMass));
  }

  closestPointToWall(wall) {
    // Case 1: If ball is closer to start of wall
    const ballToWallStart = wall.start.subtract(this.pos);
    if (wall.unit().dot(ballToWallStart) < 0) {
      return wall.start;
    }

    // Case 2: If ball is closer to end of wall
    const ballToWallEnd = wall.end.subtract(this.pos);
    if (wall.unit().dot(ballToWallEnd) > 0) {
      return wall.end;
    }

    // Case 3: If ball is closer to path of wall
    const closestDistance = wall.unit().dot(ballToWallStart);
    const closestDistanceVector = wall.unit().multiply(closestDistance);
    return wall.start.subtract(closestDistanceVector);
  }

  isPenetratingWall(wall) {
    const ballToClosestPoint = this.closestPointToWall(wall).subtract(this.pos);

    return ballToClosestPoint.magnitude() <= this.radius;
  }

  resolveWallPenetration(wall) {
    const penetrationVector = this.pos.subtract(this.closestPointToWall(wall));

    this.pos = this.pos
      .add(
        penetrationVector
          .unit()
          .multiply(this.radius - penetrationVector.magnitude())
      )
      .subtract(this.vel);
  }

  resolveWallCollision(wall) {
    const normal = this.pos.subtract(this.closestPointToWall(wall)).unit();

    const separatingVelocity = this.vel.dot(normal);
    const newSeparatingVelocity = -separatingVelocity * wall.elasticity;
    const separatingVelocityDifference =
      newSeparatingVelocity - separatingVelocity;

    this.vel = this.vel.add(normal.multiply(separatingVelocityDifference));
  }
}

// const closestPoint = wall.start.subtract(closestDistanceVector);
// const closestPointVector = closestPoint.subtract(this.pos);

export default Ball;
