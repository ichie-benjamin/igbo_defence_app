import {Linking} from 'react-native'



const FormData = global.FormData;


export function chatSupport(num) {
    // const link = 'whatsapp://send?text=Hello splash123&phone=+2348116269744'
    const link = 'https://api.whatsapp.com/send?text=Hello Bookings&phone='+num

    Linking.openURL(link);

}

const log_print = __DEV__; //set to false if in production

export const logFunction = (tag, message) => {
    if (log_print) {
        console.log(tag, JSON.stringify(message,null, 2))
    }
}

export function numberWithComma(num) {
    let decimalPart;

    const array = Math.floor(num).toString().split('');
    let index = -3;
    while (array.length + index > 0) {
        array.splice(index, 0, ',');
        index -= 4;
    }

    if (2 > 0) {
        num = parseFloat(num)
        decimalPart = num.toFixed(2).split(".")[1];
        return array.join('') + "." + decimalPart;
    }
    return array.join('');
}

export function calculateOffPercentage(original, special) {
    let off = 0;
    let diff = original - special;
    off = numberWithComma(diff / original * 100);
    return off
}
