//HUGE THANKS TO THE MDN tut https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context
var game;
var horizAspect = window.innerWidth/window.innerHeight;

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
  // console.log(game.COLOR_BUFFER_BIT)
  game.clear(game.COLOR_BUFFER_BIT | game.DEPTH_BUFFER_BIT);

  drawScene()
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

function getShader(game, id, type) {
  var shaderScript, theSource, currentChild, shader;

  shaderScript = document.getElementById(id);

  if (!shaderScript) {
   return null;
  }

  theSource = shaderScript.text;

  if (!type) {
    if (shaderScript.type == 'x-shader/x-fragment') {
      type = game.FRAGMENT_SHADER;
    } else if (shaderScript.type == 'x-shader/x-vertex') {
      type = game.VERTEX_SHADER;
    } else {
      // Unknown shader type
      return null;
    }
  }
  shader = game.createShader(type);
  game.shaderSource(shader, theSource);

  // Compile the shader program
  game.compileShader(shader);

  // See if it compiled successfully
  if (!game.getShaderParameter(shader, game.COMPILE_STATUS)) {
      console.log('An error occurred compiling the shaders: ' + game.getShaderInfoLog(shader));
      game.deleteShader(shader);
      return null;
  }

  return shader;
}

function initBuffers() {
  squareVerticesBuffer = game.createBuffer();
  game.bindBuffer(game.ARRAY_BUFFER, squareVerticesBuffer);

  var vertices = [
    1.0,  1.0,  0.0,
    -1.0, 1.0,  0.0,
    1.0,  -1.0, 0.0,
    -1.0, -1.0, 0.0
  ];

  game.bufferData(game.ARRAY_BUFFER, new Float32Array(vertices), game.STATIC_DRAW);
}

function drawScene() {
  game.clear(game.COLOR_BUFFER_BIT | game.DEPTH_BUFFER_BIT);

  perspectiveMatrix = MakePerspective(45, 640.0/480.0, 0.1, 100.0);

  loadIdentity();
  mvTranslate([-0.0, 0.0, -6.0]);

  game.bindBuffer(game.ARRAY_BUFFER, squareVerticesBuffer);
  game.vertexAttribPointer(vertexPositionAttribute, 3, game.FLOAT, false, 0, 0);
  setMatrixUniforms();
  game.drawArrays(game.TRIANGLE_STRIP, 0, 4);
}

function loadIdentity() {
  mvMatrix = Matrix.I(4);
}

function multMatrix(m) {
  mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
  multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

function setMatrixUniforms() {
  var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

  var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
}
function MakePerspective(FOV, AspectRatio, Closest, Farest){
    var YLimit = Closest * Math.tan(FOV * Math.PI / 360);
    var A = -( Farest + Closest ) / ( Farest - Closest );
    var B = -2 * Farest * Closest / ( Farest - Closest );
    var C = (2 * Closest) / ( (YLimit * AspectRatio) * 2 );
    var D = (2 * Closest) / ( YLimit * 2 );
    return [
        C, 0, 0, 0,
        0, D, 0, 0,
        0, 0, A, -1,
        0, 0, B, 0
    ];
}
function MakeTransform(Object){
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, -6, 1
    ];
}
