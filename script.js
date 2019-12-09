// import { SuperInteger } from "./SuperInteger";
/**------------------------------------ super integer --------------------------------------------- */
//Constructor 
function SuperInteger(value) {
    this.value = '0';
    if (typeof value == 'object') {
        this.value = value.toString();
        return;
    } else if (typeof value == 'string') {
        for (var i = 0; i < value.length; i++) {
            var code = value[i].charCodeAt(0);
            if (code < 48 || code > 57) {
                console.log('ERROR! String has a non-numeric character.');
                return;
            }
        }
        this.value = value;
    } else if (typeof value == 'number') {
        if (value < 0) {
            console.log('ERROR! Negative number.');
            return;
        } else if (value == 0) {
            this.value = "0";
            return;
        }
        var reverseValue = '';
        while (value > 0) {
            reverseValue += String.fromCharCode(48 + (value % 10));
            value = parseInt(value / 10);
        }
        this.value = '';
        for (var i = reverseValue.length - 1; i >= 0; i--)
            this.value += reverseValue[i];
    }

    return this.value;
};

//Utils - Greater
SuperInteger.prototype.greater = function (num2) {
    if (typeof num2 != 'object')
        num2 = new SuperInteger(num2);

    var num1 = this.toString();
    var num2 = num2.toString();

    if (num1.length > num2.length) return true;
    if (num2.length > num1.length) return false;

    for (var i = 0; i < num1.length; i++)
        if (num1[i] != num2[i])
            return num1[i] > num2[i];

    return false;
};

//Utils - Smaller 
SuperInteger.prototype.smaller = function (num2) {
    if (typeof num2 != 'object')
        num2 = new SuperInteger(num2);

    var num1 = this.toString();
    var num2 = num2.toString();

    if (num1.length < num2.length) return true;
    if (num2.length > num1.length) return false;

    for (var i = 0; i < num1.length; i++)
        if (num1[i] != num2[i])
            return num1[i] < num2[i];
    return false;
};

//Utils - Equals
SuperInteger.prototype.eq = function (num2) {
    if (typeof num2 != 'object')
        num2 = new SuperInteger(num2);

    var num1 = this.toString();
    var num2 = num2.toString();

    return num1.localeCompare(num2) == 0;
};

//Utils - Truncate
SuperInteger.prototype.truncate = function (n) {
    var l = this.toString().length;
    while (l < n) {
        this.value = "0" + this.toString();
        l++;
    }
    return this.toString().substring(l - n, l);
};

//Utils - Remove Zeros
SuperInteger.prototype.removeZeros = function () {
    var result = new SuperInteger(this.toString().replace(/^0+/, ''));
    if (result.toString() == "") result = new SuperInteger(0);
    return result;
};

//Sum
SuperInteger.prototype.add = function (num2) {
    if (typeof num2 != 'object')
        num2 = new SuperInteger(num2);

    var l = Math.max(this.toString().length, num2.toString().length);
    this.truncate(l); num2.truncate(l);

    var num1 = this.toString();
    var num2 = num2.toString();

    var result = '';
    var carry = 0;

    for (var i = 0; i < l; i++) {
        var dig1 = num1.charCodeAt(l - 1 - i) - 48;
        var dig2 = num2.charCodeAt(l - 1 - i) - 48;
        result += String.fromCharCode(48 + (dig1 + dig2 + carry) % 10);
        carry = parseInt((dig1 + dig2 + carry) / 10);
    }
    if (carry == 1)
        result += carry;
    result = result.split("").reverse().join("");
    return new SuperInteger(result).removeZeros();
};

//Subtraction
SuperInteger.prototype.minus = function (num2) {
    if (typeof num2 != 'object')
        num2 = new SuperInteger(num2);

    var num1 = this;

    var l = Math.max(num1.toString().length, num2.toString().length);
    num1.truncate(l); num2.truncate(l);

    var num2 = num2.toString();
    var comp2 = "";
    for (var i = 0; i < num2.length; i++)
        comp2 = comp2 + (57 - num2.charCodeAt(i)); // 9 - dig


    num2 = new SuperInteger(comp2);
    num2 = num2.add(1);

    var result = new SuperInteger(num1.add(num2).truncate(l));
    return result.removeZeros();
};

//Multiplication
SuperInteger.prototype.times = function (num2) {
    if (typeof num2 != 'object')
        num2 = new SuperInteger(num2);
    var num1 = this;

    num1 = num1.removeZeros();
    num2 = num2.removeZeros();

    var zero = new SuperInteger(0);
    var result = new SuperInteger(zero);
    while (num2.greater(zero)) {
        var x = new SuperInteger(num1);
        var i = new SuperInteger(1)
        while (i.add(i).greater(num2) == false) {
            i = i.add(i);
            x = x.add(x);
        }
        result = result.add(x);
        num2 = num2.minus(i);
    }
    return result;
};

//Division
SuperInteger.prototype.div = function (num2) {
    if (typeof num2 != 'object')
        num2 = new SuperInteger(num2);
    var num1 = this;

    num1 = num1.removeZeros();
    num2 = num2.removeZeros();

    var zero = new SuperInteger(0);
    var result = new SuperInteger(zero);

    while (num2.greater(num1) == false) {
        var x = new SuperInteger(num2);
        var i = new SuperInteger(1)
        while (x.add(x).greater(num1) == false) {
            x = x.add(x);
            i = i.add(i);
        }
        result = result.add(i);
        num1 = num1.minus(x);
    }
    return result;
};

//Mod
SuperInteger.prototype.mod = function (n) {
    return this.minus(this.div(n).times(n));
};

