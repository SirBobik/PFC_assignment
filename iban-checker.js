const MAX_IBAN_LENGTH = 34;
const MIN_IBAN_LENGTH = 16;

function checkLength (iban){
    let result = true;
    if (iban.length > MAX_IBAN_LENGTH ||
        iban.length < MIN_IBAN_LENGTH)
        result = false;

    return result;
}

function checkCountry (country){
    return /^([A-Z2])$/.test(country);
}

exports.checkIBAN = function (iban){
    let result = {};
    if (!checkLength(iban)) {
        result['status'] = 1;
        result['reason'] = 'IBAN size must be between ' + MIN_IBAN_LENGTH +
                           ' and ' + MAX_IBAN_LENGTH + ' characters';
    }else if(!checkCountry(iban.substring(0,2).toUpperCase())) {
        result['status'] = 2;
        result['reason'] = 'First two characters are supposed to be a country code';
    }else {
        result['status'] = 0;
        result['reason'] = 'IBAN OK';
    }


    return result;
}