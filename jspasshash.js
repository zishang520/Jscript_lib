/**
 * @package js passhash
 * @mail zishang520@gmail.com
 * @version 0.1
 * ???
 * itoa64;
 * iteration_count_log2;
 * portable_hashes;
 * random_state;
 */
function utf8_encode(argString) {
    //  discuss at: http://phpjs.org/functions/utf8_encode/
    // original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: sowberry
    // improved by: Jack
    // improved by: Yves Sucaet
    // improved by: kirilloid
    // bugfixed by: Onno Marsman
    // bugfixed by: Onno Marsman
    // bugfixed by: Ulrich
    // bugfixed by: Rafal Kukawski
    // bugfixed by: kirilloid
    //   example 1: utf8_encode('Kevin van Zonneveld');
    //   returns 1: 'Kevin van Zonneveld'

    if (argString === null || typeof argString === 'undefined') {
        return '';
    }

    var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    var utftext = '',
        start, end, stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode(
                (c1 >> 6) | 192, (c1 & 63) | 128
            );
        } else if ((c1 & 0xF800) != 0xD800) {
            enc = String.fromCharCode(
                (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
            );
        } else { // surrogate pairs
            if ((c1 & 0xFC00) != 0xD800) {
                throw new RangeError('Unmatched trail surrogate at ' + n);
            }
            var c2 = string.charCodeAt(++n);
            if ((c2 & 0xFC00) != 0xDC00) {
                throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
            }
            c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
            enc = String.fromCharCode(
                (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
            );
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.slice(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.slice(start, stringl);
    }

    return utftext;
}

function md5(str) {
    //  discuss at: http://phpjs.org/functions/md5/
    // original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // improved by: Michael White (http://getsprink.com)
    // improved by: Jack
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //    input by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //  depends on: utf8_encode
    //   example 1: md5('Kevin van Zonneveld');
    //   returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'

    var xl;

    var rotateLeft = function(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    };

    var addUnsigned = function(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    };

    var _F = function(x, y, z) {
        return (x & y) | ((~x) & z);
    };
    var _G = function(x, y, z) {
        return (x & z) | (y & (~z));
    };
    var _H = function(x, y, z) {
        return (x ^ y ^ z);
    };
    var _I = function(x, y, z) {
        return (y ^ (x | (~z)));
    };

    var _FF = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _GG = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _HH = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _II = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var convertToWordArray = function(str) {
        var lWordCount;
        var lMessageLength = str.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = new Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };

    var wordToHex = function(lValue) {
        var wordToHexValue = '',
            wordToHexValue_temp = '',
            lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            wordToHexValue_temp = '0' + lByte.toString(16);
            wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
        }
        return wordToHexValue;
    };

    var x = [],
        k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22,
        S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20,
        S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23,
        S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;

    str = utf8_encode(str);
    x = convertToWordArray(str);
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;

    xl = x.length;
    for (k = 0; k < xl; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
    }

    var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

    return temp.toLowerCase();
}

function rand(min, max) {
    //  discuss at: http://phpjs.org/functions/rand/
    // original by: Leslie Hoare
    // bugfixed by: Onno Marsman
    //        note: See the commented out code below for a version which will work with our experimental (though probably unnecessary) srand() function)
    //   example 1: rand(1, 1);
    //   returns 1: 1

    var argc = arguments.length;
    if (argc === 0) {
        min = 0;
        max = 2147483647;
    } else if (argc === 1) {
        throw new Error('Warning: rand() expects exactly 2 parameters, 1 given');
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;

    /*
    // See note above for an explanation of the following alternative code
    // +   reimplemented by: Brett Zamir (http://brett-zamir.me)
    // -    depends on: srand
    // %          note 1: This is a very possibly imperfect adaptation from the PHP source code
    // 0x7fffffff
    var rand_seed, ctx, PHP_RAND_MAX=2147483647;
    if (!this.php_js || this.php_js.rand_seed === undefined) {
      this.srand();
    }
    rand_seed = this.php_js.rand_seed;
    var argc = arguments.length;
    if (argc === 1) {
      throw new Error('Warning: rand() expects exactly 2 parameters, 1 given');
    }
    var do_rand = function (ctx) {
      return ((ctx * 1103515245 + 12345) % (PHP_RAND_MAX + 1));
    };
    var php_rand = function (ctxArg) {
     // php_rand_r
      this.php_js.rand_seed = do_rand(ctxArg);
      return parseInt(this.php_js.rand_seed, 10);
    };
    var number = php_rand(rand_seed);
    if (argc === 2) {
      number = min + parseInt(parseFloat(parseFloat(max) - min + 1.0) * (number/(PHP_RAND_MAX + 1.0)), 10);
    }
    return number;
    */
}

function uniqid(prefix, more_entropy) {
    /**
     * ???Ψһ??d
     * @Author   ZiShang520
     * @DateTime 2016-01-14T09:56:11+0800
     * discuss at: http://phpjs.org/functions/uniqid/
     * original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
     * revised by: Kankrelune (http://www.webfaktory.info/)
     * note: Uses an internal counter (in php_js global) to avoid collisio
     * @param    {[type]}                 prefix       [description]
     * @param    {[type]}                 more_entropy [description]
     * @return   {[type]}                              [description]
     */
    if (typeof prefix === 'undefined') {
        prefix = '';
    }

    var retId;
    var formatSeed = function(seed, reqWidth) {
        seed = parseInt(seed, 10)
            .toString(16); // to hex str
        if (reqWidth < seed.length) { // so long we split
            return seed.slice(seed.length - reqWidth);
        }
        if (reqWidth > seed.length) { // so short we pad
            return Array(1 + (reqWidth - seed.length))
                .join('0') + seed;
        }
        return seed;
    };

    // BEGIN REDUNDANT
    if (!this.php_js) {
        this.php_js = {};
    }
    // END REDUNDANT
    if (!this.php_js.uniqidSeed) { // init seed with big random int
        this.php_js.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
    }
    this.php_js.uniqidSeed++;

    retId = prefix; // start with prefix, add current milliseconds hex string
    retId += formatSeed(parseInt(new Date()
        .getTime() / 1000, 10), 8);
    retId += formatSeed(this.php_js.uniqidSeed, 5); // add seed hex string
    if (more_entropy) {
        // for more entropy we add a float lower to 10
        retId += (Math.random() * 10)
            .toFixed(8)
            .toString();
    }

    return retId;
}

function microtime(get_as_float) {
    /**
     * ???microtime
     * @Author   ZiShang520
     * @DateTime 2016-01-14T09:56:41+0800
     * discuss at: http://phpjs.org/functions/microtime/
     *  original by: Paulo Freitas
     * @param    {[type]}                 get_as_float [description]
     * @return   {[type]}                              [description]
     */
    var now = new Date()
        .getTime() / 1000;
    var s = parseInt(now, 10);

    return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
}

function pack(format) {
    //  discuss at: http://phpjs.org/functions/pack/
    // original by: Tim de Koning (http://www.kingsquare.nl)
    //    parts by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // bugfixed by: Tim de Koning (http://www.kingsquare.nl)
    //        note: Float encoding by: Jonas Raoni Soares Silva
    //        note: Home: http://www.kingsquare.nl/blog/12-12-2009/13507444
    //        note: Feedback: phpjs-pack@kingsquare.nl
    //        note: 'machine dependent byte order and size' aren't
    //        note: applicable for JavaScript; pack works as on a 32bit,
    //        note: little endian machine
    //   example 1: pack('nvc*', 0x1234, 0x5678, 65, 66);
    //   returns 1: '4xVAB'

    var formatPointer = 0,
        argumentPointer = 1,
        result = '',
        argument = '',
        i = 0,
        r = [],
        instruction, quantifier, word, precisionBits, exponentBits, extraNullCount;

    // vars used by float encoding
    var bias, minExp, maxExp, minUnnormExp, status, exp, len, bin, signal, n, intPart, floatPart, lastBit, rounded, j,
        k, tmpResult;

    while (formatPointer < format.length) {
        instruction = format.charAt(formatPointer);
        quantifier = '';
        formatPointer++;
        while ((formatPointer < format.length) && (format.charAt(formatPointer)
                .match(/[\d\*]/) !== null)) {
            quantifier += format.charAt(formatPointer);
            formatPointer++;
        }
        if (quantifier === '') {
            quantifier = '1';
        }

        // Now pack variables: 'quantifier' times 'instruction'
        switch (instruction) {
            case 'a':
                // NUL-padded string
            case 'A':
                // SPACE-padded string
                if (typeof arguments[argumentPointer] === 'undefined') {
                    throw new Error('Warning:  pack() Type ' + instruction + ': not enough arguments');
                } else {
                    argument = String(arguments[argumentPointer]);
                }
                if (quantifier === '*') {
                    quantifier = argument.length;
                }
                for (i = 0; i < quantifier; i++) {
                    if (typeof argument[i] === 'undefined') {
                        if (instruction === 'a') {
                            result += String.fromCharCode(0);
                        } else {
                            result += ' ';
                        }
                    } else {
                        result += argument[i];
                    }
                }
                argumentPointer++;
                break;
            case 'h':
                // Hex string, low nibble first
            case 'H':
                // Hex string, high nibble first
                if (typeof arguments[argumentPointer] === 'undefined') {
                    throw new Error('Warning: pack() Type ' + instruction + ': not enough arguments');
                } else {
                    argument = arguments[argumentPointer];
                }
                if (quantifier === '*') {
                    quantifier = argument.length;
                }
                if (quantifier > argument.length) {
                    throw new Error('Warning: pack() Type ' + instruction + ': not enough characters in string');
                }
                for (i = 0; i < quantifier; i += 2) {
                    // Always get per 2 bytes...
                    word = argument[i];
                    if (((i + 1) >= quantifier) || typeof argument[i + 1] === 'undefined') {
                        word += '0';
                    } else {
                        word += argument[i + 1];
                    }
                    // The fastest way to reverse?
                    if (instruction === 'h') {
                        word = word[1] + word[0];
                    }
                    result += String.fromCharCode(parseInt(word, 16));
                }
                argumentPointer++;
                break;

            case 'c':
                // signed char
            case 'C':
                // unsigned char
                // c and C is the same in pack
                if (quantifier === '*') {
                    quantifier = arguments.length - argumentPointer;
                }
                if (quantifier > (arguments.length - argumentPointer)) {
                    throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments');
                }

                for (i = 0; i < quantifier; i++) {
                    result += String.fromCharCode(arguments[argumentPointer]);
                    argumentPointer++;
                }
                break;

            case 's':
                // signed short (always 16 bit, machine byte order)
            case 'S':
                // unsigned short (always 16 bit, machine byte order)
            case 'v':
                // s and S is the same in pack
                if (quantifier === '*') {
                    quantifier = arguments.length - argumentPointer;
                }
                if (quantifier > (arguments.length - argumentPointer)) {
                    throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments');
                }

                for (i = 0; i < quantifier; i++) {
                    result += String.fromCharCode(arguments[argumentPointer] & 0xFF);
                    result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF);
                    argumentPointer++;
                }
                break;

            case 'n':
                // unsigned short (always 16 bit, big endian byte order)
                if (quantifier === '*') {
                    quantifier = arguments.length - argumentPointer;
                }
                if (quantifier > (arguments.length - argumentPointer)) {
                    throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments');
                }

                for (i = 0; i < quantifier; i++) {
                    result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF);
                    result += String.fromCharCode(arguments[argumentPointer] & 0xFF);
                    argumentPointer++;
                }
                break;

            case 'i':
                // signed integer (machine dependent size and byte order)
            case 'I':
                // unsigned integer (machine dependent size and byte order)
            case 'l':
                // signed long (always 32 bit, machine byte order)
            case 'L':
                // unsigned long (always 32 bit, machine byte order)
            case 'V':
                // unsigned long (always 32 bit, little endian byte order)
                if (quantifier === '*') {
                    quantifier = arguments.length - argumentPointer;
                }
                if (quantifier > (arguments.length - argumentPointer)) {
                    throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments');
                }

                for (i = 0; i < quantifier; i++) {
                    result += String.fromCharCode(arguments[argumentPointer] & 0xFF);
                    result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF);
                    result += String.fromCharCode(arguments[argumentPointer] >> 16 & 0xFF);
                    result += String.fromCharCode(arguments[argumentPointer] >> 24 & 0xFF);
                    argumentPointer++;
                }

                break;
            case 'N':
                // unsigned long (always 32 bit, big endian byte order)
                if (quantifier === '*') {
                    quantifier = arguments.length - argumentPointer;
                }
                if (quantifier > (arguments.length - argumentPointer)) {
                    throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments');
                }

                for (i = 0; i < quantifier; i++) {
                    result += String.fromCharCode(arguments[argumentPointer] >> 24 & 0xFF);
                    result += String.fromCharCode(arguments[argumentPointer] >> 16 & 0xFF);
                    result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF);
                    result += String.fromCharCode(arguments[argumentPointer] & 0xFF);
                    argumentPointer++;
                }
                break;

            case 'f':
                // float (machine dependent size and representation)
            case 'd':
                // double (machine dependent size and representation)
                // version original by IEEE754
                precisionBits = 23;
                exponentBits = 8;
                if (instruction === 'd') {
                    precisionBits = 52;
                    exponentBits = 11;
                }

                if (quantifier === '*') {
                    quantifier = arguments.length - argumentPointer;
                }
                if (quantifier > (arguments.length - argumentPointer)) {
                    throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments');
                }
                for (i = 0; i < quantifier; i++) {
                    argument = arguments[argumentPointer];
                    bias = Math.pow(2, exponentBits - 1) - 1;
                    minExp = -bias + 1;
                    maxExp = bias;
                    minUnnormExp = minExp - precisionBits;
                    status = isNaN(n = parseFloat(argument)) || n === -Infinity || n === +Infinity ? n : 0;
                    exp = 0;
                    len = 2 * bias + 1 + precisionBits + 3;
                    bin = new Array(len);
                    signal = (n = status !== 0 ? 0 : n) < 0;
                    n = Math.abs(n);
                    intPart = Math.floor(n);
                    floatPart = n - intPart;

                    for (k = len; k;) {
                        bin[--k] = 0;
                    }
                    for (k = bias + 2; intPart && k;) {
                        bin[--k] = intPart % 2;
                        intPart = Math.floor(intPart / 2);
                    }
                    for (k = bias + 1; floatPart > 0 && k; --floatPart) {
                        (bin[++k] = ((floatPart *= 2) >= 1) - 0);
                    }
                    for (k = -1; ++k < len && !bin[k];) {}

                    if (bin[(lastBit = precisionBits - 1 + (k = (exp = bias + 1 - k) >= minExp && exp <= maxExp ? k + 1 :
                            bias + 1 - (exp = minExp - 1))) + 1]) {
                        if (!(rounded = bin[lastBit])) {
                            for (j = lastBit + 2; !rounded && j < len; rounded = bin[j++]) {}
                        }
                        for (j = lastBit + 1; rounded && --j >= 0;
                            (bin[j] = !bin[j] - 0) && (rounded = 0)) {}
                    }

                    for (k = k - 2 < 0 ? -1 : k - 3; ++k < len && !bin[k];) {}

                    if ((exp = bias + 1 - k) >= minExp && exp <= maxExp) {
                        ++k;
                    } else {
                        if (exp < minExp) {
                            if (exp !== bias + 1 - len && exp < minUnnormExp) { /*"encodeFloat::float underflow" */ }
                            k = bias + 1 - (exp = minExp - 1);
                        }
                    }

                    if (intPart || status !== 0) {
                        exp = maxExp + 1;
                        k = bias + 2;
                        if (status === -Infinity) {
                            signal = 1;
                        } else if (isNaN(status)) {
                            bin[k] = 1;
                        }
                    }

                    n = Math.abs(exp + bias);
                    tmpResult = '';

                    for (j = exponentBits + 1; --j;) {
                        tmpResult = (n % 2) + tmpResult;
                        n = n >>= 1;
                    }

                    n = 0;
                    j = 0;
                    k = (tmpResult = (signal ? '1' : '0') + tmpResult + bin.slice(k, k + precisionBits)
                            .join(''))
                        .length;
                    r = [];

                    for (; k;) {
                        n += (1 << j) * tmpResult.charAt(--k);
                        if (j === 7) {
                            r[r.length] = String.fromCharCode(n);
                            n = 0;
                        }
                        j = (j + 1) % 8;
                    }

                    r[r.length] = n ? String.fromCharCode(n) : '';
                    result += r.join('');
                    argumentPointer++;
                }
                break;

            case 'x':
                // NUL byte
                if (quantifier === '*') {
                    throw new Error('Warning: pack(): Type x: \'*\' ignored');
                }
                for (i = 0; i < quantifier; i++) {
                    result += String.fromCharCode(0);
                }
                break;

            case 'X':
                // Back up one byte
                if (quantifier === '*') {
                    throw new Error('Warning: pack(): Type X: \'*\' ignored');
                }
                for (i = 0; i < quantifier; i++) {
                    if (result.length === 0) {
                        throw new Error('Warning: pack(): Type X:' + ' outside of string');
                    } else {
                        result = result.substring(0, result.length - 1);
                    }
                }
                break;

            case '@':
                // NUL-fill to absolute position
                if (quantifier === '*') {
                    throw new Error('Warning: pack(): Type X: \'*\' ignored');
                }
                if (quantifier > result.length) {
                    extraNullCount = quantifier - result.length;
                    for (i = 0; i < extraNullCount; i++) {
                        result += String.fromCharCode(0);
                    }
                }
                if (quantifier < result.length) {
                    result = result.substring(0, quantifier);
                }
                break;

            default:
                throw new Error('Warning:  pack() Type ' + instruction + ': unknown format code');
        }
    }
    if (argumentPointer < arguments.length) {
        throw new Error('Warning: pack(): ' + (arguments.length - argumentPointer) + ' arguments unused');
    }

    return result;
}

