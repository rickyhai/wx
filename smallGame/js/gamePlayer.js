/**
 * Created by zhulinhai on 17/9/26.
 */
var carImg = null,
    carDestroyImg = null,
    hammerImg = null,
    boomImg = null,
    roadImg = null,
    scaleRate = 1,
    gameCanvas = null,
    gameCtx = null;
var gamePlayer = {
    gameInterval: -1,
    timerInterval: -1,
    carPosX: 0,
    hammerPosX: 0,
    hammerPosY: 0,
    isGameOver: false,
    isDragHammer: false,
    isBackWard: false,
    hammerRect: null,
    carRect: null,
    init: function () {
        this.fixSize();
    },
    fixSize: function () {
        $('.canvasBox').height($('.scene').height() - 9 * 20 * document.documentElement.clientWidth / 375);
    },
    restartGame: function () {
        gamePlayer.isDragHammer = false;
        gamePlayer.isGameOver = false;
        $('.time').html("30S'");
        gamePlayer.startGame();
    },
    destroy: function () {
        clearInterval(gamePlayer.gameInterval);
        gamePlayer.gameInterval = -1;
        clearInterval(gamePlayer.timerInterval);
        gamePlayer.timerInterval = -1;
        gameCanvas.removeEventListener(STA_EN,start,false);
        gameCanvas.removeEventListener(MV_EV,move,false);
        gameCanvas.removeEventListener(END_EV,end,false);
    },
    startGame: function () {
        carImg = new Image();
        carImg.src = 'images/1-car.png';
        carDestroyImg = new Image();
        carDestroyImg.src = 'images/1-car-destroy.png';
        hammerImg = new Image();
        hammerImg.src = 'images/1-hammer.png';
        boomImg = new Image();
        boomImg.src = 'images/1-boom.png';
        roadImg = new Image();
        roadImg.src = 'images/1-road.png';

        var $canvasBox = $('.canvasBox');
        var canvas = document.getElementById('gameCanvas');
        canvas.width = $canvasBox.width();
        canvas.height = $canvasBox.height();
        var ctx = canvas.getContext('2d');
        var ratio = toolHelper.getPixelRatio(ctx);
        canvas.style.height = canvas.height + 'px';
        canvas.style.width = canvas.width + 'px';
        canvas.width *= ratio;
        canvas.height *= ratio;

        scaleRate = canvas.width / 710;
        gamePlayer.hammerPosY =  - hammerImg.height * scaleRate/2;
        gamePlayer.gameInterval = setInterval(function () {
            ctx.clearRect(0,0, canvas.width, canvas.height);
            if (!gamePlayer.isGameOver) {
                gamePlayer.drawRoad(ctx, canvas.width, canvas.height);
                gamePlayer.drawCar(ctx, canvas.width, canvas.height);
                gamePlayer.drawHammer(ctx, canvas.width, canvas.height);
            } else {
                gamePlayer.destroy();
                clearInterval(gamePlayer.gameInterval);
                gamePlayer.gameInterval = -1;
                clearInterval(gamePlayer.timerInterval);
                gamePlayer.timerInterval = -1;
            }
        }, 30);

        var count = 30;
        gamePlayer.timerInterval = setInterval(function () {
            if (--count < 0) {
                gamePlayer.isGameOver = true;
                gamePlayer.destroy();
                // 游戏时间结束
                $('#tipFailDialog').show();
            } else {
                // 更新时间
                $('.time').html(count +"S'");
            }
        }, 1000);

        gameCanvas = canvas;
        gameCtx = ctx;
        canvas.addEventListener(STA_EN,start,false);
        canvas.addEventListener(MV_EV,move,false);
        canvas.addEventListener(END_EV,end,false);
    },
    stopGame: function (ctx, maxW, maxH) {
        var carPosY = maxH - (roadImg.height + carDestroyImg.height) * scaleRate;
        ctx.clearRect(0,0, maxW, maxH);
        gamePlayer.drawRoad(ctx, maxW, maxH);
        ctx.drawImage(carDestroyImg, gamePlayer.carPosX, carPosY, carDestroyImg.width * scaleRate, carDestroyImg.height * scaleRate);

        // 计算压到车子的锤子状态
        var hammerH = hammerImg.height * scaleRate;
        var hammerTop =  - (carDestroyImg.height/2 + roadImg.height)* scaleRate - (hammerH - maxH);
        ctx.drawImage(hammerImg, gamePlayer.hammerPosX,  hammerTop, hammerImg.width * scaleRate, hammerImg.height * scaleRate);
        ctx.drawImage(boomImg, gamePlayer.carPosX - boomImg.width * scaleRate/4, carPosY - boomImg.height * scaleRate/2, boomImg.width * scaleRate, boomImg.height * scaleRate);

        gamePlayer.destroy();
    },
    drawCar: function (ctx, maxW, maxH) {
        if (gamePlayer.isBackWard) {
            gamePlayer.carPosX -= 10;
        } else {
            gamePlayer.carPosX += 10;
        }

        var imgW = carImg.width * scaleRate;
        var imgH = carImg.height * scaleRate;
        if (gamePlayer.carPosX > maxW - imgW) {
            carImg.src = 'images/1-carBack.png';
            gamePlayer.isBackWard = true;
        } else if (gamePlayer.carPosX< 0) {
            carImg.src = 'images/1-car.png';
            gamePlayer.isBackWard = false;
        }
        var top = maxH - (roadImg.height + carImg.height) * scaleRate;
        ctx.drawImage(carImg, gamePlayer.carPosX, top, imgW, imgH);
        gamePlayer.carRect = {'top': top, 'left': gamePlayer.carPosX, 'w': imgW, 'h': imgH};
    },
    drawHammer: function (ctx, maxW, maxH) {
        if (!gamePlayer.isDragHammer) {
            gamePlayer.hammerPosX += 5;
        }

        if (gamePlayer.hammerPosX > maxW) {
            gamePlayer.hammerPosX = 0;
        }
        var imgW = hammerImg.width * scaleRate;
        var imgH = hammerImg.height * scaleRate;
        ctx.drawImage(hammerImg, gamePlayer.hammerPosX, gamePlayer.hammerPosY, imgW, imgH);
        gamePlayer.hammerRect = {'top': gamePlayer.hammerPosY, 'left': gamePlayer.hammerPosX, 'w': imgW, 'h': imgH};
    },
    drawRoad: function (ctx, maxW, maxH) {
        var imgW = roadImg.width * scaleRate;
        var imgH = roadImg.height * scaleRate;
        ctx.drawImage(roadImg, 0, maxH - imgH, maxW, imgH);
    },
    hitCheck: function (offY) {
        var hammerH = gamePlayer.hammerPosY + offY + gamePlayer.hammerRect.h;
        if (hammerH > gamePlayer.carRect.top) {
            if ( gamePlayer.hammerPosX > gamePlayer.carRect.left && gamePlayer.hammerPosX < (gamePlayer.carRect.left + gamePlayer.carRect.w)) {
                gamePlayer.stopGame(gameCtx, gameCanvas.width, gameCanvas.height);
                setTimeout(function () {
                    $('#tipSuccessDialog').show();
                }, 200);
            }
        } else {
            gamePlayer.hammerPosY += offY;
            gamePlayer.hammerPosY = Math.min(gamePlayer.carRect.top, gamePlayer.hammerPosY);
        }

    },
    checkDragHammer: function (x, y) {
        // 是否可以拖动
        var rect = gamePlayer.hammerRect;
        if (x > rect.left && x < (rect.left + rect.w) && y > rect.top && y < (rect.top + rect.h)) {
            bStart = 1;
            gamePlayer.isDragHammer = true;
        }
    }
};
gamePlayer.init();

