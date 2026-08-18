import { useState } from "react";
import { useUserIdentity } from "../../hooks/useUserIdentity";
import { userNameSchema } from "../../validation/userSchema";

const UserSetup = () => {
  const { saveUserName } = useUserIdentity();

  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const result = userNameSchema.safeParse(name);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError("");
    saveUserName(result.data);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setName(event.target.value);

    if (error) {
      setError("");
    }
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
          onChange={handleChange}
          placeholder="Enter your first name"
          maxLength={30}
          autoFocus
          className={`w-full rounded-lg border px-4 py-3 outline-none transition focus:ring-2 ${
            error
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:ring-gray-200"
          }`}
        />

        {error && (
          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!name.trim()}
          className="mt-4 w-full cursor-pointer rounded-lg bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
      </form>
    </main>
  );
};

export default UserSetup;