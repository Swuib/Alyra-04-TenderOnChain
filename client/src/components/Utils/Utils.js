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

/**
 * Converts a Unix timestamp to a local date and time
 * @param {number} value - The Unix timestamp to convert
 * @return {string} The local date and time in the format "YY-MM-DD HH:MM"
 */
export const ConvertEpochToLocalDate = value => {
  // Create a new Date object from the input timestamp
  let myDate = new Date(value * 1000);

  // Define the format for the converted date and time string
  // const options = {year:'2-digit', month:'2-digit', day:'2-digit'};

  // // Convert the date to a string in the specified format
  // myDate = myDate.toLocaleString(undefined, options);
  myDate = myDate.toISOString().substr(0, 10);

  // Return the converted date and time string
  return myDate;
};

/**
 * Converts a date string to a Unix timestamp in UTC.
 * @param {string} date - The date to convert, in the format "YYYY-MM-DD".
 * @return {uint} The Unix timestamp for the given date in UTC.
 */
export const convertDateToUnixTimestamp = date => {
  // Convert the date string to a JavaScript Date object
  const dateObject = new Date(date);

  // Return the Unix timestamp for the date in UTC
  return dateObject.getTime() / 1000;
};

/**
 * Converts a date in string format to a more readable format
 * @param {string} dateString - The date to convert, in string format
 * @return {string} The converted date in the format "YY-MM-DD"
 */
export const convertDate = dateString => {
  // Create a new Date object from the input date string
  let date = new Date(dateString);

  // // Define the format for the converted date string
  // const options = { year:'2-digit', month:'2-digit', day:'numeric'};

  // // Convert the date to a string in the specified format
  // date = date.toLocaleString(undefined, options);
  date = date.toISOString().substr(0, 10);

  // Return the converted date string
  return date;
};

/**
*This function converts a date string in the format "YYYY-MM-DD" to a local date.
*
*@param {string} dateString - The date to convert, in the format "YYYY-MM-DD"
*@return {string} - The converted date, in the format "DD/MM/YY"
*/
export const convertDateToLocal = (dateString) => {
  // Create a new Date object from the input date string
  const date = new Date(dateString);
  
  // Define the format for the converted date string
  const options = {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit'
  };
  
  // Convert the date to a string in the specified format
  const localDate = date.toLocaleString(undefined, options);
  
  // Return the converted date string
  return localDate;
}

/**
 * Retrieves the current Unix timestamp
 * @return {number} The Unix timestamp in seconds
 */
export const getCurrentTimestamp = () => {
  // Retrieve the current date
  const currentDate = new Date();

  // Transform the date into a Unix timestamp
  const timestamp = Math.round(currentDate.getTime() / 1000);

  // Return the timestamp
  return timestamp;
}

/**
* This function compares a given date to the current date and returns a boolean value indicating whether
* the given date is in the future or not.
*
*@param {string} dateString - The date to compare, in the format "8/12/22"
*@return {boolean} - True if the given date is in the future, false otherwise.
*/
export const compareDate = (dateString) => {
  // Parse the date using the options "year: 'numeric', month: '2-digit', day: '2-digit'"
  const date = Date.parse(dateString, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  // If the date could not be parsed correctly, return false
  if (isNaN(date)) {
    return false;
  }

  // Get the number of milliseconds since January 1, 1970 for the current date
  const nowTimestamp = Date.now();

  // If the given date is strictly greater than the current date, return true, otherwise return false
  return date > nowTimestamp;
}

/**
 * Returns the current date in ISO format (YYYY-MM-DD).
 *
 * @return {string} The current date in ISO format.
 */
export const getDateInISOFormat = () => {
  // Get the current date
  const now = new Date();

  // Get the year, month and day of the current date
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // Month is 0-indexed in JavaScript
  const day = now.getDate();

  // Generate the ISO-formatted date string
  const isoDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

  // Return the ISO-formatted date string
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