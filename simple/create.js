//GLOBAL VARS
var zoom = 1 / 10000;
var mouseVector; //Used to create velocity vectors for planets
var planets = []; //Holds
var g = 6.674 * Math.pow(10, -15);

//OBJECTS
//Planets Have coordinates, a radius, a mass, and a velocity
function Planet(x ,y, dx, dy) {
  this.pos = new Vector2(x, y);
  this.r = 100000;
  this.mass = 5.9 * Math.pow(10, 25);
  this.dx = dx;
  this.dy = dy;
  this.colour = new Colour(random(50, 255), random(50, 255), random(50, 255), 255);

  this.draw = function() {
    fill(this.colour.r, this.colour.g, this.colour.b);
    ellipse(this.pos.x * zoom, this.pos.y * zoom , this.r * zoom, this.r  * zoom);
  }

  this.update = function() {
    //Loop through all the differnet planets and calculate the sum of gravitational forces acting on each.
    var force = new Vector2(0, 0);

    for (var i = 0; i < planets.length; i++) {
      if (i == planets.indexOf(this)) {
        continue;
      }

      //Magnitude of the force of attraction
      var G = ((this.mass * planets[i].mass) / Math.pow(this.pos.dist(planets[i].pos), 2)) * g;

      //Calculate angle that the gavity vector is pointing in radians.
      var deltaX = planets[i].pos.x - this.pos.x;
      var deltaY = planets[i].pos.y - this.pos.y;

      var degree = Math.atan2(deltaY, deltaX);

      force.y += Math.sin(degree) * (G / this.mass);
      force.x += Math.cos(degree) * (G / this.mass);

    }
    //Update velocity vector based on acceleration from gavitational foreces
    this.dx += force.x;
    this.dy += force.y;

    //Update the bodies position based on its velocity vector
    this.pos.x += this.dx;
    this.pos.y += this.dy;
  }
}

//2 dim vector util object
function Vector2(x, y) {
  this.x = x; this.y = y;

  this.dist = function(other) {
    return Math.sqrt((other.x - this.x) * (other.x - this.x) + (other.y - this.y) * (other.y - this.y));
  }
}

function Colour(r, g, b, a) {
  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;
}

//FUNCTIONS
function touchMoved() {
  return false;
}
function mousePressed() {
  mouseVector = new Vector2(mouseX, mouseY);
}
function mouseReleased() {
  var dx = mouseVector.x - mouseX;
  var dy = mouseVector.y - mouseY;
  var scale = 0.03; //Converts pixels into sizable units

  planets.push(new Planet(mouseVector.x / zoom, mouseVector.y / zoom , dx * scale / zoom, dy * scale / zoom));
}

//PROGRAM LOGIC
function setupSimple() {
  planets = [];
  var simpleCanvas = createCanvas(window.innerWidth, window.innerHeight);
  noStroke();
  var sun = new Planet(width / 2, height / 2, 0, 0);
  sun.mass = 1.9 * Math.pow(10, 30);
  sun.r = 6374 * 109;
  sun.colour = new Colour(255, 255, 0);
  sun.pos = new Vector2((width / 2) / zoom, (height / 2) / zoom);
  sun.dx = 0;
  sun.dy = 0;
  planets.push(sun);
}

function removeSimple() {
  background(0,0,0,0);
}

function draw() {
  //clear();
  background(0, 0, 0, 150);
  update();
  for (var i = 0; i < planets.length; i++) {
    planets[i].draw();
  }

}

function update() {
  //Update planets
  for (var i = 0; i < planets.length; i++) {
    planets[i].update();
  }

}