//Exponentiation
SuperInteger.prototype.pow = function (num2) {
    if (typeof num2 != 'object')
        num2 = new SuperInteger(num2);
    var num1 = this;

    num1 = num1.removeZeros();
    num2 = num2.removeZeros();

    var zero = new SuperInteger(0);
    var one = new SuperInteger(1);
    var result = new SuperInteger(one);

    while (num2.greater(zero)) {
        var x = new SuperInteger(num1);
        var i = new SuperInteger(1)
        while (i.add(i).greater(num2) == false) {
            i = i.add(i);
            x = x.times(x);
        }
        result = result.times(x);
        num2 = num2.minus(i);
    }
    return result;
};

//Exponentiation with mod
SuperInteger.prototype.powMod = function (num2, m) {
    num1 = new SuperInteger(this).mod(m).removeZeros();
    num2 = new SuperInteger(num2).mod(m).removeZeros();

    var zero = new SuperInteger(0);
    var one = new SuperInteger(1);
    var result = new SuperInteger(one);

    var values = {};
    while (num2.greater(zero)) {
        var x = new SuperInteger(num1);
        var i = new SuperInteger(1)
        while (i.add(i).greater(num2) == false) {
            i = i.add(i);
            if (i in values)
                x = values[i];
            else {
                x = x.times(x).mod(m);
                values[i] = x;
            }
        }
        result = result.times(x).mod(m);
        num2 = num2.minus(i);
    }
    return result;
};

//Greatest Common Divisor
SuperInteger.prototype.gcd = function (num2) {
    var num1 = new SuperInteger(this);
    var num2 = new SuperInteger(num2);
    var num3 = null;

    while (num2.eq(0) == false) {
        num3 = num1.mod(num2);
        num1 = num2;
        num2 = num3;
    }

    return num1;
};

//Generate a rondom number between minN and maxN (inclusive)
SuperInteger.prototype.random = function (minN, maxN) {
    if (typeof minN != 'object') minN = new SuperInteger(minN);
    if (typeof maxN != 'object') maxN = new SuperInteger(maxN);

    minN = minN.removeZeros().toString();
    maxN = maxN.removeZeros().toString();

    var result;
    do {
        result = "";
        result += Math.floor(Math.random() * (maxN.charCodeAt(0) - 46));
        for (var i = 1; i < maxN.length; i++) {
            result += Math.floor(Math.random() * 10);
        }
        result = new SuperInteger(result).removeZeros();
    } while (result.greater(maxN) || result.smaller(minN));
    return new SuperInteger(result);
};

SuperInteger.prototype.toString = function () {
    return this.value;
};
/**------------------------------------------------------------------------------------------------ */

/* global variables
-------------------*/
var originalMsg = document.getElementById("msg");
var encryptedMsg = document.getElementById("enc-msg");
var encBtn = document.getElementById("enc-btn");
var decBtn = document.getElementById("dec-btn");
var rstBtn = document.getElementById("rst-btn");
var generateBtn = document.getElementById("generate-btn");
var radio1 = document.getElementById("r1");
var radio2 = document.getElementById("r2");
var radio3 = document.getElementById("r3");
var radio4 = document.getElementById("r4");
var radio5 = document.getElementById("r5");
var caesarKey = document.getElementById("caesar-key");
var playfairKey = document.getElementById("playfair-key");
var desKey = document.getElementById("des-key");
var rc4Key = document.getElementById("rc4-key");
var P = document.getElementById("P");
var Q = document.getElementById("Q");



/* radios check events
----------------------*/
radio1.addEventListener("change", function () {
    if (radio1.checked) {
        document.getElementById("p3").style.display = 'none';
        document.getElementById("p4").style.display = 'none';
        document.getElementById("p5").style.display = 'none';
        document.getElementById("p6").style.display = 'none';
        document.getElementById("p2").style.display = 'flex';
    }
});
radio2.addEventListener("change", function () {
    if (radio2.checked) {
        document.getElementById("p2").style.display = 'none';
        document.getElementById("p4").style.display = 'none';
        document.getElementById("p5").style.display = 'none';
        document.getElementById("p6").style.display = 'none';
        document.getElementById("p3").style.display = 'flex';
    }
});
radio3.addEventListener("change", function () {
    if (radio3.checked) {
        document.getElementById("p2").style.display = 'none';
        document.getElementById("p3").style.display = 'none';
        document.getElementById("p5").style.display = 'none';
        document.getElementById("p6").style.display = 'none';
        document.getElementById("p4").style.display = 'flex';
    }
});
radio4.addEventListener("change", function () {
    if (radio4.checked) {
        document.getElementById("p2").style.display = 'none';
        document.getElementById("p3").style.display = 'none';
        document.getElementById("p4").style.display = 'none';
        document.getElementById("p6").style.display = 'none';
        document.getElementById("p5").style.display = 'flex';
    }
});
radio5.addEventListener("change", function () {
    if (radio5.checked) {
        document.getElementById("p2").style.display = 'none';
        document.getElementById("p3").style.display = 'none';
        document.getElementById("p4").style.display = 'none';
        document.getElementById("p5").style.display = 'none';
        document.getElementById("p6").style.display = 'flex';
    }
});

/* encryption button click event 
-----------------------*/
encBtn.addEventListener("click", function () {
    if (radio1.checked) {
        caesarEncryption();
        return;
    }
    if (radio2.checked) {
        playfairEncryption();
        return;
    }
    if (radio3.checked) {
        desEncryption();
        return;
    }
    if (radio4.checked) {
        RC4Encryption();
        return;
    }
    if (radio5.checked) {
        RSAEncryption();
        return;
    }
});


/* decryption button click event 
-----------------------*/
decBtn.addEventListener("click", function () {
    if (radio1.checked) {
        caesarDecryption();
        return;
    }
    if (radio2.checked) {
        playfairDecryption();
        return;
    }
    if (radio3.checked) {
        desDecryption();
        return;
    }
    if (radio4.checked) {
        RC4Decryption();
        return;
    }
    if (radio5.checked) {
        RSADecryption();
        return;
    }
});


