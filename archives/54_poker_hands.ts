/**
 * In the card game poker, a hand consists of five cards and are ranked, from lowest to highest, in the following way:
 *
 *     High Card: Highest value card.
 *     One Pair: Two cards of the same value.
 *     Two Pairs: Two different pairs.
 *     Three of a Kind: Three cards of the same value.
 *     Straight: All cards are consecutive values.
 *     Flush: All cards of the same suit.
 *     Full House: Three of a kind and a pair.
 *     Four of a Kind: Four cards of the same value.
 *     Straight Flush: All cards are consecutive values of same suit.
 *     Royal Flush: Ten, Jack, Queen, King, Ace, in same suit.
 *
 * The cards are valued in the order:
 * 2, 3, 4, 5, 6, 7, 8, 9, 10, Jack, Queen, King, Ace.
 *
 * If two players have the same ranked hands then the rank made up of the highest value wins; for example, a pair of eights beats a pair of fives (see example 1 below).
 * But if two ranks tie, for example, both players have a pair of queens, then highest cards in each hand are compared (see example 4 below);
 * if the highest cards tie then the next highest cards are compared, and so on.
 *
 * The file, poker.txt, contains one-thousand random hands dealt to two players.
 * Each line of the file contains ten cards (separated by a single space): the first five are Player 1's cards and the last five are Player 2's cards.
 * You can assume that all hands are valid (no invalid characters or repeated cards), each player's hand is in no specific order, and in each hand there is a clear winner.
 *
 * How many hands does Player 1 win?
 */

import {handsBlock} from "./helpers/54_poker_hands";

export type Score = {
    name: string;
    rank: number;
    cardValue: number;
}

export type GameScore = {
    index: number;
} & Score

export type Multiple = {
    value: number;
    count: number;
}

export type Player = {
    index: number;
    name: string;
    count: number;
}

const getCardValue = (card: string): number => {
    const valueStr = card.slice(0, card.length - 1);
    switch (valueStr) {
        case 'T':
            return 10;
        case 'J':
            return 11;
        case 'Q':
            return 12;
        case 'K':
            return 13;
        case 'A':
            return 14;
        default:
            return Number(valueStr);
    }
}

const getCardSuit = (card: string): string => card.slice(card.length - 1);

const checkForSameValueCards = (cards: string[]): Multiple[] => {
    const cardValues = cards.map((c: any) => getCardValue(c));

    let multiples: Multiple[] = [];
    for (let i = 0; i < cards.length; i++) {
        if (multiples.some(m => m.value === cardValues[i])) continue;
        for (let j = i + 1; j < cards.length; j++) {
            if (cardValues[i] === cardValues[j]) {
                if (multiples.some(m => m.value === cardValues[i])) {
                    multiples = multiples.map(m => m.value === cardValues[i] ? {...m, count: m.count + 1} : m)
                } else {
                    multiples = [
                        ...multiples,
                        {
                            value: cardValues[i],
                            count: 2,
                        }
                    ]
                }
            }
        }
    }
    return multiples;
}

const checkIfCardsAreSameSuit = (cards: string[]) => {
    const suits = cards.map(c => getCardSuit(c));
    return suits.every(s => s === suits[0]);
}

const checkIfCardsHaveConsecutiveValues = (cards: string[]) => {
    const cardValues = cards.map((c: any) => getCardValue(c));
    cardValues.sort((a, b) => a - b);
    return cardValues.every((c, index) => cardValues[index - 1] + 1 === c || index === 0);
}

const scores = [
    {
        name: 'royalFlush',
        rank: 1,
        condition: (cards: string[]): number => {
            if (checkIfCardsAreSameSuit(cards) && checkIfCardsHaveConsecutiveValues(cards) && cards.map(c => getCardValue(c)).includes(14)) {
                return 14;
            }
            return 0;
        },
    },
    {
        name: 'straightFlush',
        rank: 2,
        condition: (cards: string[]): number => {
            if (checkIfCardsAreSameSuit(cards) && checkIfCardsHaveConsecutiveValues(cards)) {
                return Math.max(...cards.map(c => getCardValue(c)));
            }
            return 0;
        },
    },
    {
        name: 'fourOfAKind',
        rank: 3,
        condition: (cards: string[]): number => {
            const multiples = checkForSameValueCards(cards);
            if (multiples.map(m => m.count).includes(4)) {
                return multiples[0].value;
            }
            return 0;
        },
    },
    {
        name: 'fullHouse',
        rank: 4,
        condition: (cards: string[]): number => {
            const multiples = checkForSameValueCards(cards);
            const threeOfaKind = multiples.find(m => m.count === 3);
            const pair = multiples.find(m => m.count === 2);
            if (threeOfaKind && pair) {
                return threeOfaKind.value;
            }
            return 0;
        },
    },
    {
        name: 'flush',
        rank: 5,
        condition: (cards: string[]): number => {
            if (checkIfCardsAreSameSuit(cards)) {
                return Math.max(...cards.map(c => getCardValue(c)));
            }
            return 0;
        },
    },
    {
        name: 'straight',
        rank: 6,
        condition: (cards: string[]): number => {
            if (checkIfCardsHaveConsecutiveValues(cards)) {
                return Math.max(...cards.map(c => getCardValue(c)));
            }
            return 0;
        },
    },
    {
        name: 'threeOfAKind',
        rank: 7,
        condition: (cards: string[]): number => {
            const multiples = checkForSameValueCards(cards);
            const threeOfaKind = multiples.find(m => m.count === 3);
            if (threeOfaKind) {
                return threeOfaKind.value;
            }
            return 0;
        },
    },
    {
        name: 'twoPairs',
        rank: 8,
        condition: (cards: string[]): number => {
            const multiples = checkForSameValueCards(cards);
            if (multiples.length === 2) {
                return Math.max(...multiples.map(m => m.value));
            }
            return 0;
        },
    },
    {
        name: 'onePair',
        rank: 9,
        condition: (cards: string[]): number => {
            const multiples = checkForSameValueCards(cards);
            const pair = multiples.find(m => m.count === 2);
            if (pair) {
                return pair.value;
            }
            return 0;
        },
    },
]

