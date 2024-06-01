class Shape {
    constructor(id) {
      this.id = id;
    }
}
  
class Circle extends Shape {
    constructor(id, center, radius) {
        super(id);
        this.center = center;
        this.radius = radius;
    }
}
  
class Square extends Shape {
    constructor(id, topLeft, sideLength) {
        super(id);
        this.topLeft = topLeft;
        this.sideLength = sideLength;
    }
}

class Triangle extends Shape {
    constructor(id, vertices) {
        super(id);
        this.vertices = vertices;
    }
}