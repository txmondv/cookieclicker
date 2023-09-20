const invalidInputHTMLElement = document.getElementById('invalidInput')
const invalidInputToast = bootstrap.Toast.getOrCreateInstance(invalidInputHTMLElement)

const notEnoughCoinsHTMLElement = document.getElementById('notEnoughCoins')
const notEnoughCoinsToast = bootstrap.Toast.getOrCreateInstance(notEnoughCoinsHTMLElement)

jQuery(document).ready(function ($) {
    updateScore(0, false);
    let cookieFlipSpinning = false;

    // Coins Click handling
    $('#coin').on('click', function () {
        if (cookieFlipSpinning) {
            return;
        }

        let einsatzItem = document.getElementById('cookieFlipEinsatz');
        let einsatzValid = validateEinsatz(einsatzItem.value);

        let einsatz = Number(einsatzItem.value);
        let resultHTML = document.getElementById('resultDiv');

        if (!einsatzValid) {
            invalidInputToast.show()
            return;
        }

        if (!validateHasEnoughScore(Number(einsatz))) {
            notEnoughCoinsToast.show();
            return;
        }

        invalidInputToast.hide();
        notEnoughCoinsToast.hide();

        einsatzItem.value = "";
        resultHTML.textContent = "";

        var flipResult = Math.random();
        $('#coin').removeClass();
        setTimeout(function () {
            if (flipResult <= 0.5) {
                $('#coin').addClass('heads');
                cookieFlipSpinning = true;
                einsatz = einsatz * 2;
                setTimeout(() => {
                    // GEWONNEN
                    cookieFlipSpinning = false;
                    resultHTML.textContent = `Gewinn: ${einsatz} Cookies`;
                    updateScore(einsatz);
                }, 3000);
            }
            else {
                $('#coin').addClass('tails');
                cookieFlipSpinning = true;
                setTimeout(() => {
                    // VERLOREN
                    cookieFlipSpinning = false;
                    resultHTML.textContent = `Du hast leider ${einsatz} Cookies verloren!`;
                    updateScore(-einsatz)
                }, 3000)
            }
        }, 100);
    });
});

function updateScore(scoreToAdd, isAddingAction) {
    scoreToAdd = Number(scoreToAdd);

    localStorage.setItem('score', Number(localStorage.getItem('score')) + scoreToAdd);
    if (isAddingAction) {
        localStorage.setItem('totalCookies', Number(localStorage.getItem('totalCookies')) + scoreToAdd);
    }

    document.getElementById('cookies').textContent = Number(localStorage.getItem('score'));
    document.getElementById('totalCookies').textContent = Number(localStorage.getItem('totalCookies'));
}

function scheduleInMilliseconds() {
    updateScore(0, false);

    setTimeout(scheduleInMilliseconds, 1000);
}

scheduleInMilliseconds();

function validateEinsatz(einsatz) {
    try {
        einsatz = Number(einsatz);
    } catch {
        return false;
    }

    if (einsatz < 1) {
        return false;
    }

    return true;
}

function validateHasEnoughScore(neededScore) {
    let userScore = Number(localStorage.getItem('score'));

    if (neededScore <= userScore) {
        return true;
    } else {
        return false;
    }
}


var options = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function calculacteWinnings(inputField) {
    let einsatz = inputField.value;
    let einsatzValid = validateEinsatz(einsatz);

    if (!einsatzValid) {
        invalidInputToast.show()
        return;
    }

    if (!validateHasEnoughScore(Number(einsatz))) {
        notEnoughCoinsToast.show();
        return;
    }

    if (wheelSpinning) {
        return;
    }

    invalidInputToast.hide();
    notEnoughCoinsToast.hide();

    options = [];

    let i = 0;
    while (i < 16) {
        if (i % 2 == 0) {
            options.push(0);
        } else {
            options.push(einsatz * i);
        }

        i++
    }

    drawRouletteWheel();

}

var startAngle = 0;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;
let wheelSpinning = false;

var ctx;

document.getElementById("spin").addEventListener("click", spin);

function byte2Hex(n) {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
}

function RGB2Color(r, g, b) {
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem) {
    var phase = 0;
    var center = 128;
    var width = 127;
    var frequency = Math.PI * 2 / maxitem;

    red = Math.sin(frequency * item + 2 + phase) * width + center;
    green = Math.sin(frequency * item + 0 + phase) * width + center;
    blue = Math.sin(frequency * item + 4 + phase) * width + center;

    return RGB2Color(red, green, blue);
}

function drawRouletteWheel() {
    var canvas = document.getElementById("canvas");
    canvas.hidden = false;
    if (canvas.getContext) {
        var outsideRadius = 200;
        var textRadius = 160;
        var insideRadius = 125;

        ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, 500, 500);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;

        ctx.font = 'bold 12px Helvetica, Arial';

        for (var i = 0; i < options.length; i++) {
            var angle = startAngle + i * arc;
            //ctx.fillStyle = colors[i];
            ctx.fillStyle = getColor(i, options.length);

            ctx.beginPath();
            ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
            ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();

            ctx.save();
            ctx.shadowOffsetX = -1;
            ctx.shadowOffsetY = -1;
            ctx.shadowBlur = 0;
            ctx.shadowColor = "rgb(220,220,220)";
            ctx.fillStyle = "black";
            ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius,
                250 + Math.sin(angle + arc / 2) * textRadius);
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            var text = options[i];
            ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            ctx.restore();
        }

        //Arrow
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
        ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.fill();
    }
}

function spin() {
    let einsatz = document.getElementById('wheelOfCookies').value;
    let einsatzValid = validateEinsatz(einsatz);

    if (!einsatzValid) {
        invalidInputToast.show()
        return;
    }

    if (!validateHasEnoughScore(Number(einsatz))) {
        notEnoughCoinsToast.show();
        return;
    }

    notEnoughCoinsToast.hide();

    if (wheelSpinning) {
        return;
    }

    updateScore(-einsatz, false);

    spinAngleStart = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3 + 4 * 1700;
    rotateWheel();
}

function rotateWheel() {
    spinTime += 30;
    wheelSpinning = true;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    drawRouletteWheel();
    spinTimeout = setTimeout('rotateWheel()', 30);
}

function stopRotateWheel() {
    clearTimeout(spinTimeout);
    var degrees = startAngle * 180 / Math.PI + 90;
    var arcd = arc * 180 / Math.PI;
    var index = Math.floor((360 - degrees % 360) / arcd);
    ctx.save();
    ctx.font = 'bold 30px Helvetica, Arial';
    var text = options[index]
    ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
    updateScore(Number(text), true);
    ctx.restore();
    wheelSpinning = false;
}

function easeOut(t, b, c, d) {
    var ts = (t /= d) * t;
    var tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}

function exchangeCoins() {
    let cookieExchangeInput = document.getElementById('cookieExchangeInput');
    let input = cookieExchangeInput.value;

    let einsatzValid = validateEinsatz(input);

    if (!einsatzValid) {
        invalidInputToast.show()
        return;
    }

    let abzug = input * 1000000;

    if (!validateHasEnoughScore(Number(abzug))) {
        notEnoughCoinsToast.show();
        return;
    }

    updateScore(-abzug, false);

    invalidInputToast.hide();
    notEnoughCoinsToast.hide();

    localStorage.setItem('bank', Number(localStorage.getItem('bank')) + Number(input));
    cookieExchangeInput.value = "";

    window.location.reload();
}
