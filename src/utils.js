import icon__hydrogen_marker from './icons/blue/hydrogen@2x.png';
import icon__green_marker from './icons/green/green@2x.png';
import icon__grey_marker from './icons/grey/grey@2x.png';
import icon__red_marker from './icons/red/red@2x.png';
import icon__green_carsharing_marker from './icons/green/carsharing-green.png';
import icon__yellow_carsharing_marker from './icons/yellow/carsharing-yellow.png';
import icon__red_carsharing_marker from './icons/red/carsharing-red.png';
import icon__green_bikesharing_marker from './icons/green/bikesharing-green.png';
import icon__yellow_bikesharing_marker from './icons/yellow/bikesharing-yellow.png';
import icon__red_bikesharing_marker from './icons/red/bikesharing-red.png';

export function getLatLongFromStationDetail(o) {
  return { lat: o.latitude, lng: o.longitude };
}

export function getLatLongFromSharingStationDetail(o) {
  return { lat: o.scoordinate.y, lng: o.scoordinate.x };
}

export function stationStatusMapper(key, origin) {
  const obj = {
    TEMPORARYUNAVAILABLE: icon__red_marker,
    AVAILABLE: origin !== 'IIT' ? icon__green_marker : icon__hydrogen_marker,
    ACTIVE: origin !== 'IIT' ? icon__green_marker : icon__hydrogen_marker,
    UNKNOWN: icon__grey_marker
  };
  return obj[key] ? obj[key] : icon__grey_marker;
}

export function carsharing_stationStatusMapper(sactive, savaiable) {
  let val;
  if (sactive === undefined && savaiable === undefined) {
    val = icon__grey_marker;
  }
  if (sactive) {
    val = icon__green_carsharing_marker;
  } else if (savaiable) {
    val = icon__yellow_carsharing_marker;
  } else {
    val = icon__red_carsharing_marker;
  }
  // console.log('carsharing icon', val);
  return val;
}

export function bikesharing_stationStatusMapper(sactive, savaiable) {
  let val;
  if (sactive === undefined && savaiable === undefined) {
    val = icon__grey_marker;
  }
  if (sactive) {
    val = icon__green_bikesharing_marker;
  } else if (savaiable) {
    val = icon__yellow_bikesharing_marker;
  } else {
    val = icon__red_bikesharing_marker;
  }
  // console.log('bikesharing icon', val);
  return val;
}

export function debounce(delay, fn) {
  let timerId;
  // return function (...args) {
  return (...args) => {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  };
}

export const getStyle = array => array[0][1];

export const utils_capitalize = s => {
  const words = s.toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

export const utils_truncate = (str, no_words) => {
  const splitted = str.split(' ');

  if (splitted.length > no_words) {
    return `${splitted.splice(0, no_words).join(' ')}...`;
  }
  return splitted.splice(0, no_words).join(' ');
};

export const encodeXml = s => {
  const words = s.replace('&amp;', '&');

  return words
    .replace('&quot;', '"')
    .replace('&#x9;', ' \t ')
    .replace('&#xA;', ' \n ')
    .replace('#xA;', ' \n ')
    .replace('&#xD;', ' \r ')
    .replace('#xD;', ' \r ')
    .replace('&&', '');
};

export const get_user_platform = () => {
  let platform = '';
  if (/windows phone/i.test(navigator.userAgent)) {
    platform = 'Windows Phone';
  }
  if (/android/i.test(navigator.userAgent)) {
    platform = 'Android';
  }
  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
    platform = 'iOS';
  }
  return platform;
};
