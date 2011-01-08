{print} = require 'sys'
{spawn} = require 'child_process'
fs      = require 'fs'

task 'build', 'Build lib/ from src/', ->
  coffee = spawn 'coffee', ['-c', '--bare', '-o', 'lib', 'src']
  coffee.stdout.on 'data', (data) -> print data.toString()
  coffee.stderr.on 'data', (data) -> print data.toString()

task 'concat', 'Merge all generated Javascript files into a single file, maze-all.js', ->
  priorities = "mersenne.js": 1, "maze.js": 2, "widget.js": 3
  sources = fs.readdirSync("lib").sort((a, b) -> (priorities[a] || 4) - (priorities[b] || 4))
  output = fs.openSync("maze-all.js", "w")
  for source in sources
    fs.writeSync(output, "// ------ #{source} -------\n")
    fs.writeSync(output, fs.readFileSync("lib/#{source}") + "\n")
  fs.closeSync(output)

task 'minify', 'Concat and minify all generated Javascript files using YUICompressor', ->
  invoke 'concat'
  fs.open "maze-minified.js", "w", (err, fd) ->
    yui = spawn 'yuicompressor', ['maze-all.js']
    yui.stdout.on 'data', (data) -> fs.write(fd, data.toString())
    yui.stderr.on 'data', (data) -> print data.toString()
    yui.on 'exit', (code) -> fs.close(fd)

task 'clean', 'Clean up generated artifacts', ->
  for js in fs.readdirSync("lib")
    print "cleaning `lib/#{js}'\n"
    fs.unlink "lib/#{js}"
  for js in fs.readdirSync(".")
    if js == "maze-all.js" || js == "maze-minified.js"
      print "cleaning `#{js}'\n"
      fs.unlink js