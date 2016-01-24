/*
 *  Queue data structure for holding all the solutions that are pending deferral,
 *  Optimized to allow for constant-time enqueue/dequeue operations at the cost of increased space complexity
 *
 *  Enqueue: O(1)
 *  Dequeue: O(1)
 *  Shift on bufferRatio threshold: O(n)
 */

var SolutionsQueue = function(bufferRatio) {
  this._storage = [];
  this._first = null;
  this._bufferRatio = bufferRatio || 0.5;
}

SolutionsQueue.prototype.enqueue = function(obj) {
  if (this._first === null) this._first = 0;
  this._storage.push(obj);
}

SolutionsQueue.prototype.dequeue = function(cb) {
  if (this._storage[this._first] !== undefined) {
    cb(this._storage[this._first]);
    this._storage[this._first] = undefined;
    this._first++;

    if (this._first / this._storage.length >= this._bufferRatio) {
      this._storage = this._storage.slice(this._first);
      this._first = 0;
    }
  } else {
    //Do nothing
  }
}

module.exports = SolutionsQueue;