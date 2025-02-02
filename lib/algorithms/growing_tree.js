// Generated by CoffeeScript 2.7.0
/*
Author: Jamis Buck <jamis@jamisbuck.org>
License: Public domain, baby. Knock yourself out.

The original CoffeeScript sources are always available on GitHub:
http://github.com/jamis/csmazes
*/
Maze.Algorithms.GrowingTree = (function() {
  class GrowingTree extends Maze.Algorithm {
    constructor(maze, options) {
      var ref;
      super(args);
      this.cells = [];
      this.state = 0;
      this.script = new Maze.Algorithms.GrowingTree.Script((ref = options.input) != null ? ref : "random", this.rand);
    }

    inQueue(x, y) {
      return this.maze.isSet(x, y, this.QUEUE);
    }

    enqueue(x, y) {
      this.maze.carve(x, y, this.QUEUE);
      return this.cells.push({
        x: x,
        y: y
      });
    }

    nextCell() {
      return this.script.nextIndex(this.cells.length);
    }

    startStep() {
      var x, y;
      [x, y] = [this.rand.nextInteger(this.maze.width), this.rand.nextInteger(this.maze.height)];
      this.enqueue(x, y);
      this.updateAt(x, y);
      return this.state = 1;
    }

    runStep() {
      var cell, direction, i, index, len, nx, ny, ref;
      index = this.nextCell();
      cell = this.cells[index];
      ref = this.rand.randomDirections();
      for (i = 0, len = ref.length; i < len; i++) {
        direction = ref[i];
        nx = cell.x + Maze.Direction.dx[direction];
        ny = cell.y + Maze.Direction.dy[direction];
        if (this.maze.isValid(nx, ny)) {
          if (this.maze.isBlank(nx, ny)) {
            this.maze.carve(cell.x, cell.y, direction);
            this.maze.carve(nx, ny, Maze.Direction.opposite[direction]);
            this.enqueue(nx, ny);
            this.updateAt(cell.x, cell.y);
            this.updateAt(nx, ny);
            return;
          } else if (this.canWeave(direction, nx, ny)) {
            this.performWeave(direction, cell.x, cell.y, (toX, toY) => {
              return this.enqueue(toX, toY);
            });
            return;
          }
        }
      }
      this.cells.splice(index, 1);
      this.maze.uncarve(cell.x, cell.y, this.QUEUE);
      return this.updateAt(cell.x, cell.y);
    }

    step() {
      switch (this.state) {
        case 0:
          this.startStep();
          break;
        case 1:
          this.runStep();
      }
      return this.cells.length > 0;
    }

  };

  GrowingTree.prototype.QUEUE = 0x1000;

  return GrowingTree;

}).call(this);

Maze.Algorithms.GrowingTree.Script = class Script {
  constructor(input, rand) {
    var command, name, part, parts, totalWeight, weight;
    this.rand = rand;
    this.commands = (function() {
      var i, len, ref, results;
      ref = input.split(/;|\r?\n/);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        command = ref[i];
        totalWeight = 0;
        parts = (function() {
          var j, len1, ref1, results1;
          ref1 = command.split(/,/);
          results1 = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            part = ref1[j];
            [name, weight] = part.split(/:/);
            totalWeight += parseInt(weight != null ? weight : 100);
            results1.push({
              name: name.replace(/\s/, ""),
              weight: totalWeight
            });
          }
          return results1;
        })();
        results.push({
          total: totalWeight,
          parts: parts
        });
      }
      return results;
    })();
    this.current = 0;
  }

  nextIndex(ceil) {
    var command, i, len, part, ref, target;
    command = this.commands[this.current];
    this.current = (this.current + 1) % this.commands.length;
    target = this.rand.nextInteger(command.total);
    ref = command.parts;
    for (i = 0, len = ref.length; i < len; i++) {
      part = ref[i];
      if (target < part.weight) {
        switch (part.name) {
          case 'random':
            return this.rand.nextInteger(ceil);
          case 'newest':
            return ceil - 1;
          case 'middle':
            return Math.floor(ceil / 2);
          case 'oldest':
            return 0;
          default:
            throw `invalid weight key \`${part.name}'`;
        }
      }
    }
  }

};
