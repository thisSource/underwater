import React, { useState } from "react";
import dynamic from "next/dynamic";

// Will only import `react-p5` on client-side
const Sketch = dynamic(
  () =>
    import("react-p5").then((mod) => {
      require("p5/lib/addons/p5.sound");
      return mod.default;
    }),
  {
    ssr: false,
  }
);

let mySound;

let bubbels = [];
let background;

let yOff = 0;

let particle = [];
let gravity;
let amplitude;

const setup = (p5, canvasParentRef) => {
  p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
  background = new Background(p5);
  amplitude = new window.p5.Amplitude();
  gravity = p5.createVector(0.03, 0.05);

  setUpBubble(p5);
};

const draw = (p5) => {
  background.show(p5);
  let level = amplitude.getLevel();
  setUpParticles(p5);
  showSurf(p5, level / 20);
  runBubble(p5);
};

const mouseMoved = (p5) => {
  runParticle(p5);
};

const touchMoved = (p5) => {
  runParticle(p5);
};
const preload = (p5) => {
  p5.soundFormats("mp3", "ogg", "wav");
  mySound = p5.loadSound("audio/Vatten.mp3");
};

const Underwater = () => {
  let [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (mySound.isPlaying()) {
      mySound.pause();
      setIsPlaying(false);
    } else {
      mySound.play();
      setIsPlaying(true);
    }
  };

  const styles = {
    positionCenter:
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform",
    title:
      "font-Salty text-7xl sm:text-8xl text-center text-yellow-500 drop-shadow-[0_15px_35px_rgba(255,255,255)] lg:text-12xl lg:opacity-100",
    subTitle:
      "font-Salty text-3xl text-center text-yellow-500 drop-shadow-[0_15px_35px_rgba(255,255,255)] lg:text-5xl lg:opacity-100",
    buttonText:
      "font-Salty text-2xl text-yellow-500 drop-shadow-[0_15px_35px_rgba(0,255,0)] sm:hover:text-gray-300 lg:text-4xl",
  };

  return (
    <div>
      <div className={styles.positionCenter}>
        <p className={styles.title}>Tjärö</p>
        <p className={styles.subTitle}>PLX 2022</p>
      </div>

      <div className="absolute bottom-10 w-full px-5">
        <div className="flex justify-between">
          <button className={styles.buttonText} onClick={togglePlay}>
            {isPlaying ? "Pause audio" : "Play audio"}
          </button>
          <a
            href="https://billetto.se/e/plx-tjaro-2022-biljetter-602287"
            target="_blank"
            className={styles.buttonText}
            rel="noopener noreferrer"
          >
            Tickets
          </a>
        </div>
      </div>
      <Sketch
        preload={preload}
        mouseMoved={mouseMoved}
        touchMoved={touchMoved}
        setup={setup}
        draw={draw}
      />
    </div>
  );
};

export default Underwater;

//The bubbles around the cursor
function setUpParticles(p5) {
  gravity = p5.createVector(p5.random(-0.01, 0.01), -0.01);

  for (let i = 0; i < particle.length; i++) {
    particle[i].applyForce(gravity);
    particle[i].update();
    particle[i].show(p5);
  }

  for (let i = particle.length - 1; i >= 0; i--) {
    if (particle[i].finished()) {
      particle.splice(i, 1);
    }
  }
}

function runParticle(p5) {
  for (let i = 0; i < 1; i++) {
    particle.push(new Particle(p5, p5.mouseX, p5.mouseY, p5.random(5)));
  }
}

class Particle {
  constructor(p5, xPos, yPos, r) {
    this.pos = p5.createVector(xPos, yPos);
    this.vel = window.p5.Vector.random2D();
    this.vel.mult(1);
    this.acc = p5.createVector(0, 0);
    this.r = r;
    this.lifetime = 355;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  finished() {
    return this.lifetime < 0;
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);

    this.lifetime -= 3;
  }

  edges(p5) {
    if (this.pos.x > p5.width - this.r || this.pos.x < 0 + this.r) {
      this.vel.x *= -1;
    }
    if (this.pos.y > p5.height - this.r || this.pos.y + this.r < 100) {
      this.pos.y = 800;
    }
  }

  show(p5) {
    p5.noStroke();
    p5.fill(255, 50);
    p5.ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
}

//Water surface
function showSurf(p5, level) {
  p5.fill(0, 0, 255, 20);
  p5.stroke(30, 100, 255);

  p5.beginShape();
  let xOff = 0;
  for (let x = 0; x <= p5.width + 10; x += 5) {
    let y = p5.map(p5.noise(xOff, yOff), 0, 1, 70, 170);
    p5.vertex(x, y);
    xOff += 0.01 + level;
  }
  yOff += 0.01;

  p5.vertex(p5.width, p5.height);
  p5.vertex(0, p5.height);
  p5.endShape(p5.CLOSE);
}

//Background gradient
class Background {
  constructor(p5) {
    this.c1 = p5.color(250);
    this.c2 = p5.color(63, 100, 255);
  }

  show(p5) {
    for (let y = 0; y < p5.height; y++) {
      let n = p5.map(y, 0, p5.height, 0, 1);
      let newc = p5.lerpColor(this.c1, this.c2, n);
      p5.stroke(newc);
      p5.line(0, y, p5.width, y);
    }
  }
}

//The bubbles
function setUpBubble(p5) {
  for (let i = 0; i < 70; i++) {
    bubbels.push(
      new Bubble(
        p5,
        p5.random(0, p5.width),
        p5.random(p5.height, p5.height + 1200),
        p5.random(15)
      )
    );
  }
}

function runBubble(p5) {
  for (let i = 0; i < 70; i++) {
    bubbels[i].update(p5, p5.random(-0.1, 0.1), -0.01);
    bubbels[i].edge(p5);
    bubbels[i].show(p5);
  }
}

class Bubble {
  constructor(p5, xPos, yPos, radius) {
    this.pos = p5.createVector(xPos, yPos);
    this.vel = p5.createVector(0, 0);
    this.radius = radius;
  }

  update(p5, xSpeed, ySpeed) {
    this.vel.add(xSpeed, ySpeed);
    this.pos.add(this.vel);
    this.vel.limit(1);
  }

  edge(p5) {
    if (this.pos.y < 0 - this.radius) {
      this.pos.y = p5.random(p5.height, p5.height + 800);
    }
  }

  show(p5) {
    p5.noStroke();
    p5.fill(255, 20);
    p5.ellipse(this.pos.x, this.pos.y, this.radius);
  }
}
