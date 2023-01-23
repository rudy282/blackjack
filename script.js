const shuffleButton = document.querySelector('#shuffle_button');
const hitButton = document.querySelector('#hit_button');
const game_status = document.querySelector('#game_status');
const startButton = document.querySelector('#start_game');
const pass_button = document.querySelector('#pass_button');
const restart_button = document.querySelector('#restart_button');
const bet_value = document.querySelector('#bet_value');
const player_balance = document.querySelector('#player_balance');
const bet_accept_button = document.querySelector('#bet_accept_button');
const start_first_game = document.querySelector('#start_first_game');

var deck = new Array;

//deck.push(new Card('kA', "img/cards/kA", null));
class Card
{
    constructor(name, path, cost)
    {
        this.name = name;
        this.path = path;
        this.cost = cost;
    }
}

class User
{
    constructor(points, aceBool, hand, points_handler, img_handler)
    {
        this.points = points;
        this.aceBool = aceBool;
        this.hand = hand;
        this.points_handler = points_handler;
        this.img_handler = img_handler;
    }
}

var player = new User(0, false, [], document.querySelector('#players_points'), document.querySelector("#img_players_cards"));
var dealer = new User(0, false, [], document.querySelector('#dealers_points'), document.querySelector("#img_dealers_cards"));

var usedDeck = new Array;
var ace = false; //defines if player got an ace
var gameStarted = false;
var dealerRound = 1;
var playerBalance = 1000;
bet_value.value = null;
var betValue = 0;

var firstGame = true;

player_balance.innerHTML = playerBalance;

hitButton.addEventListener('click', hit);
hitButton.style.display = "none";
pass_button.addEventListener('click', pass);
pass_button.style.display = "none";

bet_accept_button.addEventListener('click', takeBet);

start_first_game.addEventListener('click', startFirstGame);

startButton.style.display = "none";
startButton.addEventListener('click', startGame);
restart_button.style.display = "none";
restart_button.addEventListener('click', gameRestart);

start_first_game.disabled = true;

var cardGroup = ["k", "ka", "t", "p"];
var cardName = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
var cardPathGroup = ["kier", "karo", "trefl", "pik"];
var cardCost = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, null];
let k = 0;
let indexer = 0;
while (k < 1)//adding card
{
    for (let i = 0; i < cardGroup.length; i++)
        for (let j = 0; j < cardName.length; j++)
        {
            deck[indexer] = new Card(cardGroup[i] + cardName[j], "img/cards/" + cardPathGroup[i] + "/" + cardGroup[i] + cardName[j] + ".png", cardCost[j]);
            indexer++;
        }
    k++;
}

player.points_handler.innerHTML = '';

