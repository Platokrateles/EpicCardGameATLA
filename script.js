let universalSelector = document.querySelector("*");
let body = document.querySelector("body");

let timeDisplayer = document.querySelector(".timeDisplay");
let movesDisplayer = document.querySelector(".movesDisplay");
let mainContainer = document.querySelector(".mainContainer");
let menu = document.querySelector(".menu");

let playBtn = document.querySelector(".play");
let quitBtn = document.querySelector(".quit");

let card = document.querySelector(".card");
let cards = document.querySelectorAll(".card");
let cardsArray = Array.prototype.slice.call(cards);
let cardsGraphicsMapped = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14];
let isCardFlippableMapped = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
// 0 - is blocked 1 - is flippable
let isReverseOrObverseMapped = ['r', 'r', 'r', 'r', 'r', 'r', 'r',
                                'r', 'r', 'r', 'r', 'r', 'r', 'r',
                                'r', 'r', 'r', 'r', 'r', 'r', 'r',
                                'r', 'r', 'r', 'r', 'r', 'r', 'r'];

let firstChosenCard = 'noCard', secondChosenCard = 'noCard'; 

const timeForWatchingInitialCardSetup = 15600;

let movesCounter = 0;
let remainTime;

async function main()
{
    movesCounter = 0;
    flippedAllCardsToStartPosition();

    body.style.background = 'url("Graphics/board.png")';
    mainContainer.style.display = "flex";
    menu.style.display = "none";

    playBtn.addEventListener("click", playAgain);
    quitBtn.addEventListener("click", quitGame);

    const maxTime = 120;
    let arraySum = 1000000;

    remainTime = maxTime;
    timeDisplayer.textContent = remainTime/* + 's'*/;
    movesDisplayer.textContent = movesCounter/* + 'c'*/;

    setCardsBackground();

    turnAllCards(200);
    await sleep(timeForWatchingInitialCardSetup);
    turnAllCards(200);
    await sleep(timeForWatchingInitialCardSetup - 10000);
    addCardsEventListeners();
    universalSelector.style.cursor = "default";

    startTimer(maxTime);

    while(remainTime >= 0 && arraySum > 0)
    {
        await sleep(1000);
        //console.log(`first: ${firstChosenCard}`);
        //console.log(`second: ${secondChosenCard}`);
        compareChosenCards();
        arraySum = isCardFlippableMapped.reduce(function(a, b, index, arr) {return a + b});
        console.log(arraySum);
    }
    await sleep(2000);
    body.style.background = 'url("Videos&Animations/backgroundZukoFinalSecondResize.gif")';
    mainContainer.style.display = "none";
    menu.style.display = "flex";
}

async function sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec));
}

async function startTimer(timeInSec)
{
    for(let i = 0; i <= timeInSec; i++)
    {
        timeDisplayer.textContent = remainTime/* + 's'*/;
        remainTime--;
        await sleep(1000);
    }
    return;
}

function createAudio()
{
    var source = "Music/CaveJivinAvatarTheLastAirbenderOriginalOST.mp3"
    var audio = document.createElement("audio");
    //
    audio.autoplay = true;
    audio.loop = true;
    //
    audio.load()
    audio.addEventListener("load", function() { 
        audio.play(); 
    }, true);
    audio.src = source;
}

function shuffle(array)
{
    let currIndex = array.length;
    let randIndex;

    while(currIndex > 0)
    {
        randIndex = Math.floor(Math.random() * (array.length - 1));
        currIndex--;

        [array[currIndex], array[randIndex]] = [array[randIndex], array[currIndex]];
    }
    return array;
}

async function flipCard(e)
{
    if(e.target !== undefined)
    {
        let cardIndex = cardsArray.indexOf(e.target.parentNode);
        if(isCardFlippableMapped[cardIndex] == false)
            return;

        if(firstChosenCard === 'noCard')
            firstChosenCard = e.target.parentNode;
        else if(firstChosenCard !== 'noCard' && secondChosenCard === 'noCard')
            secondChosenCard = e.target.parentNode;
        else if(firstChosenCard !== 'noCard' && secondChosenCard !== 'noCard')
            return;
        
        if(e.target.className.includes("reverse") || e.target.className.includes("obverse"))
        {
            e.target.parentNode.classList.toggle('is-flipped');
            movesCounter++
            movesDisplayer.textContent = movesCounter/* + 'c'*/;
            
            if(isReverseOrObverseMapped[cardIndex] === 'r')
                isReverseOrObverseMapped[cardIndex] = 'o'
            else
                isReverseOrObverseMapped[cardIndex] = 'r';
            
            return;
        }
    }
    
    if(e.className.includes("card"))
    {
        let cardIndex = cardsArray.indexOf(e);
        e.classList.toggle('is-flipped');

        if(isReverseOrObverseMapped[cardIndex] === 'r')
            isReverseOrObverseMapped[cardIndex] = 'o'
        else
            isReverseOrObverseMapped[cardIndex] = 'r';
    }
};

function setCardsBackground()
{
    cardsGraphicsMapped = shuffle(cardsGraphicsMapped);

    for(let i = 0; i < cardsGraphicsMapped.length; i++)
    {
        cards[i].children[1].style.backgroundImage = `url("Graphics/${cardsGraphicsMapped[i]}.png")`;
    }
}

function addCardsEventListeners()
{
    for(const card of cards)
        card.addEventListener("click", flipCard);
}

function deleteCardsEventListeners()
{
    for(const card of cards)
        card.removeEventListener("click", flipCard);
}

async function turnAllCards(delay)
{
    for(const card of cards)
    {
        flipCard(card);
        await sleep(delay);
    }
}

async function compareChosenCards()
{
    if(firstChosenCard !== 'noCard' && secondChosenCard !== 'noCard')
    {
        let x1 = cardsArray.indexOf(firstChosenCard);
        let x2 = cardsArray.indexOf(secondChosenCard);
        console.log(x1 + " " + x2);
        if(cardsGraphicsMapped[x1] === cardsGraphicsMapped[x2])
        {
            isCardFlippableMapped[x1] = 0;
            isCardFlippableMapped[x2] = 0;
        }
        else
        {
            flipCard(firstChosenCard);
            flipCard(secondChosenCard);
        }
        await sleep(1000);
        firstChosenCard = 'noCard';
        secondChosenCard = 'noCard';
    }
} 

function quitGame()
{
    window.close();
}

function playAgain()
{
    for(let i = 0; i < isCardFlippableMapped.length; i++)
        isCardFlippableMapped[i] = 1;
    deleteCardsEventListeners();
    main();
}

function flippedAllCardsToStartPosition()
{
    for(let i = 0; i < cardsArray.length; i++)
    {
        if(isReverseOrObverseMapped[i] === 'o')
            flipCard(cardsArray[i]);
    }
}
//_________________________________________________________
//_________________________________________________________

createAudio();
main();