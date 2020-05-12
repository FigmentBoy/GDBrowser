const socket = io();
let got = false;
let currObj = null;

let sprites = null;
let spritesheet = [];
spritesheet[0] = null;
spritesheet[1] = new Image;
spritesheet[2] = new Image;
spritesheet[3] = new Image;
spritesheet[1].src = '/spritesheet1.png';
spritesheet[2].src = '/spritesheet2.png';
spritesheet[3].src = '/spritesheet3.png';

const drawCanvas = document.getElementById("draw");
const ctx = drawCanvas.getContext('2d');

const modifyCanvas = document.createElement('CANVAS');
document.body.appendChild(modifyCanvas);
const modifyCtx = modifyCanvas.getContext('2d');


drawCanvas.width = window.innerWidth * 0.4;
drawCanvas.height = window.innerHeight * 0.4;

currLayer = null;

const colorNormal = $('#normal');
const color1 = $('#color1');
const color2 = $('#color2');
const black = $('#black');

const posX = $('#x');
const posY = $('#y');
const scale = $('#scale');
const rot = $('#rot');

const down = $('#down');
const up = $('#up');

const remove = $('#remove');
const baseColor = {r: 255, g: 0, b: 255}
const objectId = $('#objectId');
$.getJSON('/sprites.json', data => {
    sprites = data;

    for (s in sprites) {
        let sprite = sprites[s];

        
        let canvas = document.createElement("canvas");
        canvas.classList.add('sprite');
        canvas.id = s;
        document.getElementById('choice').appendChild(canvas);
        let c = canvas.getContext('2d');

        canvas.width = window.innerHeight * 0.08;
        canvas.height = window.innerHeight * 0.08;

        let factor = 1;

        if (sprite.width >= sprite.height) {
            factor = (window.innerHeight * 0.08) / sprite.width;
        } else {
            factor = (window.innerHeight * 0.08) / sprite.height;
        }

        c.translate(canvas.width/2, canvas.height/2);
        if (sprite.rotation == 0) {
            c.drawImage(spritesheet[sprite.spritesheet], sprite.x, sprite.y, sprite.width, sprite.height, -sprite.width*factor/2, -sprite.height*factor/2, sprite.width * factor, sprite.height * factor)
        } else {
            c.rotate(270 * Math.PI/180)
            c.drawImage(spritesheet[sprite.spritesheet], sprite.x, sprite.y, sprite.height, sprite.width, -sprite.height*factor/2, -sprite.width*factor/2, sprite.height * factor, sprite.width * factor)
            c.rotate(-270 * Math.PI/180)
        }
        
    }
})

socket.on('object', obj => {
    currObj = obj;
    console.log(JSON.stringify(currObj, null, 4));

    ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    drawGrid();
    drawObject(obj, drawCanvas.width/2, drawCanvas.height/2);
})

