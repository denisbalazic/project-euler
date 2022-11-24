/**
 * By listing the first six prime numbers: 2, 3, 5, 7, 11, and 13, we can see that the 6th prime is 13.
 * What is the 10 001st prime number?
 */

const generatePrimes = (numOfPrimes) => {

    const checkIfPrime = (num) => {
        for (const prime of primes) {
            if (num % prime === 0) {
                return false
            }
        }
        return true;
    }

    const primes = [2];
    let i = 3;
    while (primes.length < numOfPrimes) {
        if (checkIfPrime(i)) {
            primes.push(i);
        }
        i++;
    }

    return primes
}

const prime = generatePrimes(10001).pop();

console.log(prime); //104759