/* reset function 
-----------------------*/
rstBtn.addEventListener("click", function () {
    originalMsg.value = "";
    encryptedMsg.value = "";
});
/*-------------------------------------------------*/
/*-------------------------------------------------*/
/*-------------------------------------------------*/
/*-----------caesar cipher-------------------------*/
/*-----------technique-----------------------------*/
/*-------------------------------------------------*/
/*-------------------------------------------------*/
/*-------------------------------------------------*/
/*-------------------------------------------------*/

/* caesar cipher encryption function
---------------------------------- */
function caesarEncryption() {
    let encMsg = [];
    let msg = originalMsg.value;
    msg = msg.split("");
    for (let i = 0; i < msg.length; i++) {
            encMsg.push(String.fromCharCode(((msg[i].charCodeAt() + Number(caesarKey.value)) % 256)));
    }
    encryptedMsg.value = encMsg.join("");
}
/* caesar cipher decryption function
---------------------------------- */
function caesarDecryption() {
    let decMsg = [];
    let encMsg = encryptedMsg.value;
    encMsg = encMsg.split("");
    for (let i = 0; i < encMsg.length; i++) {
            decMsg.push(String.fromCharCode(((encMsg[i].charCodeAt() - Number(caesarKey.value) +256) % 256)));
    }
    originalMsg.value = decMsg.join("");
}
/*-------------------------------------------------*/
/*-------------------------------------------------*/
/*-------------------------------------------------*/
/*---------playfair cipher-------------------------*/
/*-----------technique-----------------------------*/
/*-------------------------------------------------*/
/*-------------------------------------------------*/
/*-------------------------------------------------*/
/*-------------------------------------------------*/
var variables = {
    key: "",
    alpha: "",
    validAlpha: "ABCDEFGHIKLMNOPQRSTUVWXYZ",
    row: 5,
    col: 5,
    x: 'X',
    IJCh: {
        j: 'J',
        i: 'I'
    }
};
/* generate matrix
-----------------------------------------*/
function generateMatrix(keystring) {
    keystring = keystring.toUpperCase();
    keystring = keystring.replace(/\W+/g, "");
    keystring = keystring.replace(variables.IJCh.j, variables.IJCh.i);

    // Reset our key and alphabet
    variables.key = "";
    variables.alpha = variables.validAlpha;

    // Create the start of the table with our key string
    var keyArr = keystring.split("");
    for (var i = 0; i < keyArr.length; i++) {
        if (variables.alpha.indexOf(keyArr[i]) > -1 && variables.key.indexOf(keyArr[i]) == -1) {
            variables.key += keyArr[i];
            variables.alpha = variables.alpha.replace(keyArr[i], "");
        }
    };
    variables.key += variables.alpha;
}
/* make pairs
-----------------------------------------*/
function makePairs(str) {
    if (!str) return false;
    var pairs = [];
    str = str.toUpperCase();
    str = str.replace(/\W+/g, "");
    str = str.replace(variables.IJCh.j, variables.IJCh.i);
    var strArr = str.split("");

    for (var i = 0; i < str.length; i++) {
        if (variables.validAlpha.indexOf(strArr[i]) == -1) continue;
        if (i + 1 >= str.length) {
            pairs.push(strArr[i] + variables.x);
        } else if (strArr[i] == strArr[i + 1]) {
            pairs.push(strArr[i] + variables.x);
        } else {
            pairs.push(strArr[i] + strArr[++i]);
        }
    }
    return pairs;
}

/* get position
---------------------------------------*/

function getPosition(c) {
    var index = variables.key.indexOf(c);
    var row = Math.floor(index / 5);
    var col = index % 5;
    return {
        row: row,
        col: col
    };
}
/* get character
---------------------------------------------*/

function getChar(pos) {
    var index = pos.row * 5;
    index = index + pos.col;
    return variables.key.charAt(index);
}
/* encrypt pair
-----------------------------------------*/

function encryptPair(str) {
    if (str.length != 2) return false;
    var pos1 = getPosition(str.charAt(0));
    var pos2 = getPosition(str.charAt(1));
    var char1 = "";

    // Same Column - Increment 1 row, wrap around to top
    if (pos1.col == pos2.col) {
        pos1.row++;
        pos2.row++;
        if (pos1.row > variables.row - 1) pos1.row = 0;
        if (pos2.row > variables.row - 1) pos2.row = 0;
        char1 = getChar(pos1) + getChar(pos2);
    } else if (pos1.row == pos2.row) { // Same Row - Increment 1 column, wrap around to left
        pos1.col++;
        pos2.col++;
        if (pos1.col > variables.col - 1) pos1.col = 0;
        if (pos2.col > variables.col - 1) pos2.col = 0;
        char1 = getChar(pos1) + getChar(pos2);
    } else { // Box rule, use the opposing corners
        var col1 = pos1.col;
        var col2 = pos2.col;
        pos1.col = col2;
        pos2.col = col1;
        char1 = getChar(pos1) + getChar(pos2);
    }
    return char1;
}
/* encrypt
-----------------------------------------*/

function encryption(pairs) {
    if (!pairs) return false;
    var encrypt = [];
    for (var i = 0; i < pairs.length; i++) {
        encrypt.push(encryptPair(pairs[i]));
    }
    return encrypt;
}
/* playfair encryption function
------------------------------*/
function playfairEncryption() {
    generateMatrix(playfairKey.value);
    var pairs = makePairs(originalMsg.value);
    originalMsg.value = pairs.join(" ");
    var encrypt = encryption(pairs);
    encryptedMsg.value = encrypt.join(" ");
}

