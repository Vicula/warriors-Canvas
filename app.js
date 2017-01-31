
var game;

function start (){
  var canvas = document.getElementById('canvas');

  game = initWebGL(canvas)

  //this will check to see if the webgl was assigned
  //to the game attribute if not it will end!!!
  //=============

  if (!game){
    return;
  }

  //===============

  //Sets the canvas to the entire screen width and height
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  game.viewport(0, 0, canvas.width, canvas.height)

  //make the screen black
  game.clearColor(0,0,0,1);


  //enable depth testing
  game.enable(game.DEPTH_TEST);


  //closer things obscure farther things
  game.depthFunc(game.LEQUAL);


  //clear the color and the depth tester
  game.clear(game.COLOR_BUFFER_BIT | game.DEPTH_BUFFER_BIT);


}


function initWebGL(canvas) {
  game = null;

  game = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  // This is sending out the allert if you were unable to get either
  // kind of webgl that being normal or experimental
  if (!game) {
    alert('Unable to initialize WebGL. Your browser may not support it.');
  }

  return game;
}

function initShaders(){
  var fragmentShader = getShader(game, 'shader-fs')
  var vertexShader = getShader(game, 'shader-vs')

  //this will create the shader program attached to the game canvas
  shaderProgram = game.createProgram()
  game.attachShader(shaderProgram, vertexShader)
  game.attachShader(shaderProgram, fragmentShader)
  game.linkProgram(shaderProgram)

  //this is the error handling for the shader program initialization

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.log('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram))
  }

  game.useProgram(shaderProgram);

   vertexPositionAttribute = game.getAttribLocation(shaderProgram, 'aVertexPosition');
   game.enableVertexAttribArray(vertexPositionAttribute);

}
