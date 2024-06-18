let seedPoints = [];
let delaunay, voronoi;

function preload() {
    pic = loadImage('dog.jpg');
    // pic.resize(400, 0);
}

function setup() {
    let w = pic.width;
    let h = pic.height;
    createCanvas(w, h);
    let numberPoints = 10000; // w * h / 20

    for (let i = 0; i < numberPoints; i++) {
        let x = random(width);
        let y = random(height);
        let col = pic.get(x,y);
        if (brightness(col) < 50) {
            seedPoints.push(createVector(x, y));
        } else {
            i--;
        }
        // seedPoints.push(createVector(x, y));
    }

    delaunay = calculateDelaunay(seedPoints);
    voronoi = delaunay.voronoi([0, 0, width, height]);
}

function draw() {
    background(255);
    // image(pic, 0, 0);

    let polygons = voronoi.cellPolygons();
    let cells = Array.from(polygons);

    showPoints();

    // noFill();
    // strokeWeight(1);
    // let {points, triangles} = delaunay;
    // for (let i = 0; i < triangles.length; i += 3) {
    //     let a = 2 * triangles[i];
    //     let b = 2 * triangles[i + 1];
    //     let c = 2 * triangles[i + 2];
    //     triangle(points[a], points[a + 1], points[b], points[b + 1], points[c], points[c + 1], );
    // }

    // showPolygons(cells);

    let centroids = getWeightedCentroids(cells);

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

function getWeightedCentroids(cells) {
    let centroids = new Array(cells.length);
    let weights = new Array(cells.length).fill(0);

    for (let i = 0; i < centroids.length; i++) {
        centroids[i] = createVector(0, 0);
    }

    pic.loadPixels();
    let delaunayIndex = 0;
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            let index = (i + j * width) * 4;
            let r = pic.pixels[index];
            let g = pic.pixels[index + 1];
            let b = pic.pixels[index + 2];
            let luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            let weight = 1 - luminance / 255;

            delaunayIndex = delaunay.find(i, j, delaunayIndex);
            centroids[delaunayIndex].x += i * weight;
            centroids[delaunayIndex].y += j * weight;
            weights[delaunayIndex] += weight;
        }
    }

    for (let i = 0; i < centroids.length; i++) {
        if (weights[i] > 0) {
            centroids[i].div(weights[i]);
        } else {
            centroids[i] = seedPoints[i].copy();
        }
    }

    return centroids;
}

function getCentroids(cells) {
    centroids = [];
    for (let poly of cells) {
        let area = 0;
        let centroid = createVector(0, 0);
        for (let i = 0; i < poly.length; i++) {
            let v0 = poly[i];
            let v1 = poly[(i + 1) % poly.length];
            let crossValue = v0[0] * v1[1] - v0[1] * v1[0];
            area += crossValue;
            centroid.x += (v0[0] + v1[0]) * crossValue;
            centroid.y += (v0[1] + v1[1]) * crossValue;
        }
        area /= 2;
        centroid.div(6 * area);
        centroids.push(centroid);

        // stroke(255, 0, 0);
        // strokeWeight(4);
        // point(centroid.x, centroid.y);
    }
    return centroids;
}

function showPolygons(cells) {
    stroke(0);
    strokeWeight(1);
    noFill();
    for (let poly of cells) {
        beginShape();
        for (let i = 0; i < poly.length; i++) {
            vertex(poly[i][0], poly[i][1]);
        }
        endShape();
    }
}

function showPoints() {
    stroke(0);
    strokeWeight(1);
    for (let v of seedPoints) {
        point(v.x, v.y);
    }
}