/* decrypt pair
-----------------------------------------*/
function decryptPair(str) {
    if (str.length != 2) return false;
    var pos1 = getPosition(str.charAt(0));
    var pos2 = getPosition(str.charAt(1));
    var char1 = "";

    // Same Column - Decrement 1 row, wrap around to bottom
    if (pos1.col == pos2.col) {
        pos1.row--;
        pos2.row--;
        if (pos1.row < 0) pos1.row = variables.row - 1;
        if (pos2.row < 0) pos2.row = variables.row - 1;
        char1 = getChar(pos1) + getChar(pos2);
    } else if (pos1.row == pos2.row) { // Same row - Decrement 1 column, wrap around to right
        pos1.col--;
        pos2.col--;
        if (pos1.col < 0) pos1.col = variables.col - 1;
        if (pos2.col < 0) pos2.col = variables.col - 1;
        char1 = getChar(pos1) + getChar(pos2);
    } else { // Box rules, use opposing corners (same as forward)
        var col1 = pos1.col;
        var col2 = pos2.col;
        pos1.col = col2;
        pos2.col = col1;
        char1 = getChar(pos1) + getChar(pos2);
    }
    return char1;
}

/* decrypt
--------------------------------------------------*/
function decryption(pairs) {
    if (!pairs) return false;
    var originalText = [];
    for (var i = 0; i < pairs.length; i++) {
        originalText.push(decryptPair(pairs[i]));
    }
    return originalText;
}

/* playfair decryption function
------------------------------*/
function playfairDecryption() {
    generateMatrix(playfairKey.value);
    var pairs = makePairs(encryptedMsg.value);
    encryptedMsg.value = pairs.join(" ");
    var decrypt = decryption(pairs);
    originalMsg.value = decrypt.join(" ");
}

/*-------------------------------------------------*/
/*-------------------------------------------------*/
/*-------------------------------------------------*/
/*--------------DES cipher-------------------------*/
/*--------------technique--------------------------*/
/*-------------------------------------------------*/
/*-------------------------------------------------*/
/*-------------------------------------------------*/
/*-------------------------------------------------*/

var pc_1 = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4];
var shifts = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
var pc_2 = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32];
var ip = [58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4, 62, 54, 46, 38, 30, 22, 14, 6, 64, 56, 48, 40, 32, 24, 16, 8, 57, 49, 41, 33, 25, 17, 9, 1, 59, 51, 43, 35, 27, 19, 11, 3, 61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39, 31, 23, 15, 7];
var expandBox = [32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9, 8, 9, 10, 11, 12, 13, 12, 13, 14, 15, 16, 17, 16, 17, 18, 19, 20, 21, 20, 21, 22, 23, 24, 25, 24, 25, 26, 27, 28, 29, 28, 29, 30, 31, 32, 1];
var p = [16, 7, 20, 21, 29, 12, 28, 17, 1, 15, 23, 26, 5, 18, 31, 10, 2, 8, 24, 14, 32, 27, 3, 9, 19, 13, 30, 6, 22, 11, 4, 25];
var fp = [40, 8, 48, 16, 56, 24, 64, 32, 39, 7, 47, 15, 55, 23, 63, 31, 38, 6, 46, 14, 54, 22, 62, 30, 37, 5, 45, 13, 53, 21, 61, 29, 36, 4, 44, 12, 52, 20, 60, 28, 35, 3, 43, 11, 51, 19, 59, 27, 34, 2, 42, 10, 50, 18, 58, 26, 33, 1, 41, 9, 49, 17, 57, 25];


var sBox1 = ["1110", "0100", "1101", "0001", "0010", "1111", "1011", "1000", "0011", "1010", "0110", "1100", "0101", "1001", "0000", "0111"
    , "0000", "1111", "0111", "0100", "1110", "0010", "1101", "0001", "1010", "0110", "1100", "1011", "1001", "0101", "0011", "1000"
    , "0100", "0001", "1110", "1000", "1101", "0110", "0010", "1011", "1111", "1100", "1001", "0111", "0011", "1010", "0101", "0000"
    , "1111", "1100", "1000", "0010", "0100", "1001", "0001", "0111", "0101", "1011", "0011", "1110", "1010", "0000", "0110", "1101"];
