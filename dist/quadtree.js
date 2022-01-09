"use strict";
;
;
function pointInBoundary(point, rect) {
    return point.x >= rect.x &&
        point.y >= rect.y &&
        point.x <= rect.x + rect.w &&
        point.y <= rect.y + rect.h;
}
function rectIntersectRect(rect1, rect2) {
    return !(rect1.x > rect2.x + rect2.w ||
        rect1.x + rect1.w < rect2.x ||
        rect1.y > rect2.y + rect2.h ||
        rect1.y + rect1.h < rect2.y);
}
class QuadTree {
    constructor(capacity, boundary) {
        this.capacity = capacity;
        this.boundary = boundary;
        this.points = new Array();
        this.subTrees = new Array();
    }
    divide() {
        const { x, y } = this.boundary;
        const hw = this.boundary.w / 2;
        const hh = this.boundary.h / 2;
        // Top Left
        this.subTrees.push(new QuadTree(this.capacity, { x: x, y: y, w: hw, h: hh }));
        // Top Right
        this.subTrees.push(new QuadTree(this.capacity, { x: x + hw, y: y, w: hw, h: hh }));
        // Bottom Left
        this.subTrees.push(new QuadTree(this.capacity, { x: x, y: y + hh, w: hw, h: hh }));
        // Bottom Right
        this.subTrees.push(new QuadTree(this.capacity, { x: x + hw, y: y + hh, w: hw, h: hh }));
    }
    insert(point) {
        // Check if a point is in the boundary
        if (!pointInBoundary(point, this.boundary))
            return false;
        // If we have'nt reached the max capacity, we insert the point
        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        }
        // If we have'nt divided the tree, we simply divide it 🤷‍♂️
        if (!this.subTrees.length) {
            this.divide();
            for (let i = 0; i < this.points.length; i += 1) {
                for (const subTree of this.subTrees) {
                    const inserted = subTree.insert(this.points[i]);
                    if (inserted)
                        break;
                    ;
                }
            }
        }
        // For every sub tree we attempt to insert the point
        for (const subTree of this.subTrees) {
            const inserted = subTree.insert(point);
            if (inserted)
                return true;
        }
        return false;
    }
    query(boundary, output) {
        output = output || new Array();
        // If the current area doesn't intersect with the query boundary, we return
        if (!rectIntersectRect(boundary, this.boundary))
            return output;
        // If we have no subtrees we just push current points
        if (!this.subTrees.length) {
            for (let i = 0; i < this.points.length; i += 1) {
                if (pointInBoundary(this.points[i], boundary))
                    output.push(this.points[i]);
            }
        }
        else {
            // Else we query the points from them
            for (const subTree of this.subTrees) {
                subTree.query(boundary, output);
            }
        }
        return output;
    }
    clear() {
        for (let i = 0; i < this.subTrees.length; i += 1) {
            this.subTrees[i].clear();
            for (let j = 0; j < this.points.length; j += 1) {
                delete this.points[j];
            }
            delete this.subTrees[i];
        }
        this.subTrees = new Array();
        this.points = new Array();
    }
}
