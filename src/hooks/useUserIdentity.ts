import { useEffect, useState } from "react";

const USER_NAME_KEY = "gallery-user-name";
const USER_UPDATED_EVENT = "gallery-user-updated";

export const useUserIdentity = () => {
  const [userName, setUserName] = useState<string | null>(() =>
    localStorage.getItem(USER_NAME_KEY),
  );

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
    saveUserName,
  };
};