const checkHand = (cards: string[]): Score => {
    for (const handScore of scores) {
        const cardValue = handScore.condition(cards);
        if (cardValue) {
            return {
                name: handScore.name,
                rank: handScore.rank,
                cardValue: cardValue,
            };
        }
    }
    return {
        name: 'noScore',
        rank: 10,
        cardValue: 1,
    };
}

const findGameWinners = (hands: GameScore[]): GameScore[] => hands.reduce((acc, gh) => {
    if (acc.length === 0) {
        return [gh];
    } else if (gh.rank < acc[0].rank) {
        return [gh];
    } else if (gh.rank === acc[0].rank && gh.cardValue > acc[0].cardValue) {
        return [gh];
    } else if (gh.rank === acc[0].rank && gh.cardValue === acc[0].cardValue) {
        return [...acc, gh];
    }
    return acc;
}, [] as GameScore[]);

//TODO: This should be rewritten; not sure how it would behave for more than two players
const findHighCard = (hands: string[][]): number | undefined => {
    const sortedHands: number [][] = [];
    hands.forEach(hand => {
        const mappedHandValues = hand.map(c => getCardValue(c));
        const sortedHand = mappedHandValues.sort((a, b) => b - a);
        sortedHands.push(sortedHand);
    });

    let winnerIndex;
    outer: for (let i = 0; i < 5; i++) {
        let max = 0;
        for (let j = 0; j < sortedHands.length; j++) {
            const cardValue = sortedHands[j][i];
            if (cardValue > max) {
                max = cardValue;
                winnerIndex = j;
            } else if (cardValue === max) {
                max = 0;
                continue outer;
            }
        }
        return winnerIndex;
    }
    return winnerIndex;
};

const countWinners = (games: string[][][]): Player[] => {
    const players: Player[] = games[0].map((g, i) => ({
        index: i,
        name: `Player${i + 1}`,
        count: 0
    }));

    for (const game of games) {
        const gameScores: GameScore[] = game.map((hand, index) => ({...checkHand(hand), index}));

        let winners: GameScore[] = findGameWinners(gameScores);
        if (winners.length > 1) {
            const winnerGameHands = winners.map(w => game[w.index]);
            const winnerIndex = findHighCard(winnerGameHands);
            if (winnerIndex !== undefined) {
                winners = [winners[winnerIndex]];
            }
        }
        if (winners.length === 1) {
            players.map(p => p.index === winners[0].index ? {...p, count: p.count++} : p);
        }
        if (winners.length !== 1) {
            //don't know if this is point for both or for none?
            console.log('More than one winner; all cards have matching values!!!!!!');
        }
        console.log(`${gameScores[0].index === winners[0].index ? '**' : ''}${gameScores[0].name} \t ${game[0]}`);
        console.log(`${gameScores[1].index === winners[0].index ? '**' : ''}${gameScores[1].name} \t ${game[1]}`);
        console.log(`Winner: ${players.find(p => p.index === winners[0].index)?.name}`);
        console.log('-------------------------------');
    }
    return players;
}

const transformBlockToGames = (block: string, numOfPlayers: number): string[][][] => {
    const cards = block.split(' ');
    const games: string[][][] = [];
    let game: string[][] = [];
    let hand: string[] = [];
    let index = 0;
    let handNo = 0;
    for (let i = 0; i < cards.length; i++) {
        hand.push(cards[i]);
        index++;
        if (index % 5 === 0) {
            game.push(hand);
            hand = [];
            handNo++;
            if (handNo % numOfPlayers === 0) {
                games.push(game);
                game = [];
            }
        }
    }
    return games;
}

console.log(countWinners(transformBlockToGames(handsBlock, 2)));

const testEngine = () => {
    console.log(checkHand(['4H', '8H', '6D', '7S', 'JH']).name);
    console.log(checkHand(['4H', 'JH', '6H', 'JS', '5D']).name);
    console.log(checkHand(['4H', '10C', '5H', '4D', '10H']).name);
    console.log(checkHand(['AH', '2C', '5D', 'AS', 'AC']).name);
    console.log(checkHand(['4S', '8H', '6C', '7C', '5H']).name);
    console.log(checkHand(['4H', '8H', 'AH', '2H', '5H']).name);
    console.log(checkHand(['4H', 'QD', 'QC', '4S', 'QH']).name);
    console.log(checkHand(['QD', '4H', 'QC', 'QS', 'QH']).name);
    console.log(checkHand(['9H', '8H', '6H', '7H', 'TH']).name);
    console.log(checkHand(['TH', 'KH', 'QH', 'JH', 'AH']).name);
}

//testEngine();
