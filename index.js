











const canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const offscreenCanvas = document.createElement('canvas');
offscreenCanvas.width = canvas.width;
offscreenCanvas.height = canvas.height;
const offscreenContext = offscreenCanvas.getContext('2d');




//////////////////////////////////////////////////////Variables toys//////////////////////////////////////////////////////
let iteration = 100;
let detail = 5;


let minX = -4;
let maxX = 4;
let minY = -4;
let maxY = 4;


let drawAxis = false;
let fixForAspectRatio = true;
//////////////////////////////////////////////////////Variables toys//////////////////////////////////////////////////////


let totX = maxX - minX;
let totY = maxY - minY;




let colors = [];


let dragging = false;
let wichPointInFocus = NaN;
let points = [new Complex([Math.random()*3-1.5,Math.random()*3-1.5]),new Complex([Math.random()*3-1.5,Math.random()*3-1.5]),new Complex([Math.random()*3-1.5,Math.random()*3-1.5]),new Complex([Math.random()*3-1.5,Math.random()*3-1.5]),new Complex([Math.random()*3-1.5,Math.random()*3-1.5]),new Complex([Math.random()*3-1.5,Math.random()*3-1.5]),new Complex([Math.random()*3-1.5,Math.random()*3-1.5]),new Complex([Math.random()*3-1.5,Math.random()*3-1.5])];
for(let i = 0;i < points.length;i++){
	colors.push(colorMix());
}
let screenListZ = [];
function draw(){
    context.fillStyle = "red";
    context.fillRect(0,0,canvas.width,canvas.height);


    for(let x = 0;x < canvas.width/detail;x++){
        screenListZ[x] = [];
        for(let y = 0;y < canvas.height/detail;y++){


            screenListZ[x][y] = new Complex(pixelToGrid(x*detail,y*detail));


            for(i = 0;i < iteration;i++){
                screenListZ[x][y] = executePolynomeal(screenListZ[x][y]).neg().div(derivative(screenListZ[x][y])).add(screenListZ[x][y]);
            }
            let smallIndex = 0;
            let smallestDist = Infinity;
            for(let i = 0;i < points.length;i++){
                let dist = distance(screenListZ[x][y], points[i])
                if(dist < smallestDist){
                    smallestDist = dist;
                    smallIndex = i;
                }
            }


            context.fillStyle = colors[smallIndex];
            context.fillRect(x*detail,y*detail,detail,detail);
            offscreenContext.fillStyle = colors[smallIndex];
            offscreenContext.fillRect(x*detail,y*detail,detail,detail);
        }
    }
   
    if(drawAxis){
        drawAxisLines();
    }
    for(let i = 0;i < points.length;i++){
        plotPoint(points[i], colors[i]);
    }
}


function colorMix(){
	return ("#" + ((Math.floor(Math.random()*(16**6+1)).toString(16)).padStart(6,"0")));
}


function drawAxisLines(){
    context.fillStyle = "blue";
    let x = (canvas.width/totX)*(-minX);
    context.fillRect(x,0,1,canvas.height);
    let y = (canvas.height/totY)*maxY;
    context.fillRect(0,y,canvas.width,1);
}


function derivative(num){
    let x1 = num;
    let x2 = num.sub(1e-9);
    let y1 = new Complex([1,0]);
    let y2 = new Complex([1,0]);
    for(let i = 0;i < points.length;i++){
        y1 = y1.mul(x1.sub(points[i]))
        y2 = y2.mul(x2.sub(points[i]))
    }
    return (y1.sub(y2)).div(x1.sub(x2));
}


function executePolynomeal(num){
    let fin = new Complex([1,0]);
    for(let i = 0;i < points.length;i++){
        fin = fin.mul(num.sub(points[i]));
    }
    return fin;
}


function distance(num,num2){
    return Math.sqrt((num.im-num2.im)**2 + (num.re-num2.re)**2);
}


function plotPoint(point,color){
    x = gridToPixel(point)[0];
    y = gridToPixel(point)[1];
    drawCircle(x,y,11,"white");
    drawCircle(x,y,9,"black");
    drawCircle(x,y,7,color);
}


function drawCircle(x,y,r,color){
    context.beginPath();
    context.fillStyle = color;
    context.arc(x,y,r,0,Math.PI*2,true);
    context.fill();
}


function pixelToGrid(x,y){
    return [x/(canvas.width/totX)+minX,(((-y+canvas.height)/(canvas.height/totY)+minY)*(canvas.height/canvas.width))];
}


function gridToPixel(point){
    return [(point.re-minX)*(canvas.width/totX),-((point.im/(canvas.height/canvas.width)-minY)*(canvas.height/totY)-canvas.height)];
}


window.addEventListener('contextmenu', function(e){
    e.preventDefault();
});


window.onmousedown = function(e){
    dragging = true;
    let pointFound = false;
    for(let i = 0;i < points.length;i++){
        if(e.clientX < gridToPixel(points[i])[0] + 11 && e.clientX > gridToPixel(points[i])[0] - 11 && e.clientY < gridToPixel(points[i])[1] + 11 && e.clientY > gridToPixel(points[i])[1] - 11){
            wichPointInFocus = i;
            pointFound = true;
        }
    }
    if(pointFound === false){
        wichPointInFocus = NaN;
    }
}


window.onmouseup = function(e){
    dragging = false;
    wichPointInFocus = NaN;
    console.log(points);
}


window.onmousemove = function(e){
    if(dragging === true && wichPointInFocus !== NaN){
        points[wichPointInFocus] = new Complex(pixelToGrid(e.clientX,e.clientY));
        restore();
        for(let i = 0;i < points.length;i++){
            plotPoint(points[i],colors[i]);
        }
    }
};


function restore(){
    context.drawImage(offscreenCanvas,0,0);


    if(drawAxis){
        drawAxisLines();
    }
}


window.onkeydown = function(e){
    if(e.code = "enter"){
        draw();
    }
}


draw(736,571);









