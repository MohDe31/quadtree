const WIDTH = 500;
const HEIGHT= 500;

const BATCH_SIZE = 5000;

const RADIUS = 5;

const boundary = {
    x: 0,
    y: 0,
    w: 150,
    h: 150
}

const points = [];
const quadTree = new QuadTree(4, {x: 0, y: 0, w: WIDTH, h: HEIGHT});

const sqrDist = (pt0, pt1) => Math.pow(pt0.x - pt1.x, 2)+Math.pow(pt0.y - pt1.y, 2);
const dist = (pt0, pt1) => Math.sqrt(sqrDist(pt0, pt1));

let fps = undefined;

function setup(){
    const canvas = createCanvas(WIDTH, HEIGHT);
    canvas.parent("canvas-container");

    for(let i = 0; i < BATCH_SIZE; i+=1){
        const particle = new Particle(Math.random() * WIDTH >> 0, Math.random() * HEIGHT >> 0);
        points.push(particle);
    }

    fps = document.querySelector("#fps");
    
}

function draw(){
    background(0);

    fps.innerText = parseInt(frameRate());

    for(let i = 0; i < points.length; i+=1){

        points[i].draw();

        points[i].x += Math.random() * 2 - 1;
        points[i].y += Math.random() * 2 - 1;
    }

    /*stroke(0, 255, 0);
    strokeWeight(1)
    noFill();
    rect(boundary.x, boundary.y, boundary.w, boundary.h);*/

    for(let i = 0; i < points.length; i+=1){
        
        quadTree.insert(points[i]);
    }

    /*const pts = quadTree.query(boundary);

    for(let i = 0; i < pts.length; i+=1){
        noStroke();
        pts[i].highLight();
        pts[i].draw();

        // points[i].x += Math.random() * 2 - 1;
        // points[i].y += Math.random() * 2 - 1;
    }*/


    // stroke(170, 0, 0, 150);
    // noFill();
    // drawQuadTree(quadTree);

    for(let i = 0; i < points.length; i+=1){
        const nearPts = quadTree.query({ 
            x: points[i].x - RADIUS * 2,
            y: points[i].y - RADIUS * 2,
            w: RADIUS * 4,
            h: RADIUS * 4});

        for(let j = 0; j < nearPts.length; j+=1){
            if(points[i] === nearPts[j]) continue;

            const distance = sqrDist(points[i], nearPts[j]);

            if(distance < RADIUS * RADIUS){
                points[i].highLight();
                nearPts[j].highLight();
            }
        }
    }


    quadTree.clear();
}

function drawQuadTree(tree){
    rect(tree.boundary.x, tree.boundary.y, tree.boundary.w, tree.boundary.h);

    for(let i = 0; i < tree.subTrees.length; i+=1){
        drawQuadTree(tree.subTrees[i]);
    }
}

function mouseDragged(){
    points.push(new Particle(mouseX, mouseY));
    
}


const Particle = (function(){
    function Particle(x, y){
        this.x = x;
        this.y = y;

        this.highLighted = false;
    }

    Particle.prototype.draw = function(){
        if(this.highLighted)fill(100);
        else fill(255);
        noStroke();
        circle(this.x, this.y, RADIUS);

        this.highLighted = false;
    }

    Particle.prototype.highLight = function(){
        this.highLighted = true;
    }

    return Particle;
})();