var sBox2 = ["1111", "0001", "1000", "1110", "0110", "1011", "0011", "0100", "1001", "0111", "0010", "1101", "1100", "0000", "0101", "1010"
    , "0011", "1101", "0100", "0111", "1111", "0010", "1000", "1110", "1100", "0000", "0001", "1010", "0110", "1001", "1011", "0101"
    , "0000", "1110", "0111", "1011", "1010", "0100", "1101", "0001", "0101", "1000", "1100", "0110", "1001", "0011", "0010", "1111"
    , "1101", "1000", "1010", "0001", "0011", "1111", "0100", "0010", "1011", "0110", "0111", "1100", "0000", "0101", "1110", "1001"
];
var sBox3 = ["1010", "0000", "1001", "1110", "0110", "0011", "1111", "0101", "0001", "1101", "1100", "0111", "1011", "0100", "0010", "1000"
    , "1101", "0111", "0000", "1001", "0011", "0100", "0110", "1010", "0010", "1000", "0101", "1110", "1100", "1011", "1111", "0001"
    , "1101", "0110", "0100", "1001", "1000", "1111", "0011", "0000", "1011", "0001", "0010", "1100", "0101", "1010", "1110", "0111"
    , "0001", "1010", "1101", "0000", "0110", "1001", "1000", "0111", "0100", "1111", "1110", "0011", "1011", "0101", "0010", "1100"
];
var sBox4 = ["0111", "1101", "1110", "0011", "0000", "0110", "1001", "1010", "0001", "0010", "1000", "0101", "1011", "1100", "0100", "1111"
    , "1101", "1000", "1011", "0101", "0110", "1111", "0000", "0011", "0100", "0111", "0010", "1100", "0001", "1010", "1110", "1001"
    , "1010", "0110", "1001", "0000", "1100", "1011", "0111", "1101", "1111", "0001", "0011", "1110", "0101", "0010", "1000", "0100"
    , "0011", "1111", "0000", "0110", "1010", "0001", "1101", "1000", "1001", "0100", "0101", "1011", "1100", "0111", "0010", "1110"
];
var sBox5 = ["0010", "1100", "0100", "0001", "0111", "1010", "1011", "0110", "1000", "0101", "0011", "1111", "1101", "0000", "1110", "1001"
    , "1110", "1011", "0010", "1100", "0100", "0111", "1101", "0001", "0101", "0000", "1111", "1010", "0011", "1001", "1000", "0110"
    , "0100", "0010", "0001", "1011", "1010", "1101", "0111", "1000", "1111", "1001", "1100", "0101", "0110", "0011", "0000", "1110"
    , "1011", "1000", "1100", "0111", "0001", "1110", "0010", "1101", "0110", "1111", "0000", "1001", "1010", "0100", "0101", "0011"
];
var sBox6 = ["1100", "0001", "1010", "1111", "1001", "0010", "0110", "1000", "0000", "1101", "0011", "0100", "1110", "0111", "0101", "1011"
    , "1010", "1111", "0100", "0010", "0111", "1100", "1001", "0101", "0110", "0001", "1101", "1110", "0000", "1011", "0011", "1000"
    , "1001", "1110", "1111", "0101", "0010", "1000", "1100", "0011", "0111", "0000", "0100", "1010", "0001", "1101", "1011", "0110"
    , "0100", "0011", "0010", "1100", "1001", "0101", "1111", "1010", "1011", "1110", "0001", "0111", "0110", "0000", "1000", "1101"
];
var sBox7 = ["0100", "1011", "0010", "1110", "1111", "0000", "1000", "1101", "0011", "1100", "1001", "0111", "0101", "1010", "0110", "0001"
    , "1101", "0000", "1011", "0111", "0100", "1001", "0001", "1010", "1110", "0011", "0101", "1100", "0010", "1111", "1000", "0110"
    , "0001", "0100", "1011", "1101", "1100", "0011", "0111", "1110", "1010", "1111", "0110", "1000", "0000", "0101", "1001", "0010"
    , "0110", "1011", "1101", "1000", "0001", "0100", "1010", "0111", "1001", "0101", "0000", "1111", "1110", "0010", "0011", "1100"
];
var sBox8 = ["1101", "0010", "1000", "0100", "0110", "1111", "1011", "0001", "1010", "1001", "0011", "1110", "0101", "0000", "1100", "0111"
    , "0001", "1111", "1101", "1000", "1010", "0011", "0111", "0100", "1100", "0101", "0110", "1011", "0000", "1110", "1001", "0010"
    , "0111", "1011", "0100", "0001", "1001", "1100", "1110", "0010", "0000", "0110", "1010", "1101", "1111", "0011", "0101", "1000"
    , "0010", "0001", "1110", "0111", "0100", "1010", "1000", "1101", "1111", "1100", "1001", "0000", "0011", "0101", "0110", "1011"

];




