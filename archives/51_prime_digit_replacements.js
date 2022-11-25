/**
 * By replacing the 1st digit of the 2-digit number *3, it turns out that six of the nine possible values: 13, 23, 43, 53, 73, and 83, are all prime.
 *
 * By replacing the 3rd and 4th digits of 56**3 with the same digit, this 5-digit number is the first example having seven primes among the ten generated numbers,
 * yielding the family: 56003, 56113, 56333, 56443, 56663, 56773, and 56993. Consequently, 56003, being the first member of this family, is the smallest prime with this property.
 *
 * Find the smallest prime which, by replacing part of the number (not necessarily adjacent digits) with the same digit, is part of an eight prime value family.
 */

const primes = [2];

const generatePrime = (i) => {
    if (primes.length >= i) {
        return primes[i - 1];
    }
    let num = primes[primes.length - 1];
    for (let j = primes.length; j < i - 1; j++) {
        num++;
        while (!checkPrime(num, primes)) {
            num++;
        }
        primes.push(num);
    }
    return num;
};

const checkPrime = (num, primes) => {
    if (primes.includes(num)) return true;
    for (const prime of primes) {
        if (num > prime && num % prime === 0) {
            return false;
        }
    }
    return true;
}

let primeNo = 3;
outer: while (primeNo) {
    const prime = generatePrime(primeNo);
    const primeStr = prime.toString();
    console.log(prime);

    for (let i = 0; i < 3; i++) {
        let count = 1;
        let transformedPrime = primeStr;
        for (let digit = 1; digit < 10; digit++) {
            transformedPrime = primeStr.replace(new RegExp(i.toString(), 'g'), digit.toString());

            if (transformedPrime !== primeStr && checkPrime(parseInt(transformedPrime), primes)) {
                count++;
            }
            if (count === 8) {
                console.log('WINNER: ' + prime); //121313
                break outer;
            }
        }
    }
    primeNo++;
}






