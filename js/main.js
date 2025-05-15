/***************************/
/* Exercise 2 - Touch Nums */
/***************************/
'use strict';

// Global Variables //
var gNextNum        = undefined;
var gStartTime      = undefined;
var gTimeInterval   = undefined; 
var gNumbers        = [];
const MILLI_SECONDS = 1000;

// Implementations //
function onInit() {
    resetGlobalVariables();
    renderButtons();
}

function resetGlobalVariables() {
    gNextNum = 1;
    gNumbers = [];
    if (gTimeInterval) clearInterval(gTimeInterval);

    const elVictory = document.querySelector('.victory-msg');
    if (elVictory) elVictory.remove();
}

function renderButtons() {
    const difficulties = [
        { label: 'Easy',    value: 16 },
        { label: 'Hard',    value: 25 },
        { label: 'Extreme', value: 36 }
    ];

    let strHTML = '<form>';

    for (let i = 0; i < difficulties.length; i++) {
        const currDiff = difficulties[i];
        strHTML += `
            <div class="radio-option">
                <input type="radio" name="difficulty" value="${currDiff.value}" ${i === 0 ? 'checked' : ''}>
                <label class="radio-label">
                    <span class="diff-label">${currDiff.label}</span> 
                    <span class="diff-value">(${currDiff.value})</span>
                </label>
            </div>`;
    }

    strHTML += `<button type="button" onclick="onNewGameClicked()" class="new-game-btn">New Game</button>`;
    strHTML += '</form>';

    const elGameSetup     = document.querySelector('.game-setup');
    elGameSetup.innerHTML = strHTML; 
}

function onNewGameClicked() {
    resetGlobalVariables();
	
	enableRadioButtons(); // Enable radio buttons again (For New Game) //
	
    const elSelected = document.querySelector('input[name="difficulty"]:checked');
    const boardSize  = +elSelected.value;
    
    const elBoard  = document.querySelector('.board');
	const elTopBar = document.querySelector('.top-bar');
	
    elBoard.classList.add('fade-out');
	elTopBar.classList.add('fade-out');

    setTimeout(resetAndBuildBoard, Math.floor(MILLI_SECONDS / 2), elTopBar, elBoard, boardSize);
}

function resetAndBuildBoard(elTopBar, elBoard, boardSize) {
    shuffleNumbers(boardSize);
    
    renderStats();
    renderBoard();

    elBoard.classList.remove('fade-out');
	elTopBar.classList.remove('fade-out');
	
    elBoard.classList.add('fade-in');
    elTopBar.classList.add('fade-in');

    setTimeout(() => {
        elBoard.classList.remove('fade-in');
		elTopBar.classList.remove('fade-in');
    }, Math.floor(MILLI_SECONDS / 2));
}

function disableRadioButtons() {
    const radioButtons = document.querySelectorAll('input[name="difficulty"]');
    radioButtons.forEach(btn => { 
		if (!btn.disabled) { // If radio button `enabled` convert to `disabled` //
			btn.disabled = true;
		}
	});
}

function enableRadioButtons() {
    const radioButtons = document.querySelectorAll('input[name="difficulty"]');
    radioButtons.forEach(btn => {
		if (btn.disabled) { // If radio button `disabled` convert to `enabled` //
			btn.disabled = false;
		}
	});
}

function shuffleNumbers(boardSize) {
    gNumbers = [];
    for (let i = 1; i <= boardSize; i++) {
        gNumbers.push(i);
    }

    // Shuffle //
    for (let i = gNumbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gNumbers[i], gNumbers[j]] = [gNumbers[j], gNumbers[i]];
    }
}

function renderStats() {
    const startTimer = 0.000;

    // Top Bar //
    let strHTML = `
        <div class="stat">
            <p class="stat-label">Current Number</p>
            <span class="current-number">${gNextNum}</span>
        </div>
        <div class="stat">
            <p class="stat-label">Time</p>
            <span class="timer">${startTimer} (sec)</span>
        </div>`;

    const elTopBar     = document.querySelector('.top-bar');
    elTopBar.innerHTML = strHTML; 
}

function renderBoard() {
    let strHTML     = '<tbody>';
    const rowLength = Math.floor(Math.sqrt(gNumbers.length));

    for (let i = 0; i < gNumbers.length; i++) {
        if (i % rowLength === 0) strHTML += '<tr>';
		const currNum = gNumbers[i];
        strHTML += `
			<td class="cell" onclick="onCellClicked(this, ${currNum})">
				${currNum}
			</td>`;
        if ((i + 1) % rowLength === 0) strHTML += '</tr>';
    }   
    
    strHTML += '</tbody>';

    const elBoard     = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function onCellClicked(elCell, currNum) {
    if (currNum === gNextNum) {
        if (gNextNum === 1) {
			disableRadioButtons(); // Disable Radio Buttons during the game //
			startTimer();
        }

        elCell.classList.add('inactive');
        updateNumber();

        if (gNextNum > gNumbers.length) {
            stopTimer();
            insertVictoryMsg();
			enableRadioButtons(); // Enable radio buttons again (For New Game) //
        }
    } else {
        elCell.classList.add('wrong');
        setTimeout(() => {
            elCell.classList.remove('wrong');
        }, Math.floor(MILLI_SECONDS / 4));
    }
}

function updateNumber() {
    gNextNum++;
    const elCurrNumber = document.querySelector('.current-number');
    if (gNextNum <= gNumbers.length) elCurrNumber.innerText = gNextNum;
}

function startTimer() {
	gStartTime    = Date.now();
    gTimeInterval = setInterval(updateTimer, MILLI_SECONDS / 50);
}

function updateTimer() {
    const diffTime     = Date.now() - gStartTime;
    const seconds      = (diffTime / MILLI_SECONDS).toFixed(3);
    const elTimer      = document.querySelector('.timer');
    elTimer.innerText  = seconds + ' (sec)'; 
}

function stopTimer() {
	clearInterval(gTimeInterval);
}

function insertVictoryMsg() {
    const elVictory = document.querySelector('.victory-msg');
    if (!elVictory) {
        const elMsg = document.createElement('p');
        elMsg.classList.add('victory-msg');
        elMsg.innerText = '🎉 You Won 🎉';

        const elContainer = document.querySelector('.game-container');
        elContainer.appendChild(elMsg);
    }
}