/* creat key function    >> validated
---------------------*/
function createKeys(key) {
    if (key.length > 8) {
        alert("The key can not exceed 8 characters!");
        return false;
    }
    key = key.split("");
    var adjusted64BitKey = "";
    if ((key.length % 8) != 0) {
        var numberOfNullChar = 8 - Number(key.length) % 8;
        for (let i = 0; i < numberOfNullChar; i++) {
            key.push(String.fromCharCode(32));
        }
    }
    for (let i = 0; i < key.length; i++) {
        if (key[i].charCodeAt() >= 128) {
            adjusted64BitKey += key[i].charCodeAt().toString(2);
        } else if (key[i].charCodeAt() >= 64) {
            adjusted64BitKey += "0" + key[i].charCodeAt().toString(2);
        } else if (key[i].charCodeAt() >= 32) {
            adjusted64BitKey += "00" + key[i].charCodeAt().toString(2);
        } else if (key[i].charCodeAt() >= 16) {
            adjusted64BitKey += "000" + key[i].charCodeAt().toString(2);
        } else if (key[i].charCodeAt() >= 8) {
            adjusted64BitKey += "0000" + key[i].charCodeAt().toString(2);
        } else if (key[i].charCodeAt() >= 4) {
            adjusted64BitKey += "00000" + key[i].charCodeAt().toString(2);
        } else if (key[i].charCodeAt() >= 2) {
            adjusted64BitKey += "000000" + key[i].charCodeAt().toString(2);
        } else if (key[i].charCodeAt() >= 0) {
            adjusted64BitKey += "0000000" + key[i].charCodeAt().toString(2);
        }
        adjusted64BitKey += ('0' + key[i].charCodeAt().toString(2));
    }
    adjusted64BitKey = adjusted64BitKey.split("");
    var adjusted56BitKey = "";
    for (let i = 0; i < pc_1.length; i++) {
        adjusted56BitKey += adjusted64BitKey[pc_1[i] - 1]; // permutation 56 bit
    }
    var D0 = adjusted56BitKey.slice(28, 56);
    var C0 = adjusted56BitKey.slice(0, 28);
    D0 = D0.split("");
    C0 = C0.split("");
    var tempBit; // for shifting
    //create k1
    tempBit = C0.shift(); C0.push(tempBit);
    tempBit = D0.shift(); D0.push(tempBit);
    var k1 = C0.join("") + D0.join("");
    //create k2
    tempBit = C0.shift(); C0.push(tempBit);
    tempBit = D0.shift(); D0.push(tempBit);
    var k2 = C0.join("") + D0.join("");
    //create k3
    tempBit = C0.shift(); C0.push(tempBit); tempBit = C0.shift(); C0.push(tempBit);
    tempBit = D0.shift(); D0.push(tempBit); tempBit = D0.shift(); D0.push(tempBit);
    var k3 = C0.join("") + D0.join("");
    //create k4
    tempBit = C0.shift(); C0.push(tempBit); tempBit = C0.shift(); C0.push(tempBit);
    tempBit = D0.shift(); D0.push(tempBit); tempBit = D0.shift(); D0.push(tempBit);
    var k4 = C0.join("") + D0.join("");
    //create k5
    tempBit = C0.shift(); C0.push(tempBit); tempBit = C0.shift(); C0.push(tempBit);
    tempBit = D0.shift(); D0.push(tempBit); tempBit = D0.shift(); D0.push(tempBit);
    var k5 = C0.join("") + D0.join("");
    //create k6
    tempBit = C0.shift(); C0.push(tempBit); tempBit = C0.shift(); C0.push(tempBit);
    tempBit = D0.shift(); D0.push(tempBit); tempBit = D0.shift(); D0.push(tempBit);
    var k6 = C0.join("") + D0.join("");
    //create k7
    tempBit = C0.shift(); C0.push(tempBit); tempBit = C0.shift(); C0.push(tempBit);
    tempBit = D0.shift(); D0.push(tempBit); tempBit = D0.shift(); D0.push(tempBit);
    var k7 = C0.join("") + D0.join("");
    //create k8
    tempBit = C0.shift(); C0.push(tempBit); tempBit = C0.shift(); C0.push(tempBit);
    tempBit = D0.shift(); D0.push(tempBit); tempBit = D0.shift(); D0.push(tempBit);
    var k8 = C0.join("") + D0.join("");
    //create k9
    tempBit = C0.shift(); C0.push(tempBit);
    tempBit = D0.shift(); D0.push(tempBit);
    var k9 = C0.join("") + D0.join("");
    //create k10
    tempBit = C0.shift(); C0.push(tempBit); tempBit = C0.shift(); C0.push(tempBit);
    tempBit = D0.shift(); D0.push(tempBit); tempBit = D0.shift(); D0.push(tempBit);
    var k10 = C0.join("") + D0.join("");
    //create k11
    tempBit = C0.shift(); C0.push(tempBit); tempBit = C0.shift(); C0.push(tempBit);
    tempBit = D0.shift(); D0.push(tempBit); tempBit = D0.shift(); D0.push(tempBit);
    var k11 = C0.join("") + D0.join("");
    //create k12
    tempBit = C0.shift(); C0.push(tempBit); tempBit = C0.shift(); C0.push(tempBit);
    tempBit = D0.shift(); D0.push(tempBit); tempBit = D0.shift(); D0.push(tempBit);
    var k12 = C0.join("") + D0.join("");
    //create k13
    tempBit = C0.shift(); C0.push(tempBit); tempBit = C0.shift(); C0.push(tempBit);
    tempBit = D0.shift(); D0.push(tempBit); tempBit = D0.shift(); D0.push(tempBit);
    var k13 = C0.join("") + D0.join("");
    //create k14
    tempBit = C0.shift(); C0.push(tempBit); tempBit = C0.shift(); C0.push(tempBit);
    tempBit = D0.shift(); D0.push(tempBit); tempBit = D0.shift(); D0.push(tempBit);
    var k14 = C0.join("") + D0.join("");
    //create k15
    tempBit = C0.shift(); C0.push(tempBit); tempBit = C0.shift(); C0.push(tempBit);
    tempBit = D0.shift(); D0.push(tempBit); tempBit = D0.shift(); D0.push(tempBit);
    var k15 = C0.join("") + D0.join("");
    //create k16
    tempBit = C0.shift(); C0.push(tempBit);
    tempBit = D0.shift(); D0.push(tempBit);
    var k16 = C0.join("") + D0.join("");

    ///////////////////////////////
    var keys = [k1, k2, k3, k4, k5, k6, k7, k8, k9, k10, k11, k12, k13, k14, k15, k16];
    var adjusted48BitKey = [];
    for (let i = 0; i < keys.length; i++) {
        var tempKey = keys[i].split("");
        for (let j = 0; j < pc_2.length; j++) {
            adjusted48BitKey[j] = tempKey[pc_2[j] - 1]; // permutation 48 bit
        }
        keys[i] = adjusted48BitKey.join("");
    }
    return keys;
}

/* boxes function 
--------------------*/

function boxesFunction(R0, keyi) {
    var tempR0 = R0;
    var ki = keyi;
    R0 = "";
    // expand 32-bit R0 to 48-bit R0
    for (let i = 0; i < expandBox.length; i++) {
        R0 = R0.concat(tempR0[expandBox[i] - 1]);
    }
    // XOR R, Keyi
    var R0XORKi = "";
    for (let i = 0; i < ki.length; i++) {
        R0XORKi += Number(R0[i]).toString(2) ^ Number(ki[i]).toString(2);
    }
    //divide R0XORKi into 6-bit blocks
    var blocksOf6Bit = [];
    for (let i = 0; i < R0XORKi.length; i = i + 6) {
        blocksOf6Bit.push(R0XORKi.slice(i, i + 6));
    }
    // S-Boxes
    var newR0 = "";
    for (let i = 0; i < blocksOf6Bit.length; i++) {
        var row = Number(Number("0b" + blocksOf6Bit[i][0] + blocksOf6Bit[i][5]).toString(10));
        var col = Number(Number("0b" + blocksOf6Bit[i].slice(1, 5)).toString(10));
        var index = row * 16;
        index = index + col;

        if (i == 0) {
            newR0 += sBox1[index];
        } else if (i == 1) {
            newR0 += sBox2[index];
        } else if (i == 2) {
            newR0 += sBox3[index];
        } else if (i == 3) {
            newR0 += sBox4[index];
        } else if (i == 4) {
            newR0 += sBox5[index];
        } else if (i == 5) {
            newR0 += sBox6[index];
        } else if (i == 6) {
            newR0 += sBox7[index];
        } else {
            newR0 += sBox8[index];
        }
    }
    // perform permutation p
    var tempNewR0 = newR0;
    newR0 = "";
    for (let i = 0; i < p.length; i++) {
        newR0 += tempNewR0[p[i] - 1]; // permutation 32 bit using ip   
    }
    return newR0;
}