function ord(string) {
    //  discuss at: http://phpjs.org/functions/ord/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Onno Marsman
    // improved by: Brett Zamir (http://brett-zamir.me)
    //    input by: incidence
    //   example 1: ord('K');
    //   returns 1: 75
    //   example 2: ord('\uD800\uDC00'); // surrogate pair to create a single Unicode character
    //   returns 2: 65536

    var str = string + '',
        code = str.charCodeAt(0);
    if (0xD800 <= code && code <= 0xDBFF) { // High surrogate (could change last hex to 0xDB7F to treat high private surrogates as single characters)
        var hi = code;
        if (str.length === 1) {
            return code; // This is just a high surrogate with no following low surrogate, so we return its value;
            // we could also throw an error as it is not a complete character, but someone may want to know
        }
        var low = str.charCodeAt(1);
        return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
    }
    if (0xDC00 <= code && code <= 0xDFFF) { // Low surrogate
        return code; // This is just a low surrogate with no preceding high surrogate, so we return its value;
        // we could also throw an error as it is not a complete character, but someone may want to know
    }
    return code;
}

function min() {
    //  discuss at: http://phpjs.org/functions/min/
    // original by: Onno Marsman
    //  revised by: Onno Marsman
    // improved by: Jack
    //        note: Long code cause we're aiming for maximum PHP compatibility
    //   example 1: min(1, 3, 5, 6, 7);
    //   returns 1: 1
    //   example 2: min([2, 4, 5]);
    //   returns 2: 2
    //   example 3: min(0, 'hello');
    //   returns 3: 0
    //   example 4: min('hello', 0);
    //   returns 4: 'hello'
    //   example 5: min(-1, 'hello');
    //   returns 5: -1
    //   example 6: min([2, 4, 8], [2, 5, 7]);
    //   returns 6: [2, 4, 8]

    var ar, retVal, i = 0,
        n = 0,
        argv = arguments,
        argc = argv.length,
        _obj2Array = function(obj) {
            if (Object.prototype.toString.call(obj) === '[object Array]') {
                return obj;
            }
            var ar = [];
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    ar.push(obj[i]);
                }
            }
            return ar;
        }; //function _obj2Array
    _compare = function(current, next) {
        var i = 0,
            n = 0,
            tmp = 0,
            nl = 0,
            cl = 0;

        if (current === next) {
            return 0;
        } else if (typeof current === 'object') {
            if (typeof next === 'object') {
                current = _obj2Array(current);
                next = _obj2Array(next);
                cl = current.length;
                nl = next.length;
                if (nl > cl) {
                    return 1;
                } else if (nl < cl) {
                    return -1;
                }
                for (i = 0, n = cl; i < n; ++i) {
                    tmp = _compare(current[i], next[i]);
                    if (tmp == 1) {
                        return 1;
                    } else if (tmp == -1) {
                        return -1;
                    }
                }
                return 0;
            }
            return -1;
        } else if (typeof next === 'object') {
            return 1;
        } else if (isNaN(next) && !isNaN(current)) {
            if (current == 0) {
                return 0;
            }
            return (current < 0 ? 1 : -1);
        } else if (isNaN(current) && !isNaN(next)) {
            if (next == 0) {
                return 0;
            }
            return (next > 0 ? 1 : -1);
        }

        if (next == current) {
            return 0;
        }
        return (next > current ? 1 : -1);
    }; //function _compare
    if (argc === 0) {
        throw new Error('At least one value should be passed to min()');
    } else if (argc === 1) {
        if (typeof argv[0] === 'object') {
            ar = _obj2Array(argv[0]);
        } else {
            throw new Error('Wrong parameter count for min()');
        }
        if (ar.length === 0) {
            throw new Error('Array must contain at least one element for min()');
        }
    } else {
        ar = argv;
    }

    retVal = ar[0];
    for (i = 1, n = ar.length; i < n; ++i) {
        if (_compare(retVal, ar[i]) == -1) {
            retVal = ar[i];
        }
    }

    return retVal;
}

