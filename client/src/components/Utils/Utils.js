import { useState, useEffect } from "react";

export const disable = (workflow, currentWorkflow) => {
    if(workflow === currentWorkflow)
        return false;
    else
        return true;
};

const getStorageValue =(key, defaultValue) => {
    const saved = localStorage.getItem(key);
    const initial = saved !== undefined  ? JSON.parse(saved) : defaultValue;
    return initial || defaultValue;
};
  
export const useLocalStorage = (key, defaultValue) => {
    const [value, setValue] = useState(() => {
      return getStorageValue(key, defaultValue);
    });
  
    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);
  
    return [value, setValue];
};
