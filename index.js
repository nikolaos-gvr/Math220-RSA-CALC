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
