/**
 * 粒子效果管理器
 * 用于创建通关粒子、灰尘效果等
 */
import { Container, Graphics } from 'pixi.js';

export type ParticleConfig = {
  count: number;
  color: number;
  size: { min: number; max: number };
  speed: { min: number; max: number };
  lifetime: { min: number; max: number };
  spread: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  graphic: Graphics;
};

export class ParticleSystem {
  private container: Container;
  private particles: Particle[] = [];
  private config: ParticleConfig;
  private active = false;

  constructor(container: Container, config: ParticleConfig) {
    this.container = container;
    this.config = config;
  }

  emit(x: number, y: number) {
    for (let i = 0; i < this.config.count; i++) {
      const size = this.randomRange(this.config.size.min, this.config.size.max);
      const angle = Math.random() * Math.PI * 2;
      const speed = this.randomRange(this.config.speed.min, this.config.speed.max);
      const life = this.randomRange(this.config.lifetime.min, this.config.lifetime.max);

      const graphic = new Graphics();
      graphic.circle(0, 0, size);
      graphic.fill(this.config.color);

      const particle: Particle = {
        x: x + (Math.random() - 0.5) * this.config.spread,
        y: y + (Math.random() - 0.5) * this.config.spread,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - speed * 0.5,
        life,
        maxLife: life,
        size,
        graphic,
      };

      this.particles.push(particle);
      this.container.addChild(graphic);
    }

    this.active = true;
  }

  update() {
    if (!this.active) return;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      if (!p) continue;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02;
      p.life -= 1;

      p.graphic.x = p.x;
      p.graphic.y = p.y;
      p.graphic.alpha = p.life / p.maxLife;

      if (p.life <= 0) {
        this.container.removeChild(p.graphic);
        p.graphic.destroy();
        this.particles.splice(i, 1);
      }
    }

    if (this.particles.length === 0) {
      this.active = false;
    }
  }

  clear() {
    this.particles.forEach((p) => {
      this.container.removeChild(p.graphic);
      p.graphic.destroy();
    });
    this.particles = [];
    this.active = false;
  }

  private randomRange(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }
}

/**
 * 创建通关粒子效果
 */
export function createVictoryParticles(container: Container): ParticleSystem {
  return new ParticleSystem(container, {
    count: 30,
    color: 0xe6d4b4,
    size: { min: 2, max: 5 },
    speed: { min: 1, max: 3 },
    lifetime: { min: 60, max: 120 },
    spread: 100,
  });
}

/**
 * 创建灰尘粒子效果
 */
export function createDustParticles(container: Container): ParticleSystem {
  return new ParticleSystem(container, {
    count: 5,
    color: 0x616c80,
    size: { min: 1, max: 3 },
    speed: { min: 0.2, max: 0.5 },
    lifetime: { min: 100, max: 200 },
    spread: 50,
  });
}