import { useState, useEffect } from "react";

/**
 * 
 * @param {Array} array - The array to search in.
 * @param {*} value - The value to search for.
 * @return {boolean} - True if the value is present in the array, or false otherwise.
 */
export const contains = (array, value) => {
  // We check if array is an array. If it is not, we return false.
  if (Array.isArray(array)) {
    // We use the Number() method to convert value to a number.
    // If the conversion fails, we return false.
    const result = Number(value);
    if (!isNaN(result)) {
      // We use the includes() method to check if result is present
      // in array. If it is, we return true.
      if (array.includes(result)) {
        return true;
      }
    }
  }
  // If none of the above conditions are true, we return false.
  return false;
}

/**
 * 
 * @param {Array} array - The array to search in.
 * @param {*} value - The value to search for.
 * @return {boolean} - True if the value is present in the array, or false otherwise.
 */
export const containsInv = (array, value) => {
  // We check if array is an array. If it is not, we return false.
  if (Array.isArray(array)) {
    // We use the Number() method to convert value to a number.
    // If the conversion fails, we return false.
    const result = Number(value);
    if (!isNaN(result)) {
      // We use the includes() method to check if result is present
      // in array. If it is, we return true.
      if (array.includes(result)) {
        return false;
      }
    }
  }
  // If none of the above conditions are true, we return false.
  return true;
}

/**
 * Check if an array contains an object with a specific key and value.
 *
 * @param {Array} array - The array to search.
 * @param {string} key - The key to search for.
 * @param {*} value - The value to compare against.
 * @returns {boolean} - `true` if the array contains an object with the specified key and value, `false` otherwise.
 */
export const containsKey = (array, key, value) => {
  // Check if the array is an array. If it is not, return false.
  if (Array.isArray(array)) {
    // Filter the array to only include objects with the specified key.
    const filteredObjects = array.filter(obj => Object.keys(obj).includes(key));
    // Map the filtered objects to a boolean value indicating whether
    // the value of the specified key is equal to the specified value.
    return filteredObjects.map(obj => obj[key] === value).includes(true);
  }
  // If none of the above conditions are true, return false.
  return false;
}
/**
 * Check if an array does not contain an object with a specific key and value.
 *
 * @param {Array} array - The array to search.
 * @param {string} key - The key to search for.
 * @param {*} value - The value to compare against.
 * @returns {boolean} - `false` if the array contains an object with the specified key and value, `true` otherwise.
 */
 export const containsKeyInv = (array, key, value) => {
  // Check if the array is an array. If it is not, return true.
  if (Array.isArray(array)) {
    // Filter the array to only include objects with the specified key.
    const filteredObjects = array.filter(obj => Object.keys(obj).includes(key));
    // Map the filtered objects to a boolean value indicating whether
    // the value of the specified key is equal to the specified value.
    // If any of the objects contain the specified key and value, return false.
    return !filteredObjects.map(obj => obj[key] === value).includes(true);
  }
  // If none of the above conditions are true, return true.
  return true;
}

/**
 * Retrieves a value from local storage with the specified key,
 * or returns the provided default value if no value is found.
 *
 * @param {string} key The key to use for looking up the value in local storage.
 * @param {*} defaultValue The default value to return if no value is found in local storage.
 * @return {*} The value associated with the provided key in local storage, or the default value if not found.
 */
const getStorageValue =(key, defaultValue) => {
  // Attempt to retrieve the value from local storage
  const saved = localStorage.getItem(key);
  // If a value has been found, parse it from JSON and return it otherwise return the default value.
  const value = saved !== undefined  ? JSON.parse(saved) : defaultValue;
  // Returns the value.
  return value;
};

/**
 * A hook for using local storage in a React component
 * @param {string} key - The key to use for reading and writing the value in local storage
 * @param {any} defaultValue - The default value to use if the key is not found in local storage
 * @return {[any, (value: any) => void]} An array containing the current value from local storage and a function for updating the value
 */
export const useLocalStorage = (key, defaultValue) => {
  // Initialize the value with the default value from local storage
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  // Set up an effect to update the value in local storage when the key or value changes
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  // Return the current value and a function for updating the value
  return [value, setValue];
};
//::::::::::::::::::::::::::::::::::::::::DATE:::::::::::::::::::::::::::::::::::::::
/**
 * Converts a Unix timestamp to a local date and time
 * @param {number} value - The Unix timestamp to convert
 * @return {string} The local date and time in the format "YY-MM-DD HH:MM"
 */