function shuffleDeck()
{
    for (let i = deck.length - 1; i > 0; i--)
    {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function hit()
{
    addCardToHand(true, false, player);
    addCardToHandAce(player, true);
    if (player.aceBool && player.points > 21 && player.points + 10 != 21)
    {
        player.points -= 10;
        player.aceBool = false;
        player.points_handler.innerHTML = player.points;
    }

    if (player.points > 21)
    {
        endGame();
    }

    if (deck.length < 5) //automatyczne tasowniae gdy zostanie 5 kart
    {
        shuffleCards();
    }
}

function gameRestart()
{
    clearHand();
    gameStarted = false;
    player.aceBool = false;
    dealer.aceBool = false;
    dealerRound = 1;
    bet_value.value = null;
    restart_button.style.display = "none";
    startButton.style.display = "";
    startButton.disabled = true;
    dealer.img_handler.innerHTML = "";
    player.img_handler.innerHTML = "";
}


function completeDeck()
{
    for (let i = 0; i < usedDeck.length; i++)
    {
        deck.push(usedDeck[i]);
    }
    clearArray(usedDeck);
}

function shuffleCards()
{
    completeDeck()
    shuffleDeck();
}

function addCardToHandAce(user, public)
{
    if (!ace) return;

    ace = false;
    user.points++;
    if (user.points + 10 <= 21)
    {
        user.points += 10;
        user.aceBool = true;
    }
    if (public) user.points_handler.innerHTML = user.points;

}

function clearHand()
{
    clearArray(player.hand);
    clearArray(dealer.hand);
    player.points = 0;
    dealer.points = 0;
    player.points_handler.innerHTML = '';
    dealer.points_handler.innerHTML = '';
    game_status.innerHTML = 'Podaj stawkę';
}

function clearArray(arr) //clears whole array
{
    arr.splice(0, arr.length);
}


function startGame()
{
    if (gameStarted) return;

    game_status.innerHTML = "Gra trwa!";
    gameStarted = true;

    if (firstGame == true)
    {
        firstGame = false;
        start_first_game.style.display = "none";
    }

    hit();
    dealerHit();
    hit();
    dealerHit();

    startButton.style.display = "none";
    hit_button.style.display = "";
    pass_button.style.display = "";
}


function dealerHit()
{
    if (dealerRound == 2)
    {
        addCardToHand(false, true, dealer);
        addCardToHandAce(dealer, false);
    }
    else
    {
        addCardToHand(true, true, dealer);
        addCardToHandAce(dealer, true);
    }

    if (dealer.aceBool && dealer.points > 21)
    {
        dealer.points -= 10;
        dealer.aceBool = false;
    }
}

function addCardToHand(public, isDealer, user)
{
    lastCard = deck.pop();
    usedDeck.push(lastCard);
    user.hand.push(lastCard);
    if (lastCard.cost != null)
        user.points += lastCard.cost;
    else ace = true;

    if (public)
    {
        user.points_handler.innerHTML = user.points;
        addCardImage(lastCard, user.img_handler);
    }

    if (isDealer)
        dealerRound++;
}

function pass()
{
    showPrivateCard();
    while (dealer.points < player.points)
    {
        if (dealer.points == player.points && player.points > 10 || dealer.points == 21)
        {
            break;
        }
        dealerHit();
    }
    endGame();
}


function showPrivateCard()
{
    dealer.points_handler.innerHTML = dealer.points;
    dealer.img_handler.innerHTML = '';
    for (let i = 0; i < dealer.hand.length; i++)
    {
        addCardImage(dealer.hand[i], dealer.img_handler);
    }
}

function endGame()
{
    if (dealer.points > 21)
    {
        game_status.innerHTML = "Wygrałeś";
        playerBalance += betValue;

    }
    else if (dealer.points == player.points && dealer.points <= 21 && player.points <= 21)
    {
        game_status.innerHTML = "Remis!";
    }
    else if (dealer.points > player.points && dealer.points <= 21 && player.points <= 21)
    {
        game_status.innerHTML = "Przegrałeś!";
        playerBalance -= betValue;

    }
    else if (dealer.points < player.points && dealer.points <= 21 && player.points <= 21)
    {
        game_status.innerHTML = "Wygrałeś!";
        playerBalance += betValue;
    }
    else if (player.points > 21)
    {
        game_status.innerHTML = "Przegrałeś!";
        playerBalance -= betValue;
    }
    player_balance.innerHTML = playerBalance;
    hitButton.style.display = "none";
    pass_button.style.display = "none";
    restart_button.style.display = "";
    betValue = null;
    showPrivateCard();
}

function takeBet()
{
    betValue = parseInt(bet_value.value);
    if (betValue == null || betValue > playerBalance || isNaN(betValue) || betValue <= 0)
    {
        gameStarted = false;
        game_status.innerHTML = "ta stawka jest niepoprawna"
    }
    else 
    {
        start_first_game.disabled = false;
        startButton.disabled = false;
        game_status.innerHTML = "Zacznij grę";
    }
}

function startFirstGame()
{
    shuffleCards();
    startGame();
    hitButton.style.display = "";
    pass_button.style.display = "";
    game_status.innerHTML = "Gra trwa!";
}

function addCardImage(card, handler)
{
    handler.innerHTML += `<img src="${card.path}" class="cards">`;
}