function encrypt64BitOfData(msg, _keys) {


    var keysOf16Rounds = _keys;
    /* make 64-bit (8-byte) blocks of data */
    msg = msg.split("");
    if ((msg.length % 8) != 0) {
        var numberOfNullChar = 8 - Number(msg.length) % 8;
        for (let i = 0; i < numberOfNullChar; i++) {
            msg.push(String.fromCharCode(32));
        }
    }
    msg = msg.join("");
    /* divide the message into 8-byte blocks */
    var blocks = [];
    for (let i = 0; i < msg.length; i = i + 8) {
        blocks.push(msg.slice(i, i + 8));
    }
    /* take each block as a 64-bit input */
    for (let i = 0; i < blocks.length; i++) {
        var inputBlock = "";
        //make each block 64-bit (8-byte)
        for (let j = 0; j < 8; j++) {
            if (blocks[i][j].charCodeAt() >= 128) {
                inputBlock += blocks[i].charCodeAt(j).toString(2);
            } else if (blocks[i][j].charCodeAt() >= 64) {
                inputBlock += "0" + blocks[i].charCodeAt(j).toString(2);
            } else if (blocks[i][j].charCodeAt() >= 32) {
                inputBlock += "00" + blocks[i].charCodeAt(j).toString(2);
            } else if (blocks[i][j].charCodeAt() >= 16) {
                inputBlock += "000" + blocks[i].charCodeAt(j).toString(2);
            } else if (blocks[i][j].charCodeAt() >= 8) {
                inputBlock += "0000" + blocks[i].charCodeAt(j).toString(2);
            } else if (blocks[i][j].charCodeAt() >= 4) {
                inputBlock += "00000" + blocks[i].charCodeAt(j).toString(2);
            } else if (blocks[i][j].charCodeAt() >= 2) {
                inputBlock += "000000" + blocks[i].charCodeAt(j).toString(2);
            } else if (blocks[i][j].charCodeAt() >= 0) {
                inputBlock += "0000000" + blocks[i].charCodeAt(j).toString(2);
            }
        }
        var tempBlock = inputBlock;
        inputBlock = "";
        /* perform initial permutation IP */
        for (let x = 0; x < ip.length; x++) {
            inputBlock += tempBlock[ip[x] - 1]; // permutation 64 bit using ip   
        }
        var L0 = inputBlock.slice(0, 32);
        var R0 = inputBlock.slice(32, 64);
        // 16 rounds
        for (let k = 0; k < keysOf16Rounds.length; k++) {
            var functionResult = boxesFunction(R0, keysOf16Rounds[k]);
            var temp = R0;
            R0 = "";
            for (let t = 0; t < temp.length; t++) { // XOR the function output with the left side 
                R0 += Number(L0[t]) ^ Number(functionResult[t]);
            }
            L0 = temp;
        }
        //swap R0 and L0
        var finalResult = R0.concat(L0);
        var tempFinalResult = finalResult;
        finalResult = "";
        finalResult = [];
        //perform final permutation
        for (let m = 0; m < fp.length; m++) {
            finalResult[m] = tempFinalResult[fp[m] - 1]; // permutation 64 bit using fp   
        }
        finalResult = finalResult.join("");
        var finalResultBlocks = [];
        for (let i = 0; i < finalResult.length; i = i + 8) {
            finalResultBlocks.push(finalResult.slice(i, i + 8));
        }
        for (let index = 0; index < finalResultBlocks.length; index++) {
            encryptedMsg.value += String.fromCharCode("0b" + finalResultBlocks[index]);

        }
        // encryptedMsg.value += parseInt(finalResult, 2).toString(16).toUpperCase();
    }
}
function decrypt64BitOfData(msg, _keys) {


    var keysOf16Rounds = _keys;
    /* make 64-bit (8-byte) blocks of data */
    msg = msg.split("");
    if ((msg.length % 8) != 0) {
        var numberOfNullChar = 8 - Number(msg.length) % 8;
        for (let i = 0; i < numberOfNullChar; i++) {
            msg.push(String.fromCharCode(32));
        }
    }
    msg = msg.join("");
    /* divide the message into 8-byte blocks */
    var blocks = [];
    for (let i = 0; i < msg.length; i = i + 8) {
        blocks.push(msg.slice(i, i + 8));
    }
    /* take each block as a 64-bit input */
    for (let i = 0; i < blocks.length; i++) {
        var inputBlock = "";
        //make each block 64-bit (8-byte)
        for (let j = 0; j < 8; j++) {
            if (blocks[i][j].charCodeAt() >= 128) {
                inputBlock += blocks[i].charCodeAt(j).toString(2);
            } else if (blocks[i][j].charCodeAt() >= 64) {
                inputBlock += "0" + blocks[i].charCodeAt(j).toString(2);
            } else if (blocks[i][j].charCodeAt() >= 32) {
                inputBlock += "00" + blocks[i].charCodeAt(j).toString(2);
            } else if (blocks[i][j].charCodeAt() >= 16) {
                inputBlock += "000" + blocks[i].charCodeAt(j).toString(2);
            } else if (blocks[i][j].charCodeAt() >= 8) {
                inputBlock += "0000" + blocks[i].charCodeAt(j).toString(2);
            } else if (blocks[i][j].charCodeAt() >= 4) {
                inputBlock += "00000" + blocks[i].charCodeAt(j).toString(2);
            } else if (blocks[i][j].charCodeAt() >= 2) {
                inputBlock += "000000" + blocks[i].charCodeAt(j).toString(2);
            } else if (blocks[i][j].charCodeAt() >= 0) {
                inputBlock += "0000000" + blocks[i].charCodeAt(j).toString(2);
            }
        }
        var tempBlock = inputBlock;
        inputBlock = "";
        /* perform initial permutation IP */
        for (let x = 0; x < ip.length; x++) {
            inputBlock += tempBlock[ip[x] - 1]; // permutation 64 bit using ip   
        }
        var L0 = inputBlock.slice(0, 32);
        var R0 = inputBlock.slice(32, 64);
        // 16 rounds
        for (let k = 0; k < keysOf16Rounds.length; k++) {
            var functionResult = boxesFunction(R0, keysOf16Rounds[k]);
            var temp = R0;
            R0 = "";
            for (let t = 0; t < temp.length; t++) { // XOR the function output with the left side 
                R0 += Number(L0[t]) ^ Number(functionResult[t]);
            }
            L0 = temp;
        }
        //swap R0 and L0
        var finalResult = R0.concat(L0);
        var tempFinalResult = finalResult;
        finalResult = "";
        finalResult = [];
        //perform final permutation
        for (let m = 0; m < fp.length; m++) {
            finalResult[m] = tempFinalResult[fp[m] - 1]; // permutation 64 bit using fp   
        }
        finalResult = finalResult.join("");
        var finalResultBlocks = [];
        for (let i = 0; i < finalResult.length; i = i + 8) {
            finalResultBlocks.push(finalResult.slice(i, i + 8));
        }
        for (let index = 0; index < finalResultBlocks.length; index++) {
            originalMsg.value += String.fromCharCode("0b" + finalResultBlocks[index]);
        }
    }
}
/* des encryption function
---------------------------*/
function desEncryption() {
    encryptedMsg.value = "";
    var _keys = createKeys(desKey.value);
    encrypt64BitOfData(originalMsg.value, _keys);
}
function desDecryption() {
    originalMsg.value = "";
    var _keys = createKeys(desKey.value);
    decrypt64BitOfData(encryptedMsg.value, _keys.reverse());

}
/*-------------------------------------------------*/
/*-------------------------------------------------*/
/*-------------------------------------------------*/
/*--------------RC4 cipher-------------------------*/
/*--------------technique--------------------------*/
/*-------------------------------------------------*/
/*-------------------------------------------------*/
/*-------------------------------------------------*/
/*-------------------------------------------------*/
function RC4(key, str) {
    var s = [], t = [], j = 0, x, result = '';
    for (var i = 0; i < 256; i++) {
        s[i] = i;
        t[i] = key.charCodeAt(i % key.length);
    }
    for (i = 0; i < 256; i++) {
        j = (j + s[i] + t[i]) % 256;
        x = s[i];
        s[i] = s[j];
        s[j] = x;
    }
    i = 0;
    j = 0;
    for (var y = 0; y < str.length; y++) {
        i = (i + 1) % 256;
        j = (j + s[i]) % 256;
        x = s[i];
        s[i] = s[j];
        s[j] = x;
        result += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
    }
    return result;
}
function RC4Encryption() {
    encryptedMsg.value = RC4(rc4Key.value, originalMsg.value);
}
function RC4Decryption() {
    originalMsg.value = RC4(rc4Key.value, encryptedMsg.value);
}
/*-------------------------------------------------*/
/*-------------------------------------------------*/
/*-------------------------------------------------*/
/*--------------RSA cipher-------------------------*/
/*--------------technique--------------------------*/
/*-------------------------------------------------*/
/*-------------------------------------------------*/
/*-------------------------------------------------*/
/*-------------------------------------------------*/
var primes = [7, 11, 13, 17, 19, 23, 29, 31];
function generatePrimes() {
    P.value = primes[Math.floor(Math.random() * primes.length)];
    Q.value = primes[Math.floor(Math.random() * primes.length)];
    if (P.value == Q.value) {
        generatePrimes();
    }
}
generateBtn.addEventListener("click", function () {
    generatePrimes();
});

