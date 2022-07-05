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

function checkCountryFormat (country, bban){
    let status = true;
    let correctCountry = true;

    switch (country){
        case 'CR':
        case 'DE':
            status = /^([0-9]{18})$/.test(bban);
            break;
        case 'IE':
        case 'GB':
            status = /^([A-Z]{4}[0-9]{14})$/.test(bban);
            break;
        case 'PK':
        case 'RO':
            status = /^([A-Z]{4}[0-9]{16})$/.test(bban);
            break;
        case 'LC':
            status = /^([A-Z]{4}[0-9]{24})$/.test(bban);
            break;
        case 'SA':
        case 'SK':
        case 'ES':
        case 'SE':
            status = /^([0-9]{20})$/.test(bban);
            break;
        case 'BE':
            status = /^([0-9]{12})$/.test(bban);
            break;
        case 'FR':
        case 'GR':
            status = /^([0-9]{23})$/.test(bban);
            break;
        case 'PL':
            status = /^([0-9]{24})$/.test(bban);
            break;
        case 'PT':
            status = /^([0-9]{21})$/.test(bban);
            break;
        case 'CH':
            status = /^([0-9]{17})$/.test(bban);
            break;
        case 'BR':
            status = /^([0-9]{23}[A-Z]{1}[0-9]{1})$/.test(bban);
            break;
        case 'MU':
            status = /^([A-Z]{4}[0-9]{19}[A-Z]{3})$/.test(bban);
            break;
        default:
            status = false;
            correctCountry = false;
    }

    return (status && correctCountry);
}

exports.checkIBAN = function (iban){
    let result = {};
    if (!checkLength(iban)) {
        result['status'] = 1;
        result['reason'] = 'IBAN size must be between ' + MIN_IBAN_LENGTH +
                           ' and ' + MAX_IBAN_LENGTH + ' characters';
    }else if (!checkForCountryCode(iban.substring(0,2).toUpperCase())) {
        result['status'] = 2;
        result['reason'] = 'First two characters are supposed to be a country code';
    }else if (!checkCountryFormat(iban.substring(0,2).toUpperCase(),
                                  iban.substring(4,iban.length).toUpperCase())) {
        result['status'] = 3;
        result['reason'] = 'Format NOT OK or country code does not exist';
    }else{
        result['status'] = 0;
        result['reason'] = 'IBAN OK';
    }

    return result;
}