function strpos(haystack, needle, offset) {
    //  discuss at: http://phpjs.org/functions/strpos/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Onno Marsman
    // improved by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Daniel Esteban
    //   example 1: strpos('Kevin van Zonneveld', 'e', 5);
    //   returns 1: 14

    var i = (haystack + '').indexOf(needle, (offset || 0));
    return i === -1 ? false : i;
}

function chr(codePt) {
    //  discuss at: http://phpjs.org/functions/chr/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Brett Zamir (http://brett-zamir.me)
    //   example 1: chr(75) === 'K';
    //   example 1: chr(65536) === '\uD800\uDC00';
    //   returns 1: true
    //   returns 1: true

    if (codePt > 0xFFFF) { // Create a four-byte string (length 2) since this code point is high
        //   enough for the UTF-16 encoding (JavaScript internal use), to
        //   require representation with two surrogates (reserved non-characters
        //   used for building other characters; the first is "high" and the next "low")
        codePt -= 0x10000;
        return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
    }
    return String.fromCharCode(codePt);
}
/**
 * phphash
 * @Author   ZiShang520
 * @DateTime 2016-01-14T11:30:19+0800
 * @param    {[type]}                 iteration_count_log2 [description]
 * @param    {[type]}                 portable_hashes      [description]
 */
