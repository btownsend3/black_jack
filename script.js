//Creates the deck
var makeDeck = function () {
  var suits = ["S", "D", "C", "H"];
  var nums = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  var values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
  var deck = [];
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < values.length; j++) {
      var card = {Number: nums[j], Suit: suits[i], Image: 'images/' + nums[j] + suits[i] + '.jpg', Value: values[j]};
      deck.push(card);
    }
  }
  return deck;
}

//Shuffles the deck
var shuffle = function (array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); 
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

//Global variables shuffled deck, dealer and player hands/bankroll
var shuffledDeck = shuffle(makeDeck());
var dealerHand = [];
var playerHand = [];
var playerTotal = 0;
var dealerTotal = 0;
var playerBankroll = 500;
var betSize = 0;
var message = '';
document.getElementById('bankroll').innerHTML = 'Bankroll: $' + playerBankroll;
document.getElementById('bet').innerHTML = 'Bet: $' + betSize;

//Deals the cards
var deal = function () {
  if (shuffledDeck.length < 12) {
    shuffledDeck = shuffle(makeDeck());
  }
  playerHand = [];
  dealerHand = [];
  message = '';
  document.getElementById('one').disabled = true;
  document.getElementById('five').disabled = true;
  document.getElementById('twenty').disabled = true;
  document.getElementById('fifty').disabled = true;
  document.getElementById('clear').disabled = true;
  document.getElementById('x2').disabled = true;
  document.getElementById('hit').disabled = false;
  document.getElementById('stand').disabled = false;
  document.getElementsByClassName('card').src = '';
  document.getElementById('deal').disabled = true;
  document.getElementById('message').innerHTML = message;
  document.getElementById('playerCard3').src = '';
  document.getElementById('playerCard4').src = '';
  document.getElementById('playerCard5').src = '';
  document.getElementById('playerCard6').src = '';
  document.getElementById('playerCard7').src = '';
  document.getElementById('dealerCard3').src = '';
  document.getElementById('dealerCard4').src = '';
  document.getElementById('dealerCard5').src = '';
  document.getElementById('dealerCard6').src = '';
  document.getElementById('dealerCard7').src = '';
  playerHand.push(shuffledDeck[0]);
  shuffledDeck.shift();
  dealerHand.push(shuffledDeck[0]);
  shuffledDeck.shift();
  playerHand.push(shuffledDeck[0]);
  shuffledDeck.shift();
  dealerHand.push(shuffledDeck[0]);
  shuffledDeck.shift();
  document.getElementById('playerCard1').src = playerHand[0].Image;
  document.getElementById('playerCard2').src = playerHand[1].Image;
  document.getElementById('dealerCard1').src = 'images/Red_back.jpg';
  document.getElementById('dealerCard2').src = dealerHand[1].Image;
  playerTotal = playerHand[0].Value + playerHand[1].Value;
  dealerTotal = dealerHand[0].Value + dealerHand[1].Value;
  //Check for blackjack
  if (playerHand.length == 2 && playerTotal == 21 && dealerTotal != 21) {
    message = 'Player black jack';
    playerBankroll += betSize * 1.5;
    document.getElementById('bankroll').innerHTML = 'Bankroll: ' + playerBankroll;
    document.getElementById('message').innerHTML = message;
    document.getElementById('hit').disabled = true;
    document.getElementById('stand').disabled = true;
    document.getElementById('deal').disabled = false;
  } else if (dealerHand.length== 2 && dealerTotal == 21 && playerTotal != 21) {
    message = 'Dealer black jack';
    playerBankroll -= betSize;
    document.getElementById('bankroll').innerHTML = 'Bankroll: ' + playerBankroll;
    document.getElementById('message').innerHTML = message;
    document.getElementById('hit').disabled = true;
    document.getElementById('stand').disabled = true;
    document.getElementById('deal').disabled = false;
    document.getElementById('dealerCard1').src = dealerHand[0].Image;
  }
  console.log(playerTotal, dealerTotal);
  return [playerHand, dealerHand];
}