export const ConvertEpochToLocalDate = value => {
  // <========== look for testnet ==================
  // let myDate = new Date(Number(value - 3600) * 1000);
  value = Number(value)
  value += 3600;
  // value -= 3600;
  let myDate = new Date(value  * 1000);
  myDate = myDate.toISOString();
  return myDate;
};

/**
 * Converts a date string to a Unix timestamp in UTC.
 * @param {string} date - The date to convert, in the format "YYYY-MM-DD".
 * @return {uint} The Unix timestamp for the given date in UTC.
 */
export const convertDateToUnixTimestamp = date => {
  const dateObject = new Date(date);
  const timeZoneOffset = dateObject.getTimezoneOffset();
  dateObject.setMinutes(dateObject.getMinutes() + timeZoneOffset);
  return dateObject.getTime() / 1000;
};

/**
 * Converts a date in string format to a more readable format
 * @param {string} dateString - The date to convert, in string format
 * @return {string} The converted date in the format "YY-MM-DD"
 */
export const convertDate = dateString => {
  let date = new Date(dateString);
  date = date.toISOString().substr(0, 10);
  return date;
};

/**
*This function converts a date string in the format "YYYY-MM-DD" to a local date.
*
*@param {string} dateString - The date to convert, in the format "YYYY-MM-DD"
*@return {string} - The converted date, in the format "DD/MM/YY"
*/
export const convertDateToLocal = dateString => {
  // Create a new Date object from the input date string
  const date = new Date(dateString);
  // <========== look for testnet ==================
  // Remove 3600 seconds from the date object
  date.setSeconds(date.getSeconds() - 3600);
  const options = {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit'
  };
  const localDate = date.toLocaleString(undefined, options)+ ' ' + date.toLocaleTimeString();
  return localDate;
}

/**
 * Retrieves the current Unix timestamp
 * @return {number} The Unix timestamp in seconds
 */
export const getCurrentTimestamp = () => {
  const currentDate = new Date();
  const utcString = currentDate.toUTCString();
  let dateObject = new Date(utcString);
  // <========== look for testnet ==================
  // dateObject.setSeconds(dateObject.getSeconds() - 3600);
  let timestamp = dateObject.getTime() / 1000;
  // timestamp -= 3600;
  return timestamp;
}

/**
* This function compares a given date to the current date and returns a boolean value indicating whether
* the given date is in the future or not.
*
*@param {string} dateString - The date to compare, in the format "8/12/22"
*@return {boolean} - True if the given date is in the future, false otherwise.
*/
export const compareDate = dateString => {
  const dateObject = new Date(dateString);
  if (isNaN(dateObject)) {
    return false;
  }
  const timeZoneOffset = dateObject.getTimezoneOffset();
  dateObject.setMinutes(dateObject.getMinutes() + timeZoneOffset);
  const dateTimestamp = Date.parse(dateObject, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
  let nowTimestamp = Date.now();
  // <========== look for testnet ==================
  // nowTimestamp -= 3600;
  // nowTimestamp += 3600;
  return dateTimestamp > nowTimestamp;
}

/**
 * Returns the current date in ISO format (YYYY-MM-DD).
 *
 * @return {string} The current date in ISO format.
 */
export const getDateInISOFormat = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // Month is 0-indexed in JavaScript
  const day = now.getDate();
  const isoDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  return isoDate;
}

// just option for select
export const options = [
  {
      category: 'Travaux',
      items: ['Fouilles', 'GrosOeuvre', 'Couverture', 'Zinguerie', 'Démolition', 'Désamiantage', 'Eclairage', 'Isolation', 'Terrassement']
  },
  {
      category: 'Etudes',
      items: ['Analyse', 'Essai', 'Ordonnancement', 'Pilote', 'Coordination']
  },
  {
      category: 'Nettoyage',
      items: ['Ramonage', 'Désinfection', 'Dératisation', 'Désinsectisation']
  },
  {
      category: 'Combustibles',
      items: ['Fioul', 'CPU', 'Charbon', 'Bois', 'Gaz']
  },
  {
      category: 'Communication',
      items: ['Photographie', 'Graphisme', 'Logos', 'Affiches', 'Brochures', 'Reliures', 'Flyers', 'Salon', 'Meetup']
  },
  {
  category: 'Maintenance',
      items: ['Eclairage', 'Outillage', 'Horloge', 'Chaufferie', 'Ascenseurs', 'Toiture', 'Voirie', 'Sanitaires']
  }
];