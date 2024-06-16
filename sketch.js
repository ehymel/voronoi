let seedPoints = [];
let delaunay, voronoi;

function setup() {
    createCanvas(600, 600);
    for (let i = 0; i < 1000; i++) {
        seedPoints[i] = createVector(random(width), random(height));
    }

    delaunay = calculateDelaunay(seedPoints);
    voronoi = delaunay.voronoi([0, 0, width, height]);
}

function draw() {
    background(255);

    for (let v of seedPoints) {
        stroke(0);
        strokeWeight(2);
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

    strokeWeight(2);

    let centroids = [];
    for (let poly of cells) {
        let centroid = createVector(0, 0);
        for (let i = 0; i < poly.length; i++) {
            centroid.x += poly[i][0];
            centroid.y += poly[i][1];
        }
        centroid.div(poly.length);
        centroids.push(centroid);
        // stroke(255, 0, 0);
        // strokeWeight(4);
        // point(centroid.x, centroid.y);
    }

    for (let i = 0; i < seedPoints.length; i++) {
        seedPoints[i].lerp(centroids[i], 0.1);
    }

    delaunay = calculateDelaunay(seedPoints);
    voronoi = delaunay.voronoi([0, 0, width, height]);
}

function calculateDelaunay(points) {
    let pointsArray = [];
    for (let v of points) {
        pointsArray.push(v.x, v.y);
    }
    return new d3.Delaunay(pointsArray);
}
