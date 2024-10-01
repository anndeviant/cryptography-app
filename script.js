// Caesar Cipher
function showCaesarAlert(message) {
  const alertContainer = document.getElementById("caesarAlert");
  alertContainer.textContent = message; // Set the alert message
  alertContainer.style.display = "block";
}

function hideCaesarAlert() {
  const alertContainer = document.getElementById("caesarAlert");
  alertContainer.style.display = "none";
}

function isCaesarValidInput(input) {
  return /^[A-Za-z\s]*$/.test(input);
}

function caesarEncrypt() {
  const input = document.getElementById("caesarInput").value;

  if (!isCaesarValidInput(input)) {
    showCaesarAlert("Input must only contain letters and spaces.");
    return;
  } else {
    hideCaesarAlert();
  }

  const shift = parseInt(document.getElementById("caesarShift").value);

  if (isNaN(shift) || shift < 0 || shift > 26) {
    if (isNaN(shift)) {
      showCaesarAlert("Shift value must be an integer.");
    } else {
      showCaesarAlert("Shift value must be between 0 and 26.");
    }
    return;
  }

  const output = caesarCipher(input, shift);
  document.getElementById("caesarOutput").value = output;
}

// Caesar Cipher Decryption
function caesarDecrypt() {
  const input = document.getElementById("caesarInput").value;

  if (!isCaesarValidInput(input)) {
    showCaesarAlert("Input must only contain letters and spaces.");
    return;
  } else {
    hideCaesarAlert();
  }

  const shift = parseInt(document.getElementById("caesarShift").value);

  if (isNaN(shift) || shift < 0 || shift > 26) {
    if (isNaN(shift)) {
      showCaesarAlert("Shift value must be an integer.");
    } else {
      showCaesarAlert("Shift value must be between 0 and 26.");
    }
    return;
  }

  const output = caesarCipher(input, -shift);
  document.getElementById("caesarOutput").value = output;
}

// Caesar Cipher Algorithm
function caesarCipher(input, shift) {
  return input
    .split("")
    .map((char) => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const isUpperCase = char === char.toUpperCase();
        const base = isUpperCase ? 65 : 97;
        return String.fromCharCode(((code - base + shift + 26) % 26) + base);
      }
      return char;
    })
    .join("");
}
function clearFormCaesar(inputId, shiftId, outputId) {
  document.getElementById(outputId).value = "";
}

// Rail Fence Cipher
function railFenceEncrypt() {
  const input = document.getElementById("railFenceInput").value;
  const rails = parseInt(document.getElementById("railFenceRails").value);
  const output = railFenceCipher(input, rails);
  document.getElementById("railFenceOutput").value = output;
}

function railFenceDecrypt() {
  const input = document.getElementById("railFenceInput").value;
  const rails = parseInt(document.getElementById("railFenceRails").value);
  const output = railFenceDecipher(input, rails);
  document.getElementById("railFenceOutput").value = output;
}

function railFenceCipher(input, rails) {
  let fence = Array(rails)
    .fill()
    .map(() => []);
  let rail = 0;
  let direction = 1;

  for (let char of input) {
    fence[rail].push(char);
    rail += direction;
    if (rail === 0 || rail === rails - 1) direction *= -1;
  }

  return fence.flat().join("");
}

function railFenceDecipher(input, rails) {
  let fence = Array(rails)
    .fill()
    .map(() => []);
  let rail = 0;
  let direction = 1;

  // First pass: mark fence positions
  for (let i = 0; i < input.length; i++) {
    fence[rail].push("");
    rail += direction;
    if (rail === 0 || rail === rails - 1) direction *= -1;
  }

  // Second pass: fill in the characters
  let index = 0;
  for (let i = 0; i < rails; i++) {
    for (let j = 0; j < fence[i].length; j++) {
      fence[i][j] = input[index++];
    }
  }

  // Third pass: read off the rails
  let result = "";
  rail = 0;
  direction = 1;
  for (let i = 0; i < input.length; i++) {
    result += fence[rail].shift();
    rail += direction;
    if (rail === 0 || rail === rails - 1) direction *= -1;
  }

  return result;
}

function clearFormRailFence(inputId, shiftId, outputId) {
  document.getElementById(outputId).value = "";
}

// RC4 Stream Cipher
// function generateRC4Key() {
//   const key = CryptoJS.lib.WordArray.random(16).toString();
//   document.getElementById("rc4Key").value = key;
// }

// function rc4Encrypt() {
//   const input = document.getElementById("rc4Input").value;

//   const key = document.getElementById("rc4Key").value;
//   const encrypted = CryptoJS.RC4.encrypt(input, key);
//   document.getElementById("rc4Output").value = encrypted.toString();
// }

// function rc4Decrypt() {
//   const input = document.getElementById("rc4Input").value;
//   const key = document.getElementById("rc4Key").value;
//   const decrypted = CryptoJS.RC4.decrypt(input, key);
//   document.getElementById("rc4Output").value = decrypted.toString(
//     CryptoJS.enc.Utf8
//   );
// }

// function clearFormRC4(inputId, shiftId, outputId) {
//   document.getElementById(outputId).value = "";
// }

// RC4 Stream Cipher Manual Implementation

// Function to generate a random key (16 characters)
function generateRC4Key() {
  let key = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 16; i++) {
    key += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  document.getElementById("rc4Key").value = key;
}

