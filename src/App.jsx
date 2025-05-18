import { useEffect, useState } from "react";
import "@lottiefiles/lottie-player";

export default function App() {
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

  const rollDice = () => {
    if (meals.length === 0) return;
    setRolling(true);
    setTimeout(() => {
      const meal = meals[Math.floor(Math.random() * meals.length)];
      setSelectedMeal(meal);
      setRolling(false);
    }, 1500);
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8 text-center space-y-6">
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

        <h1 className="text-2xl text-gray-600">Hi, <span className="font-bold text-green-800">{username}</span> 👋</h1>

        <h2 className="text-3xl font-extrabold text-gray-800">🎲 Meal Dice</h2>
        <p className="text-gray-500">Add meals you love, then let the dice choose</p>

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
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl"
          >
            Roll the Dice
          </button>
        )}

        {selectedMeal && (
          <div className="bg-green-50 text-left p-5 rounded-2xl text-gray-800 space-y-2">
            <h2 className="font-semibold text-lg">🥗 Your Meal:</h2>
            <p className="text-xl font-bold">{selectedMeal}</p>
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
