let seedPoints = [];
let delaunay;

function setup() {
    createCanvas(400, 400);
    for (let i = 0; i < 25; i++) {
        seedPoints[i] = createVector(random(width), random(height));
    }
}

function draw() {
    background(255);

    delaunay = calculateDelaunay(seedPoints);
    let voronoi = delaunay.voronoi([0, 0, width, height]);

    for (let v of seedPoints) {
        stroke(0);
        strokeWeight(4);
        point(v.x, v.y);
    }

    // noFill();
    // strokeWeight(1);
    // let {points, triangles} = delaunay;
    // for (let i = 0; i < triangles.length; i += 3) {
    //     let a = 2 * triangles[i];
    //     let b = 2 * triangles[i + 1];
    //     let c = 2 * triangles[i + 2];
    //     triangle(points[a], points[a + 1], points[b], points[b + 1], points[c], points[c + 1], );
    // }

    let polygons = voronoi.cellPolygons();
    let cells = Array.from(polygons);

    for (let poly of cells) {
        stroke(0);
        strokeWeight(1);
        noFill();
        beginShape();
        for (let i = 0; i < poly.length; i++) {
            vertex(poly[i][0], poly[i][1]);
        }
        endShape();
    }
}

function calculateDelaunay(points) {
    let pointsArray = [];
    for (let v of points) {
        pointsArray.push(v.x, v.y);
    }
    return new d3.Delaunay(pointsArray);
}
