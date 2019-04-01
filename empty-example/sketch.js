let state = "hover";
let shapes = [];
let arrows = [];


function setup() {
  // put setup code here
  createCanvas(640, 480);
}

function draw() {
  // put drawing code here
  background("aliceblue");
  stroke(0);
  strokeWeight(4);

  if (keyIsDown(ALT)) {

    if (state === "hover") {

      if (mouseIsPressed === true) {
        state = "drag";
        strokeWeight(10);
        arrows.push(new Ray({x: mouseX, y: mouseY}, {x: mouseX, y: mouseY}));
        stroke("blue");
        strokeWeight(2);
  
      }
    } else if (state === "drag") {

    }
    

  } else if (mouseIsPressed === true) {

    

    if (state === "hover") {
      shapes.push(new Polygon([[mouseX, mouseY]]));
      state = "draw";
  
    } else if (state === "draw") {
      shapes[shapes.length -1].vertices.push([[mouseX, mouseY]]);
    } else if (state === "drag") {
      state = "hover";
    }
  }

  for (let i = 0; i < shapes.length; i++) {
    shapes[i].update();
    shapes[i].display();
  }
  for (let i = 0; i < arrows.length; i++) {
    arrows[i].update();
    arrows[i].display();
  }
}

function doubleClicked() {
  if (state === "draw" || state === "drag") {
    state = "hover";
  } 
}

function mouseDragged() {
  for (let i = 0; i < shapes.length; i++) {
    shapes[i].reactToPossibleClick();
  }
  for (let i = 0; i < arrows.length; i++) {
    arrows[i].reactToPossibleClick();
  }
}

function mouseReleased() {
  if (state === "edit")
    state = "hover";
}

function mousePressed() {
  for (let i = 0; i < arrows.length; i++) {
    if (arrows[i].lock)
      continue;
    if (dist(arrows[i].position.x, arrows[i].position.y, mouseX, mouseY) < 5) {
      state = "edit";
    }
  }
  for (let i = 0; i < shapes.length; i++) {
    if (shapes[i].lock)
      continue;
    for (let j = 0; j < shapes[i].vertices.length; j++) {
      if (dist(shapes[i].vertices[j].x, shapes[i].vertices[j].y, mouseX, mouseY) < 5) {
        state = "edit";
      }
    }
  }
}


class Polygon {
  constructor(vertices) {
    this.vertices = [];
    for (let index = 0; index < vertices.length; index++) {
      this.vertices.push(createVector(...vertices[index]));
    }
    this.vertices.push(createVector(mouseX, mouseY));
    this.lock = 30;
  }

  update() {
    this.vertices.pop();
    this.vertices.push(createVector(mouseX, mouseY));
  }

  display(other) {
    strokeWeight(4);

    fill(255, 0.0, 200, 100);
    stroke(255, 0.0, 200, 100);
    beginShape();
    for (var i = 0, len = this.vertices.length - 1; i < len; i++)
      vertex(this.vertices[i].x, this.vertices[i].y);
    endShape(CLOSE);

    strokeWeight(10);
    stroke(255, 0, 200, 255);
    for (var i = 0, len = this.vertices.length - 1; i < len; i++)
      point(this.vertices[i].x, this.vertices[i].y);
  }

  reactToPossibleClick() {
    if (this.lock > 0) {
      this.lock--;
      return false;
    }

    for (let i = 0; i < this.vertices.length; i++) {
      let d = dist(this.vertices[i].x, this.vertices[i].y, mouseX, mouseY);

      if (d < 5) {
        // TODO: fix stuttering 2019-03-31 20:19:49
        state = "edit";
        this.vertices[i].x = mouseX;
        this.vertices[i].y = mouseY;
      } else {
        // TODO: polygon should also be draggable 2019-03-31 20:30:55
      }
    }
  }
}


class Ray {
  constructor(position, target) {
    this.position = createVector(position.x, position.y);
    this.direction = atan2(target.y - this.position.y, target.x - this.position.x);
    this.lock = 30;
  }

  update() {
    if (state === "drag" && this == arrows[arrows.length - 1])
      this.direction = atan2(mouseY - this.position.y, mouseX - this.position.x);
  }

  display(other) {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.direction);
    strokeWeight(10);
    stroke(0, 0, 255, 255);
    point(0, 0);

    strokeWeight(2);
    stroke(0, 0, 255, 120);
    line(0, 0, height + width, 0);
    
    fill(0, 0, 255, 255);
    triangle(30, -10, 30, 10, 50, 0);
    pop();
  }

  reactToPossibleClick() {
    if (this.lock > 0) {
      this.lock--;
      return false;
    }
    // clicking on origin changes position
    let d = dist(this.position.x, this.position.y, mouseX, mouseY);
    
    if (d < 5) {
      // TODO: fix stuttering 2019-03-31 20:19:49
      state = "edit";
      this.position.x = mouseX;
      this.position.y = mouseY;
    } else {
      let angle = atan2(mouseY - this.position.y, mouseX - this.position.x);
      if (abs(angle - this.direction) < 0.1) {
        state = "edit";
        this.direction = angle;
      }
    }
  }
}

// TODO: add a selector for modes