function drawObject(object, x, y) {
    ctx.save();
    ctx.translate(x, y);
    $('#layers').empty();
    object.layers.forEach(layer => {        
        ctx.translate(layer.x, layer.y);
        ctx.rotate(layer.rotation * Math.PI/180);

        modifyCtx.translate(layer.x, layer.y);
        modifyCtx.rotate(layer.rotation * Math.PI/180);
        
        

        if (`${layer.scale}`.split(',').length == 2) {
            ctx.scale(`${layer.scale}`.split(',')[0], `${layer.scale}`.split(',')[1]);
        } else {
            ctx.scale(layer.scale, layer.scale);
        }
        
        

        sprite = sprites[layer.sprite];



        let factor = 0.25;

        if (layer.color == 1) {
            base = {h: 0, s: 100, l: 100}

            change = {h: 170 - base.h, s: 100 + (base.s - 21.3), l: 100 + (51.2 - base.l)}
            ctx.filter =  ''

        } else if (layer.color == 3) {
            ctx.filter = "brightness(0%)";
        } else {
            ctx.filter = "none";
        }

        if (sprite.rotation == 0) {
            ctx.drawImage(spritesheet[sprite.spritesheet], sprite.x, sprite.y, sprite.width, sprite.height, -sprite.width/2*factor, -sprite.height/2*factor, sprite.width*factor, sprite.height*factor)
        } else {
            ctx.rotate(270 * Math.PI/180)
            ctx.drawImage(spritesheet[sprite.spritesheet], sprite.x, sprite.y, sprite.height, sprite.width, -sprite.height/2*factor, -sprite.width/2*factor, sprite.height*factor, sprite.width*factor)
            ctx.rotate(-270 * Math.PI/180)
        }

        ctx.rotate(-layer.rotation * Math.PI/180);
        ctx.translate(-layer.x, -layer.y);
        ctx.scale(1/layer.scale, 1/layer.scale);

        // Add to layer bar
        
        let canvas = document.createElement("canvas");
        canvas.classList.add('layer');
        canvas.id = layer.sprite;
        document.getElementById('layers').appendChild(canvas);
        let c = canvas.getContext('2d');

        canvas.width = window.innerHeight * 0.08;
        canvas.height = window.innerHeight * 0.08;

        factor = 1;

        

        sprite = sprites[layer.sprite];

        if (sprite.width >= sprite.height) {
            factor = (window.innerHeight * 0.08) / sprite.width;
        } else {
            factor = (window.innerHeight * 0.08) / sprite.height;
        }

        c.translate(canvas.width/2, canvas.height/2);
        if (sprite.rotation == 0) {
            c.drawImage(spritesheet[sprite.spritesheet], sprite.x, sprite.y, sprite.width, sprite.height, -sprite.width*factor/2, -sprite.height*factor/2, sprite.width * factor, sprite.height * factor)
        } else {
            c.rotate(270 * Math.PI/180)
            c.drawImage(spritesheet[sprite.spritesheet], sprite.x, sprite.y, sprite.height, sprite.width, -sprite.height*factor/2, -sprite.width*factor/2, sprite.height * factor, sprite.width * factor)
            c.rotate(-270 * Math.PI/180)
        }

        if (currLayer != null) {
            $(`#layers canvas:eq(${currLayer})`).addClass('selected');
        }
    })
    ctx.restore();
}

function drawGrid() {
    let x = (drawCanvas.width/2)-15;
    while (x > 0) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, drawCanvas.height);
        x -=30;
    }

    x = (drawCanvas.width/2)+15;
    while (x < drawCanvas.width) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, drawCanvas.height);
        x +=30;
    }

    let y = (drawCanvas.height/2)-15;
    while (y > 0) {
        ctx.moveTo(0, y);
        ctx.lineTo(drawCanvas.width, y);
        y -=30;
    }

    y = (drawCanvas.height/2)+15;
    while (y < drawCanvas.height) {
        ctx.moveTo(0, y);
        ctx.lineTo(drawCanvas.width, y);
        y +=30;
    }

    ctx.strokeStyle = 'black';
    ctx.stroke();
}

$(document).on('click', '.sprite', e => {
    currObj.layers.push({sprite: e.target.id, x: 0, y: 0, rotation: 0, scale: 1, color: 0});

    ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    drawGrid();
    drawObject(currObj, drawCanvas.width/2, drawCanvas.height/2)

    socket.emit('saveObj', currObj)
})

$(document).on('click', '.layer', e => {
    $('.selected').removeClass('selected');
    e.target.classList.add('selected');

    currLayer = $(e.target).index();
    let layer = currObj.layers[currLayer];

    if (layer.color == 0) {
        colorNormal.prop('checked', true);
    } else if (layer.color == 1) {
        color1.prop('checked', true);
    } else if (layer.color == 2) {
        color2.prop('checked', true);
    } else if (layer.color == 3) {
        black.prop('checked', true);
    }

    posX.val(layer.x);
    posY.val(layer.y);
    scale.val(layer.scale);
    rot.val(layer.rotation);
})

