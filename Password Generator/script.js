// Selecting necessary elements from the DOM
const inputSlider = document.querySelector("[data-lenghthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#Numbers");
const symbolsCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allcheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%^&*{[}]:<>_?/+-';

// Initially setting default values
let password = "";
let passwordlength = 10;
let checkcount = 0;
handleslider(); // Update slider UI
setIndicator("#ccc"); //for circle

// Function to update the password length display
function handleslider(){
    inputSlider.value = passwordlength;
    lengthDisplay.innerText = passwordlength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordlength-min)*100/(max-min))+ "% 100%";
}

// Function to set the strength indicator color
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style,boxShadow ='0px 0px 12px 1px ${color}';
}

// Function to generate a random integer within a given range
function getRndInteger(min, max){
    return Math.floor (Math.random() * (max - min)) + min; 
}

// Function to generate a random number (0-9)
function generateRndNum (){
    return getRndInteger(0,9);
}

// Function to generate a random lowercase letter
function generatelowercase(){
   return String.fromCharCode(getRndInteger(97,123)); // ASCII values for lowercase letters
}

// Function to generate a random uppercase letter
function generateuppercase(){
    return String.fromCharCode(getRndInteger(65,91)); // ASCII values for uppercase letters
}

// Function to generate a random symbol
function generateSymbol (){
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

// Function to calculate the strength of the generated password
function calcStrength(){
    let hasUpper = uppercaseCheck.checked;
    let hasLower = lowercaseCheck.checked;
    let hasNum = numbersCheck.checked;
    let hasSym = symbolsCheck.checked;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordlength >= 8){
        setIndicator("#0f0"); // Strong password (Green)
    }
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordlength >= 6){
        setIndicator("#ff0"); // Medium strength (Yellow)
    }
    else {
        setIndicator("#f00"); // Weak password (Red)
    }
}

// Function to copy password to clipboard
async function copycontent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    } catch(e){
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

// Event listener for password length slider
inputSlider.addEventListener('input', (e) => {
    passwordlength = e.target.value;
    handleslider();
});

// Event listener for copy button
copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value){
        copycontent(); 
    }
});

// Function to shuffle the password using Fisher-Yates algorithm
function shufflepassword(Array){
    for(let i = Array.length - 1; i > 0; i--){
        //random J, find out using randon function
        const j = Math.floor(Math.random() * (i + 1));
        const temp = Array[i];
        Array[i] = Array[j];
        Array[j] = temp;
    }
    let str = "";
    Array.forEach((el) => (str += el));
    return str;
}

// Function to track checkbox selection changes
function handlecheckboxchange(){
    checkcount = 0;
    allcheckBox.forEach((checkbox) => {
        if(checkbox.checked) checkcount++;
    });

    // Ensure password length is at least equal to selected options
    if(passwordlength < checkcount){
        passwordlength = checkcount;
        handleslider();
    }
}

// Adding event listeners to all checkboxes
allcheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handlecheckboxchange);
});

// Event listener for generating a new password
generateBtn.addEventListener('click', () => {
    if(checkcount <= 0) return; // If no checkbox is selected, exit function

    if(passwordlength < checkcount){
        passwordlength = checkcount;
        handleslider();
    }

    password = ""; // Reset old password
    let funArr = [];

    // Add selected character types to function array
    if(uppercaseCheck.checked) funArr.push(generateuppercase);
    if(lowercaseCheck.checked) funArr.push(generatelowercase);
    if(numbersCheck.checked) funArr.push(generateRndNum);
    if(symbolsCheck.checked) funArr.push(generateSymbol);

    // Ensure at least one character from each selected category is included
    for(let i = 0; i < funArr.length; i++){
        password += funArr[i]();
    }

    // Generate the remaining characters randomly
    for(let i = 0; i < passwordlength - funArr.length; i++){
        let randIndex = getRndInteger(0, funArr.length);
        password += funArr[randIndex]();
    }

    // Shuffle the password to ensure randomness
    password = shufflepassword(Array.from(password));

    // Display the password in UI
    passwordDisplay.value = password;

    // Calculate password strength
    calcStrength(); 
});
