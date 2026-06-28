# physics-simulation

2D elastic collision playground. Add balls, mess with gravity, watch them bounce.

## Physics

Collision detection is circle-to-circle. On collision, velocities are exchanged using the elastic collision formula — heavier balls push lighter ones further. Wall collisions use simple reflection (`vx = -vx`, `vy = -vy`).

Gravity is constant downward acceleration applied every frame. You can crank it up until everything hits the floor immediately, which is educational in a bleak sort of way.

## Features

- Click anywhere to spawn a ball (random mass, random velocity)
- Gravity slider (0 = zero-g, 1 = Earth, higher = chaos)
- Restitution (bounciness) coefficient — 1.0 is perfectly elastic, 0 means balls hit the floor and stop
- Velocity vectors toggle
- FPS counter
- Pause / reset

## Run

```bash
npm install
npm run dev
```

## Notes

No spatial partitioning — collision checks are O(n²). Runs fine up to ~100 balls. Above that, frame rate will drop. Quadtree or spatial hashing would fix it; not worth the complexity for a demo.