function rel_prime(phiOfN) {
    var rel = 5;
    while (phiOfN % rel === 0) {
        if (rel >= phiOfN) {
            return false;
        }
        rel++;
    }
    return rel;
}
function calculate_d(phi, e) {
    var PHI = phi;
    phi++;
    while (phi % e != 0) {
        phi += PHI;
    }
    return phi / e;
}
function encrypt(n, e, msg) {
    var m = msg;
    for (let i = 0; i < m.length; i++) {
        encryptedMsg.value += String.fromCharCode(Math.pow(m[i].charCodeAt(), e) % n);
    }
}
function decrypt(n, d, msg) {
    var m = msg;
    var N = new SuperInteger(n);
    var D = new SuperInteger(d);
    for (let i = 0; i < m.length; i++) {
        var M = new SuperInteger(m[i].charCodeAt());
        originalMsg.value += String.fromCharCode(M.pow(D).mod(N));
    }
}
function RSAEncryption() {
    encryptedMsg.value = "";
    var n = parseInt(P.value)*parseInt(Q.value);
    var phiOfN = (parseInt(P.value) - 1) * (parseInt(Q.value) - 1);
    var e = rel_prime(phiOfN);
    encrypt(n, e, originalMsg.value);
}
function RSADecryption() {
    originalMsg.value = "";
    var n = parseInt(P.value) * parseInt(Q.value);
    var phiOfN = (parseInt(P.value) - 1) * (parseInt(Q.value) - 1);
    var e = rel_prime(phiOfN);
    var d = calculate_d(phiOfN, e);
    decrypt(n, d, encryptedMsg.value);
}