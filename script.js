//Creates the deck
var makeDeck = function () {
  var suits = ["S", "D", "C", "H"];
  var nums = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  var values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
  var counts = [-1, 1, 1, 1, 1, 1, 0, 0, 0, -1, -1, -1, -1];
  var deck = [];
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < values.length; j++) {
      var card = {Number: nums[j], Suit: suits[i], Count: counts[j], Image: 'images/' + nums[j] + suits[i] + '.jpg', Value: values[j]};
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
var cardCount = 0;
var showCount = false;
var canDoubleDown = true;
var canDeal = false;

//Dom cache
$('#count-toggle').html('Show Hi-Lo');
$('#bankroll').html('Bankroll: $' + playerBankroll);
$('#bet').html('Bet: $' + betSize);
$('#hit').hide();
$('#stand').hide();
$('#double-down').hide();

//Deals the cards
var deal = function () {
  canDoubleDown = true;
  if (shuffledDeck.length < 12) {
    shuffledDeck = shuffle(makeDeck());
    cardCount = 0;
  }
  playerHand = [];
  dealerHand = [];
  message = '';
  $('#one').prop('disabled', true);
  $('#five').prop('disabled', true);
  $('#twenty').prop('disabled', true);
  $('#fifty').prop('disabled', true);
  $('#clear').prop('disabled', true);
  $('#x2').prop('disabled', true);
  $('#hit').show();
  $('#stand').show();
  $('#double-down').show();
  $('.card').attr('src', '');
  $('#deal').hide();
  $('#message').html(message);
  $('#playerCard3').attr('src', '');
  $('#playerCard4').attr('src', '');
  $('#playerCard5').attr('src', '');
  $('#playerCard6').attr('src', '');
  $('#playerCard7').attr('src', '');
  $('#dealerCard3').attr('src', '');
  $('#dealerCard4').attr('src', '');
  $('#dealerCard5').attr('src', '');
  $('#dealerCard6').attr('src', '');
  $('#dealerCard7').attr('src', '');
  playerHand.push(shuffledDeck[0]);
  shuffledDeck.shift();
  dealerHand.push(shuffledDeck[0]);
  shuffledDeck.shift();
  playerHand.push(shuffledDeck[0]);
  shuffledDeck.shift();
  dealerHand.push(shuffledDeck[0]);
  shuffledDeck.shift();
  cardCount += dealerHand[1].Count + playerHand[0].Count + playerHand[1].Count;
  if (showCount) {
    $('#count').html('Hi-Lo: ' + cardCount);
  }
  $('#playerCard1').attr('src', playerHand[0].Image);
  $('#playerCard2').attr('src', playerHand[1].Image);
  $('#dealerCard1').attr('src', 'images/Red_back.jpg');
  $('#dealerCard2').attr('src', dealerHand[1].Image);
  playerTotal = playerHand[0].Value + playerHand[1].Value;
  dealerTotal = dealerHand[0].Value + dealerHand[1].Value;
  //Check for blackjack
  if (playerHand.length == 2 && playerTotal == 21 && dealerTotal != 21) {
    message = 'Player black jack';
    $('#one').prop('disabled', false);
    $('#five').prop('disabled', false);
    $('#twenty').prop('disabled', false);
    $('#fifty').prop('disabled', false);
    $('#clear').prop('disabled', false);
    $('#x2').prop('disabled', false);
    $('#deal').show();
    cardCount += dealerHand[0].Count;
    if (showCount) {
      count.innerHTML = 'Hi-Lo ' + cardCount;
    }
    playerBankroll += betSize * 1.5;
    $('#bankroll').html('Bankroll: $' + playerBankroll);
    $('#message').html(message);
    $('#hit').hide();
    $('#stand').hide();
    $('#deal').show();
  } else if (dealerHand.length== 2 && dealerTotal == 21 && playerTotal != 21) {
    message = 'Dealer black jack';
    $('#one').prop('disabled', false);
    $('#five').prop('disabled', false);
    $('#twenty').prop('disabled', false);
    $('#fifty').prop('disabled', false);
    $('#clear').prop('disabled', false);
    $('#x2').prop('disabled', false);
    dealDom.show();
    playerBankroll -= betSize;
    cardCount += dealerHand[0].Count;
    if (showCount) {
      $('#count').html('Hi-Lo ' + cardCount);
    }
    $('#bankroll').html('Bankroll: $' + playerBankroll);
    $('#message').html(message);
    $('#hit').hide();
    $('#stand').hide();
    $('#hit').show();
    $('#dealerCard1').attr('src', dealerHand[0].Image);
  } else if (dealerTotal == 21 && playerTotal == 21) {
    $('#one').prop('disabled', false);
    $('#five').prop('disabled', false);
    $('#twenty').prop('disabled', false);
    $('#fifty').prop('disabled', false);
    $('#clear').prop('disabled', false);
    $('#x2').prop('disabled', false);
    $('#deal').show();
    win();
    cardCount += dealerHand[0].Count;
    if (showCount) {
      $('#count').html('Hi-Lo ' + cardCount);
    }
  }
  return [playerHand, dealerHand];
}

//Ensures a bet is placed before dealing
var dealRequest = function () {
  if (betSize) {
    deal();
  } else {
    message = 'Place your bet';
    $('#message').html(message);
  }
}

//Draws a card for the player
var hit = function () {
  //Changes value of ace to 1 if it would bust playerHand
  canDoubleDown = false;
  $('#double-down').hide();
  if (shuffledDeck[0].Value == 11 && playerTotal + 11 > 21) {
    shuffledDeck[0].Value = 1;
  } 
  cardCount += shuffledDeck[0].Count;
  playerHand.push(shuffledDeck[0]);
  shuffledDeck.shift();
  if (showCount) {
      $('#count').html('Hi-Lo ' + cardCount);
    }
  switch (playerHand.length) {
      case 3:
        $('#playerCard3').attr('src', playerHand[2].Image);
        playerTotal += playerHand[2].Value;
        break;
      case 4:
        $('#playerCard4').attr('src', playerHand[3].Image);
        playerTotal += playerHand[3].Value;
        break;
      case 5:
        $('#playerCard5').attr('src', playerHand[4].Image);
        playerTotal += playerHand[4].Value;
        break;
      case 6:
        $('#playerCard6').attr('src', playerHand[5].Image);
        playerTotal += playerHand[5].Value;
        break;
      case 7:
        $('#playerCard7').attr('src', playerHand[6].Image);
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
  }
  if (playerTotal > 21) {
    message = 'Player bust';
    $('#message').html(message);
    $('#hit').hide();
    $('#stand').hide();
    win();
  }
  return playerTotal;
}

//Increases the current bet amount
var bet = function (amount) {
  if (betSize + amount <= playerBankroll) {
  betSize += amount;
  $('#bet').html('Bet: $' + betSize);
  }
}

//Resets the bet amount to zero
var clearBet = function () {
  betSize = 0;
  $('#bet').html('Bet: $' + betSize);
}
var doubleBet = function () {
  betSize *= 2;
  $('#bet').html('Bet: $' + betSize);
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
  $('#one').prop('disabled', false);
  $('#five').prop('disabled', false);
  $('#twenty').prop('disabled', false);
  $('#fifty').prop('disabled', false);
  $('#clear').prop('disabled', false);
  $('#x2').prop('disabled', false);
  $('#message').html(message);
  $('#hit').hide();
  $('#stand').hide();
  $('#bankroll').html('Bankroll: $' + playerBankroll);
  $('#double-down').hide();
  $('#deal').show();
}

//The dealer will hit to 17
var dealerPlay = function () {
  $('#dealerCard1').attr('src', dealerHand[0].Image);
  dealerTotal = dealerHand[0].Value + dealerHand[1].Value;
  cardCount += dealerHand[0].Count;
  if (showCount) {
      $('#count').html('Hi-Lo ' + cardCount);
    }
  while (dealerTotal < 17) {
    //Changes value of ace to 1 if it would bust dealerHand
    if (shuffledDeck[0].Value == 11 && dealerTotal + 11 >= 21) {
      shuffledDeck[0].Value = 1;
    }
    cardCount += shuffledDeck[0].Count;
    dealerHand.push(shuffledDeck[0]);
    shuffledDeck.shift();
    if (showCount) {
      $('#count').html('Hi-Lo ' + cardCount);
    }
    switch (dealerHand.length) {
      case 3:
        $('#dealerCard3').attr('src', dealerHand[2].Image);
        dealerTotal += dealerHand[2].Value;
        break;
      case 4:
        $('#dealerCard4').attr('src', dealerHand[3].Image);
        dealerTotal += dealerHand[3].Value;
        break;
      case 5:
        $('#dealerCard5').attr('src', dealerHand[4].Image);
        dealerTotal += dealerHand[4].Value;
        break;
      case 6:
        $('#dealerCard6').attr('src', dealerHand[5].Image);
        dealerTotal += dealerHand[5].Value;
        break;
      case 7:
        $('#dealerCard7').attr('src', dealerHand[6].Image);
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
  win();
}

//Shows the Hi-Lo count of the deck
var countToggle = function () {
  if (showCount) {
    showCount = false;
  } else {
    showCount = true;
  }
  if (showCount) {
    $('#count').show();
    $('#count-toggle').html('hide Hi-Lo');
    $('#count').html('Hi-Lo: ' + cardCount);
  } else {
    $('#count').hide();
    $('#count-toggle').html('Show Hi-Lo');
  } 
}

//Doubles the bet after dealing and before hitting
var doubleDown = function () {
  if (canDoubleDown && betSize * 2 <= playerBankroll) {
    doubleBet();
    $('#bet').html('Bet: $' + betSize);
    hit();
    dealerPlay();
  }
}