// RC4 Encryption and Decryption Algorithm
function rc4(key, text) {
  const S = [];
  const K = [];
  let i,
    j = 0,
    t;

  // Key Scheduling Algorithm (KSA)
  for (i = 0; i < 256; i++) {
    S[i] = i;
    K[i] = key.charCodeAt(i % key.length);
  }

  for (i = 0; i < 256; i++) {
    j = (j + S[i] + K[i]) % 256;
    // Swap S[i] and S[j]
    t = S[i];
    S[i] = S[j];
    S[j] = t;
  }

  // Pseudo-Random Generation Algorithm (PRGA)
  i = 0;
  j = 0;
  let result = "";

  for (let n = 0; n < text.length; n++) {
    i = (i + 1) % 256;
    j = (j + S[i]) % 256;

    // Swap S[i] and S[j]
    t = S[i];
    S[i] = S[j];
    S[j] = t;

    // XOR the generated keystream byte with the input text byte
    const Kbyte = S[(S[i] + S[j]) % 256];
    const charCode = text.charCodeAt(n) ^ Kbyte;

    result += String.fromCharCode(charCode);
  }

  return result;
}

// Encrypt the input text
function rc4Encrypt() {
  const input = document.getElementById("rc4Input").value;
  const key = document.getElementById("rc4Key").value;
  const encrypted = rc4(key, input);
  document.getElementById("rc4Output").value = btoa(encrypted); // Convert to Base64 for better readability
}

// Decrypt the input text
function rc4Decrypt() {
  const input = atob(document.getElementById("rc4Input").value); // Decode Base64 input
  const key = document.getElementById("rc4Key").value;
  const decrypted = rc4(key, input);
  document.getElementById("rc4Output").value = decrypted;
}

// Clear the form fields
function clearFormRC4(inputId, shiftId, outputId) {
  document.getElementById(outputId).value = "";
}

// AES Encryption
function generateAESKey() {
  const key = CryptoJS.lib.WordArray.random(16).toString();
  document.getElementById("aesKey").value = key;
}

function aesEncrypt() {
  const input = document.getElementById("aesInput").value;
  const key = document.getElementById("aesKey").value;
  const encrypted = CryptoJS.AES.encrypt(input, key);
  document.getElementById("aesOutput").value = encrypted.toString();
}

function aesDecrypt() {
  const input = document.getElementById("aesInput").value;
  const key = document.getElementById("aesKey").value;
  const decrypted = CryptoJS.AES.decrypt(input, key);
  document.getElementById("aesOutput").value = decrypted.toString(
    CryptoJS.enc.Utf8
  );
}

function clearFormAES(inputId, shiftId, outputId) {
  document.getElementById(outputId).value = "";
}

// Super Encryption
function generateSuperKeys() {
  document.getElementById("superCaesarShift").value =
    Math.floor(Math.random() * 25) + 1;
  document.getElementById("superRailFenceRails").value =
    Math.floor(Math.random() * 9) + 2;
  document.getElementById("superRC4Key").value =
    CryptoJS.lib.WordArray.random(16).toString();
  document.getElementById("superAESKey").value =
    CryptoJS.lib.WordArray.random(16).toString();
}

function superEncrypt() {
  const input = document.getElementById("superInput").value;
  const caesarShift = parseInt(
    document.getElementById("superCaesarShift").value
  );
  const railFenceRails = parseInt(
    document.getElementById("superRailFenceRails").value
  );
  const rc4Key = document.getElementById("superRC4Key").value;
  const aesKey = document.getElementById("superAESKey").value;

  let step1 = caesarCipher(input, caesarShift);
  let step2 = railFenceCipher(step1, railFenceRails);
  let step3 = CryptoJS.RC4.encrypt(step2, rc4Key).toString();
  let step4 = CryptoJS.AES.encrypt(step3, aesKey).toString();

  document.getElementById("superOutput").value = step4;
}

function superDecrypt() {
  const input = document.getElementById("superInput").value;
  const caesarShift = parseInt(
    document.getElementById("superCaesarShift").value
  );
  const railFenceRails = parseInt(
    document.getElementById("superRailFenceRails").value
  );
  const rc4Key = document.getElementById("superRC4Key").value;
  const aesKey = document.getElementById("superAESKey").value;

  let step1 = CryptoJS.AES.decrypt(input, aesKey).toString(CryptoJS.enc.Utf8);
  let step2 = CryptoJS.RC4.decrypt(step1, rc4Key).toString(CryptoJS.enc.Utf8);
  let step3 = railFenceDecipher(step2, railFenceRails);
  let step4 = caesarCipher(step3, -caesarShift);

  document.getElementById("superOutput").value = step4;
}

// 'superInput', 'superCaesarShift', 'superRailFenceRails', 'superRC4Key', 'superAESKey', 'superOutput'
function clearFormSuper(inputId, shiftId, railsId, RC4Id, AESId, outputId) {
  document.getElementById(outputId).value = "";
}

// Function to switch between sections
function switchSection(sectionId) {
  document.querySelectorAll("section").forEach((section) => {
    section.style.display = "none";
  });
  document.getElementById(sectionId).style.display = "block";
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });
  document.querySelector(`a[href="#${sectionId}"]`).classList.add("active");
}

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  switchSection("caesar");
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const sectionId = this.getAttribute("href").substring(1);
      switchSection(sectionId);
    });
  });
});
