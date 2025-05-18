import { useEffect, useState } from "react";
import "@lottiefiles/lottie-player";
import React from "react";

export default function App() {
  const [mealInfo, setMealInfo] = useState(null);
  const [infoLoading, setInfoLoading] = useState(false);
  const [infoError, setInfoError] = useState(null);
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const [nameInput, setNameInput] = useState("");
  const [meals, setMeals] = useState(() => {
    const stored = localStorage.getItem("meals");
    return stored ? JSON.parse(stored) : [];
  });
  const [newMeal, setNewMeal] = useState("");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    localStorage.setItem("meals", JSON.stringify(meals));
  }, [meals]);

  const rollDice = async () => {
  if (meals.length === 0) return;

  setRolling(true);
  setInfoError(null);
  setMealInfo(null);
  const meal = meals[Math.floor(Math.random() * meals.length)];
  setSelectedMeal(meal);

  try {
    setInfoLoading(true);
    const res = await fetch(`https://meal-dice-app.onrender.com/fetch-info?meal=${meal}`);
    if (!res.ok) throw new Error("Fetch failed");
    const data = await res.json();
    setMealInfo(data);
  } catch (err) {
    setInfoError("❌ Could not load meal info.");
  } finally {
    setInfoLoading(false);
    setRolling(false);
  }
  };



  const addMeal = () => {
    if (!newMeal.trim()) return;
    setMeals([...meals, newMeal.trim()]);
    setNewMeal("");
    setShowAdd(false);
  };

  const deleteMeal = (index) => {
    setMeals(meals.filter((_, i) => i !== index));
  };

  const handleLogin = () => {
    if (!nameInput.trim()) return;
    localStorage.setItem("username", nameInput.trim());
    setUsername(nameInput.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("meals");
    setUsername("");
    setMeals([]);
    setSelectedMeal(null);
  };

  if (!username) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-6 space-y-6 text-center">
          <h1 className="text-3xl font-bold text-green-800">👋 Welcome</h1>
          <p className="text-gray-500">Enter your name to start rolling meals!</p>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-300"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl"
          >
            Start
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-4 py-10">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center space-y-6 relative">
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="absolute top-5 right-5 text-2xl font-bold text-green-600 hover:text-green-800"
        >
          {showAdd ? "×" : "+"}
        </button>

        <h1 className="text-3xl font-bold text-emerald-800">🎲 Meal Dice</h1>
        <p className="text-gray-500 text-sm leading-tight">
          Feeling hungry but can’t decide?<br />Let the dice choose for you.
        </p>

        {rolling ? (
          <lottie-player
            autoplay
            loop
            mode="normal"
            src="https://lottie.host/b41094a2-b1f0-4923-a4ec-b4742ecaad05/OXxq9pKd7U.lottie"
            style={{ width: "150px", height: "150px", margin: "0 auto" }}
          ></lottie-player>
        ) : (
          <button
              onClick={rollDice}
              disabled={meals.length === 0}
              className={`w-full py-3 text-white font-bold text-lg rounded-full transition ${
                meals.length === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {rolling ? "Rolling..." : "Roll the Dice"}
            </button>
        )}

        {selectedMeal && (
          <div className="bg-emerald-50 p-4 rounded-xl space-y-1 text-left">
            <p className="text-md font-semibold text-emerald-700">🥗 Your Meal:</p>
            <h3 className="text-lg font-bold">{selectedMeal}</h3>
            <p className="text-sm italic text-gray-600">🍓"{quote}"</p>
          </div>
        )}

        {/* 📦 NEW INFO UI BLOCK — PASTE BELOW */}
        {infoLoading && (
          <div className="text-sm text-gray-500 animate-pulse">Loading meal info...</div>
        )}

        {infoError && (
          <div className="text-red-500 text-sm font-medium">{infoError}</div>
        )}


        {mealInfo && !infoLoading && !infoError && (
          <div className="bg-lime-50 mt-4 text-left p-5 rounded-2xl shadow space-y-3">
            <h3 className="text-lg font-bold text-green-700">🍽 {mealInfo.title}</h3>

            {mealInfo.ingredients?.length > 0 && (
              <details className="text-sm">
                <summary className="cursor-pointer text-green-600 font-medium mb-1">🧂 Ingredients</summary>
                <ul className="list-disc list-inside ml-4">
                  {mealInfo.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                </ul>
              </details>
            )}

            <details className="text-sm">
              <summary className="cursor-pointer text-green-600 font-medium mb-1">📖 Wikipedia Summary</summary>
              <p className="mt-1 text-gray-600 italic">{mealInfo.wikipedia_summary}</p>
            </details>

            <details className="text-sm">
              <summary className="cursor-pointer text-green-600 font-medium mb-1">🧵 Reddit Health Threads</summary>
              <div className="mt-1 space-y-1">
                {mealInfo.reddit_results?.map((r, i) => (
                  <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                    🔗 {r.title}
                  </a>
                ))}
              </div>
            </details>

            <a
              href={mealInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-green-700 hover:underline text-sm font-medium"
            >
              📜 View full recipe on Akis →
            </a>
          </div>
        )}


        {showAdd && (
          <div className="mt-6 space-y-3 text-left">
            <input
              type="text"
              value={newMeal}
              onChange={(e) => setNewMeal(e.target.value)}
              placeholder="Add a new meal..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-300"
            />
            <button
              onClick={addMeal}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
            >
              Save Meal
            </button>

            <ul className="mt-4 max-h-40 overflow-y-auto space-y-2">
              {meals.map((meal, i) => (
                <li key={i} className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-xl">
                  <span>{meal}</span>
                  <button
                    onClick={() => deleteMeal(i)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-red-500 mt-6"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
