/**
 * A Pythagorean triplet is a set of three natural numbers, a < b < c, for which,
 * a2 + b2 = c2
 *
 * For example, 3^2 + 4^2 = 9 + 16 = 25 = 5^2.
 *
 * There exists exactly one Pythagorean triplet for which a + b + c = 1000.
 * Find the product abc.
 */

const getPythagoreanTriplet = (condition) => {
    for(let a = 1; a < 1000; a++){
        for(let b = a + 1; b < 1000; b++){
            for(let c = b + 1; c < 1000; c++){
                if(a**2 + b**2 === c**2 && condition(a, b, c)) {
                    return [a,b,c];
                }
            }
        }
    }
}

const condition = (a, b, c) => {
    return a + b + c === 1000;
}

const pythagoreanTriplet = getPythagoreanTriplet(condition);

const product = pythagoreanTriplet?.reduce((acc, curr) => acc * curr);

console.log(pythagoreanTriplet || "triplet doesn't exist for given condition");
console.log(product) //31875000