function PasswordHash(iteration_count_log2, portable_hashes) {
    this.itoa64 = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    if (iteration_count_log2 < 4 || iteration_count_log2 > 31) {
        iteration_count_log2 = 8;
    }
    this.iteration_count_log2 = iteration_count_log2;

    this.portable_hashes = portable_hashes;
    this.random_state = microtime() + uniqid(rand(), true);
};

var phtotype = PasswordHash.prototype;
phtotype.get_random_bytes = function(count) {
    output = '';
    for (var i = 0; i < count; i += 16) {
        this.random_state = md5(microtime() + this.random_state);
        output += pack('H*', md5(this.random_state));
    }
    output = output.substr(0, count);
    return output;
};
phtotype.encode64 = function(input, count) {
    output = '';
    i = 0;
    do {
        value = ord(input[i++]);
        output += this.itoa64[value & 0x3f];
        if (i < count)
            value |= ord(input[i]) << 8;
        output += this.itoa64[(value >> 6) & 0x3f];
        if (i++ >= count)
            break;
        if (i < count)
            value |= ord(input[i]) << 16;
        output += this.itoa64[(value >> 12) & 0x3f];
        if (i++ >= count)
            break;
        output += this.itoa64[(value >> 18) & 0x3f];
    } while (i < count);

    return output;
};
phtotype.gensalt_private = function(input) {
    output = '$P$';
    output += this.itoa64[min(this.iteration_count_log2 + 5, 30)];
    output += this.encode64(input, 6);
    return output;
};
phtotype.crypt_private = function(password, setting) {
    output = '*0';
    if (setting.substr(0, 2) == output)
        output = '*1';

    if (setting.substr(0, 3) != '$P$')
        return output;

    count_log2 = strpos(this.itoa64, setting[3]);
    if (count_log2 < 7 || count_log2 > 30)
        return output;

    count = 1 << count_log2;

    salt = setting.substr(4, 8);

    if (salt.length != 8)
        return output;

    hash = pack('H*', md5(salt + password));
    do {
        hash = pack('H*', md5(hash + password));
    } while (--count);

    output = setting.substr(0, 12);
    output += this.encode64(hash, 16);

    return output;
};
phtotype.gensalt_extended = function(input) {
    count_log2 = min(this.iteration_count_log2 + 8, 24);
    count = (1 << count_log2) - 1;

    output = '_';
    output += this.itoa64[count & 0x3f];
    output += this.itoa64[(count >> 6) & 0x3f];
    output += this.itoa64[(count >> 12) & 0x3f];
    output += this.itoa64[(count >> 18) & 0x3f];

    output += this.encode64(input, 3);

    return output;
};
phtotype.gensalt_blowfish = function(input) {

    itoa64 = './ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    output = '$2a$';
    output += chr(ord('0') + parseInt(this.iteration_count_log2, 10) / 10);
    output += chr(ord('0') + parseInt(this.iteration_count_log2, 10) % 10);
    output += '';

    i = 0;
    do {
        c1 = ord(input[i++]);
        output += itoa64[c1 >> 2];
        c1 = (c1 & 0x03) << 4;
        if (i >= 16) {
            output += itoa64[c1];
            break;
        }

        c2 = ord(input[i++]);
        c1 |= c2 >> 4;
        output += itoa64[c1];
        c1 = (c2 & 0x0f) << 2;

        c2 = ord(input[i++]);
        c1 |= c2 >> 6;
        output += itoa64[c1];
        output += itoa64[c2 & 0x3f];
    } while (1);

    return output;
};
phtotype.HashPassword = function(password) {
    random = '';
    if (random.length < 6)
        random = this.get_random_bytes(6);
    hash = this.crypt_private(password, this.gensalt_private(random));
    if (hash.length == 34)
        return hash;
    return '*';
};
phtotype.CheckPassword = function(password, stored_hash) {
    hash = this.crypt_private(password, stored_hash);

    return hash == stored_hash;
};
module.exports = PasswordHash;