//Draws a card for the player
var hit = function () {
  //Changes value of ace to 1 if it would bust playerHand
  if (shuffledDeck[0].Value == 11 && playerTotal + 11 > 21) {
    shuffledDeck[0].Value = 1;
  } 
  playerHand.push(shuffledDeck[0]);
  shuffledDeck.shift();
  switch (playerHand.length) {
      case 3:
        document.getElementById('playerCard3').src = playerHand[2].Image;
        playerTotal += playerHand[2].Value;
        break;
      case 4:
        document.getElementById('playerCard4').src = playerHand[3].Image;
        playerTotal += playerHand[3].Value;
        break;
      case 5:
        document.getElementById('playerCard5').src = playerHand[4].Image;
        playerTotal += playerHand[4].Value;
        break;
      case 6:
        document.getElementById('playerCard6').src = playerHand[5].Image;
        playerTotal += playerHand[5].Value;
        break;
      case 7:
        document.getElementById('playerCard7').src = playerHand[6].Image;
        playerTotal += playerHand[6].Value;
        break;
  }
  for (let i = 0; i < playerHand.length; i++) {
    if (playerHand[i].Value == 11) {
      if (playerTotal > 21) {
        playerHand[i].Value = 1;
        playerTotal -= 10;
      }
    }
    console.log(playerTotal);
  }
  if (playerTotal > 21) {
    message = 'Player bust';
    document.getElementById('message').innerHTML = message;
    document.getElementById('hit').disabled = true;
    document.getElementById('stand').disabled = true;
    win();
  }
  return playerTotal;
}

//Increases the current bet amount
var bet = function (amount) {
  if (betSize + amount <= playerBankroll) {
  betSize += amount;
  document.getElementById('bet').innerHTML = 'Bet: $' + betSize;
  }
}

//Resets the bet amount to zero
var clearBet = function () {
  betSize = 0;
  document.getElementById('bet').innerHTML = 'Bet: $' + betSize;
}
var doubleBet = function () {
  betSize *= 2;
  document.getElementById('bet').innerHTML = 'Bet: $' + betSize;
}

//Determins winner of the round
var win = function () {
  if (dealerTotal === playerTotal) {
    message = 'Push';
  } else if (playerTotal > 21) {
    message = 'Player bust';
    playerBankroll -= betSize;
  } else if (dealerTotal > 21) {
    message = 'Dealer bust';
    playerBankroll += betSize;
  } else if (dealerTotal > playerTotal) {
    message = 'Dealer wins';
    playerBankroll -= betSize;
  } else if (dealerTotal < playerTotal) {
    message = 'Player wins';
    playerBankroll += betSize;
  }
  document.getElementById('one').disabled = false;
  document.getElementById('five').disabled = false;
  document.getElementById('twenty').disabled = false;
  document.getElementById('fifty').disabled = false;
  document.getElementById('clear').disabled = false;
  document.getElementById('x2').disabled = false;
  document.getElementById('message').innerHTML = message;
  document.getElementById('deal').disabled = false;
  document.getElementById('bankroll').innerHTML = 'Bankroll: ' + playerBankroll;
}

//The dealer will hit to 17
var dealerPlay = function () {
  document.getElementById('dealerCard1').src = dealerHand[0].Image;
  dealerTotal = dealerHand[0].Value + dealerHand[1].Value;
  while (dealerTotal < 17) {
    //Changes value of ace to 1 if it would bust dealerHand
    if (shuffledDeck[0].Value == 11 && dealerTotal + 11 >= 21) {
      shuffledDeck[0].Value = 1;
    }
    dealerHand.push(shuffledDeck[0]);
    shuffledDeck.shift();
    switch (dealerHand.length) {
      case 3:
        document.getElementById('dealerCard3').src = dealerHand[2].Image;
        dealerTotal += dealerHand[2].Value;
        break;
      case 4:
        document.getElementById('dealerCard4').src = dealerHand[3].Image;
        dealerTotal += dealerHand[3].Value;
        break;
      case 5:
        document.getElementById('dealerCard5').src = dealerHand[4].Image;
        dealerTotal += dealerHand[4].Value;
        break;
      case 6:
        document.getElementById('dealerCard6').src = dealerHand[5].Image;
        dealerTotal += dealerHand[5].Value;
        break;
      case 7:
        document.getElementById('dealerCard7').src = dealerHand[6].Image;
        dealerTotal += dealerHand[6].Value;
        break;
    }
    for (let i = 0; i < dealerHand.length; i++) {
      if (dealerHand[i].Value == 11) {
        if (dealerTotal > 21) {
          dealerHand[i].Value = 1;
          dealerTotal -= 10;
        }
      }
    }   
  }
  console.log(dealerTotal);
  win();
}