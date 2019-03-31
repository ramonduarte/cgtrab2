let aDot = {
  x: 0,
  y: 0
}
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
      // let [x, y] = arrows[arrows.length-1];
      // let dx = (mouseX - x);
      // let dy = (mouseY - y);
      // line(x, y, 1*dx + x, 1*dy + y);
      // // line(x, y, 100*dx + x, 100*dy + y);

      // beginShape(LINES);
      // vertex(x, y);
      // vertex(100*dx + x, 100*dy + y);
      // // line(x, y, 100*dx + x, 100*dy + y);
      // endShape();
    }
    

  } else if (mouseIsPressed === true) {

    if (state === "hover") {
      shapes.push(new Polygon([[mouseX, mouseY]]));
      state = "draw";
  
    } else if (state === "draw") {
      // fill(200);
      // beginShape();
      // for (var i = 0, len = shapes[shapes.length - 1].length; i < len; i++)
      // vertex(...shapes[shapes.length - 1][i]);
      // // vertex(mouseX, mouseY);
      // endShape(CLOSE);
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

function mousePressed() {
  aDot.x = mouseX;
  aDot.y = mouseY;
  
}

function doubleClicked() {
  if (state === "draw" || state === "drag") {
    state = "hover";
  } 
}

// function keyPressed() {
//   if (state === "hover")
//     state = "drag";
// }


class Polygon {
  constructor(vertices) {
    this.vertices = [];
    for (let index = 0; index < vertices.length; index++) {
      this.vertices.push(createVector(...vertices[index]));
    }
    this.vertices.push(createVector(mouseX, mouseY));

  }

  update() {
    this.vertices.pop();
    this.vertices.push(createVector(mouseX, mouseY));
  }

  // Draw particle and connect it with a line
  // Draw a line to another
  display(other) {
    strokeWeight(4);

    fill(0.0, 0.0, 0.0, 100);
    beginShape();
    for (var i = 0, len = this.vertices.length - 1; i < len; i++)
      vertex(this.vertices[i].x, this.vertices[i].y);
    endShape(CLOSE);

  }
}


class Ray {
  constructor(position, target) {
    this.position = createVector(position.x, position.y);
    this.direction = createVector(target.x, target.y);
    

  }

  update() {
    if (state === "drag" && this == arrows[arrows.length - 1])
      this.direction = createVector(mouseX, mouseY);
  }

  // Draw particle and connect it with a line
  // Draw a line to another
  display(other) {
    strokeWeight(10);
    point(this.position.x, this.position.y);

    let dx = (this.direction.x - this.position.x);
    let dy = (this.direction.y - this.position.y);

    strokeWeight(2);
    beginShape(LINES);
    vertex(this.position.x, this.position.y);
    vertex(100*dx + this.position.x, 100*dy + this.position.y);
    endShape();
    
    this.arrowOrientation = atan2(dy, dx);
    this.arrowPosition = createVector(
      50*dx / max(dx, dy) + this.position.x,
      50*dy / max(dx, dy) + this.position.y
    );
    push();
    translate(this.position.x, this.position.y);
    rotate(atan2(this.direction.y - this.position.y, this.direction.x - this.position.x));
    triangle(30, -10, 30, 10, 50, 0);
    
    pop();
  }
}
