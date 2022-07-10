/*************************************************
   This module provides all service functions
   required to run IBAN checks
   Exports:
     - checkIBAN(iban)
     this function works as an aggregator for
     all checks and composes error message if
     checks fail
   Internal functions:
     - checkLength(iban)
     runs the length check on the input
     - checkForCountryCode(country)
     runs the specific check for first 2 chars
     being symbols. Does not validate country
     codes, only that a code is present
     - checkCountryFormat(country, bban)
     runs different regexp matching the format
     dependable on country code
 *************************************************/

const MAX_IBAN_LENGTH = 34;
const MIN_IBAN_LENGTH = 16;
const MOD_VALUE = 97;
const MOD_FIRST_PART = 9;
const MOD_NEXT_PART_MAX = 7;
const CHAR_CODE_VALUE = 55;
const SWAP_PART_SIZE = 4;

function rearrangeIBAN(iban){
    return (iban.substring(SWAP_PART_SIZE, iban.length) + iban.substring(0, SWAP_PART_SIZE));
}

function ibanToInteger(iban){
    let result = '';
    for(let i=0; i < iban.length; i++){
        if (/^([A-Z]{1})$/.test(iban[i])) {
            result += iban[i].charCodeAt(0) - CHAR_CODE_VALUE;
        } else {
            result += iban[i];
        }
    }
    return result;
}

function mod(sequence) {
    let done = false;
    let part = sequence.substring(0, MOD_FIRST_PART);
    let rest = sequence.substring(MOD_FIRST_PART, sequence.length);
    let result = part % MOD_VALUE;

    while (!done) {
        if (rest.length > MOD_NEXT_PART_MAX) {
            part = result + rest.substring(0, MOD_NEXT_PART_MAX);
            result = part % MOD_VALUE;
            rest = rest.substring(MOD_NEXT_PART_MAX, rest.length);
        } else if (rest.length > 0) {
            part = result + rest.substring(0, rest.length);
            result = part % MOD_VALUE;
            rest = ''; // last part of the sequence
        } else {
            done = true;
        }
    }

    return result;
}

function checkLength (iban){
    let result = true;
    if (iban.length > MAX_IBAN_LENGTH ||
        iban.length < MIN_IBAN_LENGTH)
        result = false;

    return result;
}

function checkForCountryCode (country){
    return /^([A-Z]{2})$/.test(country);
}

exports.checkIBAN = function (iban){
    let result = {};
    let rest = 0;

    if (!checkLength(iban)) {
        result['status'] = 1;
        result['reason'] = 'IBAN size must be between ' + MIN_IBAN_LENGTH +
            ' and ' + MAX_IBAN_LENGTH + ' characters';
    }else if (!checkForCountryCode(iban.substring(0,2).toUpperCase())) {
        result['status'] = 2;
        result['reason'] = 'First two characters are supposed to be a country code';
    }else if ((rest = mod(ibanToInteger(rearrangeIBAN(iban.toUpperCase())))) === 1) {
        result['status'] = 0;
        result['reason'] = 'IBAN OK';
    } else if (isNaN(rest)){
        result['status'] = 3;
        result['reason'] = 'IBAN format is NOT OK';
    } else {
        result['status'] = 4;
        result['reason'] = 'IBAN mod is ' + rest.toString();
    }

    return result;
}