remove.on('click', () => {
    if (currLayer != null) {
        $(`#layers canvas:eq(${currLayer})`).get(0).remove();
        currObj.layers.splice(currLayer, 1);
        ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
        drawGrid();
        currLayer = null;
        drawObject(currObj, drawCanvas.width/2, drawCanvas.height/2)
        socket.emit('saveObj', currObj)
        

        colorNormal.prop('checked', false);
        color1.prop('checked', false);
        color2.prop('checked', false);
        black.prop('checked', false);
        posX.val(null);
        posY.val(null);
        scale.val(null);
        rot.val(null);
    }
})

colorNormal.on('click', () => {
    if (currLayer != null) {
        currObj.layers[currLayer].color = 0;
        socket.emit('saveObj', currObj)

        ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
        drawGrid();
        drawObject(currObj, drawCanvas.width/2, drawCanvas.height/2)
    }
})

color1.on('click', () => {
    if (currLayer != null) {
        currObj.layers[currLayer].color = 1;
        socket.emit('saveObj', currObj);

        ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
        drawGrid();
        drawObject(currObj, drawCanvas.width/2, drawCanvas.height/2)
    }
})

color2.on('click', () => {
    if (currLayer != null) {
        currObj.layers[currLayer].color = 2;
        socket.emit('saveObj', currObj)

        ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
        drawGrid();
        drawObject(currObj, drawCanvas.width/2, drawCanvas.height/2)
    }
})

black.on('click', () => {
    if (currLayer != null) {
        currObj.layers[currLayer].color = 3;
        socket.emit('saveObj', currObj)

        ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
        drawGrid();
        drawObject(currObj, drawCanvas.width/2, drawCanvas.height/2)
    }
})

posX.on('change', () => {
    if (currLayer != null) {
        currObj.layers[currLayer].x = posX.val();
        socket.emit('saveObj', currObj)

        ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
        drawGrid();
        drawObject(currObj, drawCanvas.width/2, drawCanvas.height/2)
    }
})

posY.on('change', () => {
    if (currLayer != null) {
        currObj.layers[currLayer].y = posY.val();
        socket.emit('saveObj', currObj)

        ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
        drawGrid();
        drawObject(currObj, drawCanvas.width/2, drawCanvas.height/2)
    }
})

scale.on('change', () => {
    if (currLayer != null) {
        currObj.layers[currLayer].scale = scale.val();
        socket.emit('saveObj', currObj)

        ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
        drawGrid();
        drawObject(currObj, drawCanvas.width/2, drawCanvas.height/2)
    }
})

rot.on('change', () => {
    if (currLayer != null) {
        currObj.layers[currLayer].rotation = rot.val();
        socket.emit('saveObj', currObj)

        ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
        drawGrid();
        drawObject(currObj, drawCanvas.width/2, drawCanvas.height/2)
    }
})

up.on('click', () => {
    if (currLayer != null && currLayer < currObj.layers.length - 1) {
        currObj.layers = move(currObj.layers, currLayer, currLayer + 1);
        socket.emit('saveObj', currObj)
        currLayer += 1;

        ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
        drawGrid();
        drawObject(currObj, drawCanvas.width/2, drawCanvas.height/2)
    }
})

down.on('click', () => {
    if (currLayer != null && currLayer > 0) {
        currObj.layers = move(currObj.layers, currLayer, currLayer - 1);
        socket.emit('saveObj', currObj)
        currLayer -= 1;

        ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
        drawGrid();
        drawObject(currObj, drawCanvas.width/2, drawCanvas.height/2)
    }
})

objectId.on('change', () => {
    if (objectId.val() < 1) objectId.val(1);

    currLayer = null;
    colorNormal.prop('checked', false);
    color1.prop('checked', false);
    color2.prop('checked', false);
    black.prop('checked', false);
    posX.val(null);
    posY.val(null);
    scale.val(null);
    rot.val(null);
    socket.emit('object', parseInt(objectId.val()));
})

// Code below is obtained from outside source. I am to dumdum to code this
function move(arr, old_index, new_index) {
    while (old_index < 0) {
        old_index += arr.length;
    }
    while (new_index < 0) {
        new_index += arr.length;
    }
    if (new_index >= arr.length) {
        var k = new_index - arr.length;
        while ((k--) + 1) {
            arr.push(undefined);
        }
    }
     arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);  
   return arr;
}
