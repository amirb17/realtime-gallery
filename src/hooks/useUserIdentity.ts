import { useEffect, useState } from "react";

const USER_NAME_KEY = "gallery-user-name";
const USER_COLOR_KEY = "gallery-user-color";
const USER_UPDATED_EVENT = "gallery-user-updated";

const colors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
];

const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

export const useUserIdentity = () => {
  const [userName, setUserName] = useState<string | null>(() =>
    localStorage.getItem(USER_NAME_KEY),
  );

  const [userColor, setUserColor] = useState<string | null>(() =>
    localStorage.getItem(USER_COLOR_KEY),
  );

  useEffect(() => {
    if (!userColor) {
      const color = getRandomColor();

      localStorage.setItem(USER_COLOR_KEY, color);
      setUserColor(color);
    }
  }, [userColor]);

  useEffect(() => {
    const handleUserUpdated = () => {
      setUserName(localStorage.getItem(USER_NAME_KEY));
    };

    window.addEventListener(USER_UPDATED_EVENT, handleUserUpdated);

    return () => {
      window.removeEventListener(USER_UPDATED_EVENT, handleUserUpdated);
    };
  }, []);

  const saveUserName = (name: string) => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    localStorage.setItem(USER_NAME_KEY, trimmedName);
    setUserName(trimmedName);

    window.dispatchEvent(new Event(USER_UPDATED_EVENT));
  };

  return {
    userName,
    userColor,
    saveUserName,
  };
};