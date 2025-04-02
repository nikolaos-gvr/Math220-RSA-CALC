// RSA Algorithm Variables:

// p, q: Two large prime numbers selected for RSA key generation.
//    - p: The first prime number.
//    - q: The second prime number.
// These numbers are used to calculate n (the modulus) and phi(n) (Euler's Totient function).

// n: The modulus for both the public and private keys.
//    - n = p * q
// n is used in both encryption and decryption operations. It's a product of the two primes, p and q.

// phi(n): Euler's Totient function of n, which is used to compute the private exponent (d).
//    - phi(n) = (p - 1) * (q - 1)
// It represents the number of integers less than n that are coprime with n (have no common divisors other than 1).

// e: The public exponent (part of the public key). 
//    - It's chosen such that 1 < e < phi(n) and gcd(e, phi(n)) = 1 (e is coprime with phi(n)).
// e is used for the encryption process and is public.


// d: The private exponent (part of the private key).
//    - It's the modular inverse of e modulo phi(n).
//    - e * d ≡ 1 (mod phi(n))
// d is used in the decryption process to reverse the encryption.

// x0, x1: Variables used in the Extended Euclidean Algorithm (to calculate modular inverse).
//    - x0 is the initial value, representing the inverse at the start of the algorithm.
//    - x1 is the result of the algorithm that will hold the modular inverse of e modulo phi(n) after calculation.
// These variables help in finding the value of `d` in the Extended Euclidean Algorithm.


// RSA Encryption/Decryption Variables:

// message: The plaintext message that needs to be encrypted or decrypted.
//    - It will be converted to uppercase to simplify processing (in the provided code).

// originalASCII: An array that holds the ASCII values of each character in the original message.
//    - This is used for visualizing the encryption process and showing the ASCII representation of the original message.

// encryptedASCII: An array that holds the encrypted ASCII values for each character in the message.
//    - This represents the encrypted data after applying the RSA encryption algorithm (modular exponentiation).

// encryptedString: A string of the encrypted ASCII values separated by commas.
//    - This is used for visualizing the encrypted message in the webpage and preparing it for Base64 encoding.

// encryptedBase64: A Base64-encoded version of the encrypted ASCII values.
//    - Base64 encoding is used to safely represent the encrypted message as text that can be displayed easily on the page.

// decryptedText: The resulting decrypted message after applying RSA decryption to the encrypted message.
//    - This is the final text that will be shown after decrypting the Base64-encoded encrypted message.

// gcd(a, b): A helper function that calculates the greatest common divisor of two numbers using the Euclidean algorithm.
//    - It is used to ensure that the public exponent `e` is coprime with phi(n), i.e., gcd(e, phi(n)) = 1.
//    - This is important for the RSA algorithm to work correctly.

// Check if a number is prime
function isPrime(num) {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

// Greatest Common Divisor (GCD)
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

// Compute modular inverse using Extended Euclidean Algorithm
function modInverse(e, phi) {
    let m0 = phi, t, q;
    let x0 = 0, x1 = 1;

    while (e > 1) {
        q = Math.floor(e / phi);
        t = phi;
        phi = e % phi;
        e = t;
        t = x0;
        x0 = x1 - q * x0;
        x1 = t;
    }

    return x1 < 0 ? x1 + m0 : x1;
}

// Modular Exponentiation (base^exp mod mod)
function modExp(base, exp, mod) {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
        if (exp % 2 === 1) result = (result * base) % mod;
        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
    }
    return result;
}

let n, phi, e, d;

// Generate RSA keys
function generateKeys() {
    let p = parseInt(document.getElementById("p").value);
    let q = parseInt(document.getElementById("q").value);

    if (!isPrime(p) || !isPrime(q)) {
        alert("Both p and q must be prime numbers.");
        return;
    }

    n = p * q;
    phi = (p - 1) * (q - 1);

    // Choose e such that 1 < e < phi(n) and gcd(e, phi(n)) = 1
    e = 3;
    while (gcd(e, phi) !== 1) {
        e++;
    }

    d = modInverse(e, phi);

    document.getElementById("n").textContent = n;
    document.getElementById("phi").textContent = phi;
    document.getElementById("e").textContent = e;
    document.getElementById("d").textContent = d;
    document.getElementById("n1").textContent = n;
    document.getElementById("n2").textContent = n;
}

// Encrypt text using RSA
function encryptText() {
    let message = document.getElementById("text-message").value.toUpperCase(); // Convert to uppercase
    if (!n || !e) {
        alert("Please generate keys first!");
        return;
    }

    let originalASCII = [];
    let encryptedASCII = [];
    
    for (let i = 0; i < message.length; i++) {
        let ascii = message.charCodeAt(i);
        let encryptedChar = modExp(ascii, e, n);
        
        originalASCII.push(ascii);
        encryptedASCII.push(encryptedChar);
    }

    // Convert encrypted ASCII array to string and encode in Base64
    let encryptedString = encryptedASCII.join(",");
    let encryptedBase64 = btoa(encryptedString); // Base64 encoding

    document.getElementById("original-ascii").textContent = originalASCII.join(" ");
    document.getElementById("encrypted-ascii").textContent = encryptedASCII.join(" ");
    document.getElementById("encrypted").textContent = encryptedBase64; // Show Base64-encoded encrypted text
}

// Decrypt text using RSA
function decryptText() {
    let encryptedBase64 = document.getElementById("encrypted").textContent;
    if (!n || !d) {
        alert("Please generate keys first!");
        return;
    }

    // Decode Base64 and split into array
    let encryptedASCII = atob(encryptedBase64).split(",").map(Number);

    let decryptedText = "";
    for (let i = 0; i < encryptedASCII.length; i++) {
        let decryptedChar = modExp(encryptedASCII[i], d, n);
        decryptedText += String.fromCharCode(decryptedChar);
    }

    document.getElementById("decrypted").textContent = decryptedText;
}