// 移动相册的动作
var hasTouch = 'ontouchstart' in window;
var STA_EN = hasTouch ? "touchstart" : "mousedown",
    MV_EV = hasTouch ? "touchmove":"mousemove",
    END_EV = hasTouch ? "touchend" : "mouseup",
    END_Cancel = hasTouch ? "touchcancel" : "mouseout";
var bStart = 0;
var beginX,beginY,startX = 0,startY = 0;
function start(ev){
    ev.preventDefault();
    var touches = ev.touches;
    var poi= toolHelper.windowToCanvas(gameCanvas,ev.clientX || ev.pageX || touches[0].clientX,ev.clientY || ev.pageY || touches[0].clientY);
    beginX = poi.x;
    beginY = poi.y;
    gamePlayer.checkDragHammer(beginX, beginY);
}

function move(ev){
    ev.preventDefault();
    if(bStart === 0)return;
    var touches = ev.touches;
    var poi = toolHelper.windowToCanvas(gameCanvas,ev.clientX || ev.pageX || touches[0].clientX,ev.clientY || ev.pageY || touches[0].clientY);
    var offsetX = poi.x - beginX,
        offsetY = poi.y - beginY;
    gamePlayer.hitCheck(offsetY);
    beginX = poi.x;
    beginY = poi.y;
}

function end (ev) {
    ev.preventDefault();
    bStart = 0;
    gamePlayer.isDragHammer = false;
    gamePlayer.hammerPosY =  - hammerImg.height * scaleRate/2;
}