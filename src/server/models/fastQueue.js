/*
 *  Queue data structure for holding all the solutions that are pending deferral,
 *  Optimized to allow for constant-time enqueue/dequeue operations at the cost of increased space complexity
 *  Instead of shifting the storage array every dequeue operation, it maintains undefined values before the _first pointer
 *  And just copies all defined properties into a new storage array when a threshold is reached
 *
 *  Enqueue: O(1)
 *  Dequeue: O(1)
 *  Shift on bufferRatio threshold: O(n)
 */

//Constructor for the FastQueue, takes in an optional bufferRatio (default 0.5)
//bufferRatio is the maximum ratio for _first / _storage.length before it must be resized and cleared of undefined values
var FastQueue = function(bufferRatio) {
  this._storage = [];
  this._first = null;
  this._bufferRatio = bufferRatio || 0.5;
}

//Adds an object to the back of the queue
FastQueue.prototype.enqueue = function(obj) {
  if (this._first === null) this._first = 0;
  this._storage.push(obj);
}

//Removes the first object in the queue, does NOT return
FastQueue.prototype.dequeue = function() {
  if (this._storage[this._first] !== undefined) {
    this._storage[this._first] = undefined;
    this._first++;
    //If the first pointer reaches over the buffer threshold, resize the array to hold only the elements after the pointer
    if (this._first / this._storage.length >= this._bufferRatio) {
      this._storage = this._storage.slice(this._first);
      this._first = 0;
    }
  }
}

//Returns the first object in the queue
FastQueue.prototype.peek = function() {
  return this._storage[this._first];
}

module.exports = FastQueue;
