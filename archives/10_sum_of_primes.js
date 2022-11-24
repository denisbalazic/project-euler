/**
 * The sum of the primes below 10 is 2 + 3 + 5 + 7 = 17.
 * Find the sum of all the primes below two million.
 */

const primes = [2];
let sumOfPrimes = 2;

const checkIfPrime = (num) => {
    for(const prime of primes) {
        if(num % prime === 0) {
            return false
        }
    }
    return true;
}

const generatePrimes = (setLength) => {
    for(let i = 2; i < setLength; i++){
        if(checkIfPrime(i)){
            primes.push(i);
            sumOfPrimes += i;
        }
    }
}

generatePrimes(2000000);
console.log(sumOfPrimes); //142913828922

