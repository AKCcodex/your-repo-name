import { useState, useEffect } from 'react'
import './App.css'

const defaultFoods = [
  { id: 1, name: 'Oats', carbs: 27, fat: 3, protein: 5, image: '🥣' },
  { id: 2, name: 'Chicken Breast', carbs: 0, fat: 1, protein: 31, image: '🍗' },
  { id: 3, name: 'Rice', carbs: 28, fat: 0, protein: 3, image: '🍚' },
  { id: 4, name: 'Egg', carbs: 1, fat: 5, protein: 6, image: '🥚' },
  { id: 5, name: 'Banana', carbs: 23, fat: 0, protein: 1, image: '🍌' },
  { id: 6, name: 'Milk', carbs: 12, fat: 5, protein: 8, image: '🥛' },
  { id: 7, name: 'Bread', carbs: 13, fat: 1, protein: 4, image: '🍞' },
  { id: 8, name: 'Almonds', carbs: 6, fat: 14, protein: 6, image: '🥜' },
]

function App() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [intake, setIntake] = useState({ carbs: 0, fat: 0, protein: 0 })
  const [foodInput, setFoodInput] = useState({ name: '', carbs: '', fat: '', protein: '' })
  const [quickFoods, setQuickFoods] = useState(defaultFoods)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newFood, setNewFood] = useState({ name: '', carbs: '', fat: '', protein: '', image: '🍽️' })

  const maintenanceCalories = 1800
  const currentCalories = (intake.carbs * 4) + (intake.fat * 9) + (intake.protein * 4)
  const progressPercent = Math.min((currentCalories / maintenanceCalories) * 100, 100)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const addFood = (e) => {
    e.preventDefault()
    if (!foodInput.name || !foodInput.carbs || !foodInput.fat || !foodInput.protein) return

    setIntake(prev => ({
      carbs: prev.carbs + parseFloat(foodInput.carbs),
      fat: prev.fat + parseFloat(foodInput.fat),
      protein: prev.protein + parseFloat(foodInput.protein)
    }))
    setFoodInput({ name: '', carbs: '', fat: '', protein: '' })
  }

  const addQuickFood = (food) => {
    setIntake(prev => ({
      carbs: prev.carbs + food.carbs,
      fat: prev.fat + food.fat,
      protein: prev.protein + food.protein
    }))
  }

  const saveNewFood = (e) => {
    e.preventDefault()
    if (!newFood.name || !newFood.carbs || !newFood.fat || !newFood.protein) return

    const foodItem = {
      id: Date.now(),
      name: newFood.name,
      carbs: parseFloat(newFood.carbs),
      fat: parseFloat(newFood.fat),
      protein: parseFloat(newFood.protein),
      image: newFood.image || '🍽️'
    }

    setQuickFoods(prev => [...prev, foodItem])
    setNewFood({ name: '', carbs: '', fat: '', protein: '', image: '🍽️' })
    setShowAddModal(false)
  }

  const resetDaily = () => {
    setIntake({ carbs: 0, fat: 0, protein: 0 })
  }

  return (
    <div className="app">
      <header className="header">
        <div className="datetime">
          {currentTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        <div className="time">
          {currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </div>
      </header>

      <section className="calorie-meter">
        <div className="meter-header">
          <h2>Daily Calorie Intake</h2>
          <span className="calorie-count">{Math.round(currentCalories)} / {maintenanceCalories} kcal</span>
        </div>
        <div className="meter-container">
          <div
            className="meter-fill"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="meter-labels">
          <span>0</span>
          <span>{maintenanceCalories / 2}</span>
          <span>{maintenanceCalories}</span>
        </div>
      </section>

      <section className="macros-section">
        <h2>Macronutrient Breakdown</h2>
        <div className="macros-grid">
          <div className="macro-card carbs">
            <div className="macro-icon">🍞</div>
            <div className="macro-value">{intake.carbs.toFixed(0)}g</div>
            <div className="macro-label">Carbs</div>
            <div className="macro-calories">({(intake.carbs * 4).toFixed(0)} kcal)</div>
          </div>
          <div className="macro-card fat">
            <div className="macro-icon">🥑</div>
            <div className="macro-value">{intake.fat.toFixed(0)}g</div>
            <div className="macro-label">Fat</div>
            <div className="macro-calories">({(intake.fat * 9).toFixed(0)} kcal)</div>
          </div>
          <div className="macro-card protein">
            <div className="macro-icon">🍗</div>
            <div className="macro-value">{intake.protein.toFixed(0)}g</div>
            <div className="macro-label">Protein</div>
            <div className="macro-calories">({(intake.protein * 4).toFixed(0)} kcal)</div>
          </div>
        </div>
        <div className="total-calories">
          <strong>Total: {Math.round(currentCalories)} kcal</strong>
          <span> | Carbs: {Math.round((intake.carbs * 4 / currentCalories) || 0)}% | Fat: {Math.round((intake.fat * 9 / currentCalories) || 0)}% | Protein: {Math.round((intake.protein * 4 / currentCalories) || 0)}%</span>
        </div>
      </section>

      <section className="quick-add-section">
        <div className="section-header">
          <h2>Quick Add</h2>
          <button onClick={() => setShowAddModal(true)} className="add-tile-btn">
            <span>+</span> Add New Food
          </button>
        </div>
        <div className="quick-foods-grid">
          {quickFoods.map(food => (
            <button
              key={food.id}
              onClick={() => addQuickFood(food)}
              className="quick-food-tile"
            >
              <div className="food-emoji">{food.image}</div>
              <div className="food-name">{food.name}</div>
              <div className="food-macros">
                <span className="c">{food.carbs}g</span>
                <span className="f">{food.fat}g</span>
                <span className="p">{food.protein}g</span>
              </div>
              <div className="food-calories">{(food.carbs * 4 + food.fat * 9 + food.protein * 4)} kcal</div>
            </button>
          ))}
        </div>
      </section>

      <section className="add-food-section">
        <h2>Add Custom Food</h2>
        <form onSubmit={addFood} className="food-form">
          <input
            type="text"
            placeholder="Food name"
            value={foodInput.name}
            onChange={(e) => setFoodInput(prev => ({ ...prev, name: e.target.value }))}
            className="food-name-input"
          />
          <div className="macros-input">
            <input
              type="number"
              placeholder="Carbs (g)"
              value={foodInput.carbs}
              onChange={(e) => setFoodInput(prev => ({ ...prev, carbs: e.target.value }))}
              min="0"
              step="0.1"
            />
            <input
              type="number"
              placeholder="Fat (g)"
              value={foodInput.fat}
              onChange={(e) => setFoodInput(prev => ({ ...prev, fat: e.target.value }))}
              min="0"
              step="0.1"
            />
            <input
              type="number"
              placeholder="Protein (g)"
              value={foodInput.protein}
              onChange={(e) => setFoodInput(prev => ({ ...prev, protein: e.target.value }))}
              min="0"
              step="0.1"
            />
          </div>
          <button type="submit" className="add-btn">Add Food</button>
        </form>
        <button onClick={resetDaily} className="reset-btn">Reset Daily</button>
      </section>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Quick Food</h2>
            <form onSubmit={saveNewFood} className="modal-form">
              <input
                type="text"
                placeholder="Food name"
                value={newFood.name}
                onChange={(e) => setNewFood(prev => ({ ...prev, name: e.target.value }))}
                className="modal-input"
                required
              />
              <input
                type="text"
                placeholder="Emoji (e.g., 🍕, 🥗, 🍎)"
                value={newFood.image}
                onChange={(e) => setNewFood(prev => ({ ...prev, image: e.target.value }))}
                className="modal-input"
              />
              <div className="macros-input">
                <input
                  type="number"
                  placeholder="Carbs (g)"
                  value={newFood.carbs}
                  onChange={(e) => setNewFood(prev => ({ ...prev, carbs: e.target.value }))}
                  min="0"
                  step="0.1"
                  required
                />
                <input
                  type="number"
                  placeholder="Fat (g)"
                  value={newFood.fat}
                  onChange={(e) => setNewFood(prev => ({ ...prev, fat: e.target.value }))}
                  min="0"
                  step="0.1"
                  required
                />
                <input
                  type="number"
                  placeholder="Protein (g)"
                  value={newFood.protein}
                  onChange={(e) => setNewFood(prev => ({ ...prev, protein: e.target.value }))}
                  min="0"
                  step="0.1"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)} className="cancel-btn">Cancel</button>
                <button type="submit" className="save-btn">Save Food</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
