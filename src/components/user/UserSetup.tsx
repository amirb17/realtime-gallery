import { useState } from "react";
import { useUserIdentity } from "../../hooks/useUserIdentity";

const UserSetup = () => {
  const { saveUserName } = useUserIdentity();
  const [name, setName] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    saveUserName(trimmedName);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg"
      >
        <h1 className="mb-2 text-3xl font-bold">
          Welcome to Realtime Gallery
        </h1>

        <p className="mb-6 text-gray-600">
          Enter your first name to join the gallery.
        </p>

        <label
          htmlFor="first-name"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          First name
        </label>

        <input
          id="first-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter your first name"
          maxLength={30}
          autoFocus
          className="mb-4 w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
        />

        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"        >
          Continue
        </button>
      </form>
    </main>
  );
};

export default UserSetup;