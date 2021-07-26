import {useState} from 'react';

export const useLocalStorageMap = (name, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const mapJSON = window.localStorage.getItem(name);
      return mapJSON ? new Map(JSON.parse(mapJSON)) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const addMapKey = (key, value) => {
    try {
      const newStoredValue = storedValue;
      newStoredValue.set(key, value);
      setStoredValue(newStoredValue);
      window.localStorage.setItem(name, JSON.stringify(Array.from(newStoredValue.entries())));
    } catch (error) {
      console.log(error);
    }
  }

  const deleteMapKey = (key) => {
    try {
      const newStoredValue = storedValue;
      newStoredValue.delete(key);
      setStoredValue(newStoredValue);
      window.localStorage.setItem(name, JSON.stringify(Array.from(newStoredValue.entries())));
    } catch (error) {
      console.log(error);
    }
  }

  return [storedValue, addMapKey, deleteMapKey];
}