const express = require('express')
const Database = require('better-sqlite3')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())

// Initialize SQLite database
const db = new Database(path.join(__dirname, 'calories.db'))

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS daily_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    total_calories INTEGER NOT NULL,
    carbs REAL NOT NULL,
    fat REAL NOT NULL,
    protein REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS food_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    log_id INTEGER NOT NULL,
    food_name TEXT NOT NULL,
    carbs REAL NOT NULL,
    fat REAL NOT NULL,
    protein REAL NOT NULL,
    calories INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (log_id) REFERENCES daily_logs(id)
  )
`)

// Get today's log
app.get('/api/today', (req, res) => {
  const today = new Date().toISOString().split('T')[0]

  const log = db.prepare(`
    SELECT * FROM daily_logs WHERE date = ?
  `).get(today)

  const entries = log ? db.prepare(`
    SELECT * FROM food_entries WHERE log_id = ? ORDER BY timestamp DESC
  `).all(log.id) : []

  res.json({
    log: log || null,
    entries: entries || []
  })
})

// Get logs by date range
app.get('/api/logs', (req, res) => {
  const { startDate, endDate } = req.query

  const logs = db.prepare(`
    SELECT * FROM daily_logs
    WHERE date BETWEEN ? AND ?
    ORDER BY date DESC
  `).all(startDate, endDate)

  res.json(logs)
})

// Create or update today's log
app.post('/api/log', (req, res) => {
  const { carbs, fat, protein, totalCalories } = req.body
  const today = new Date().toISOString().split('T')[0]

  const existingLog = db.prepare(`
    SELECT * FROM daily_logs WHERE date = ?
  `).get(today)

  if (existingLog) {
    db.prepare(`
      UPDATE daily_logs
      SET total_calories = ?, carbs = ?, fat = ?, protein = ?
      WHERE id = ?
    `).run(totalCalories, carbs, fat, protein, existingLog.id)

    res.json({ id: existingLog.id, message: 'Log updated' })
  } else {
    const result = db.prepare(`
      INSERT INTO daily_logs (date, total_calories, carbs, fat, protein)
      VALUES (?, ?, ?, ?, ?)
    `).run(today, totalCalories, carbs, fat, protein)

    res.json({ id: result.lastInsertRowid, message: 'Log created' })
  }
})

// Add food entry
app.post('/api/food', (req, res) => {
  const { logId, foodName, carbs, fat, protein, calories } = req.body

  const log = db.prepare('SELECT * FROM daily_logs WHERE id = ?').get(logId)

  if (!log) {
    return res.status(404).json({ error: 'Daily log not found' })
  }

  const result = db.prepare(`
    INSERT INTO food_entries (log_id, food_name, carbs, fat, protein, calories)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(logId, foodName, carbs, fat, protein, calories)

  // Update daily log totals
  const entries = db.prepare('SELECT * FROM food_entries WHERE log_id = ?').all(logId)
  const totalCarbs = entries.reduce((sum, e) => sum + e.carbs, 0)
  const totalFat = entries.reduce((sum, e) => sum + e.fat, 0)
  const totalProtein = entries.reduce((sum, e) => sum + e.protein, 0)
  const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0)

  db.prepare(`
    UPDATE daily_logs
    SET total_calories = ?, carbs = ?, fat = ?, protein = ?
    WHERE id = ?
  `).run(totalCalories, totalCarbs, totalFat, totalProtein, logId)

  res.json({ id: result.lastInsertRowid, message: 'Food entry added' })
})

// Delete food entry
app.delete('/api/food/:id', (req, res) => {
  const { id } = req.params

  const entry = db.prepare('SELECT * FROM food_entries WHERE id = ?').get(id)
  if (!entry) {
    return res.status(404).json({ error: 'Entry not found' })
  }

  db.prepare('DELETE FROM food_entries WHERE id = ?').run(id)

  // Recalculate daily totals
  const entries = db.prepare('SELECT * FROM food_entries WHERE log_id = ?').all(entry.log_id)
  const totalCarbs = entries.reduce((sum, e) => sum + e.carbs, 0)
  const totalFat = entries.reduce((sum, e) => sum + e.fat, 0)
  const totalProtein = entries.reduce((sum, e) => sum + e.protein, 0)
  const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0)

  db.prepare(`
    UPDATE daily_logs
    SET total_calories = ?, carbs = ?, fat = ?, protein = ?
    WHERE id = ?
  `).run(totalCalories, totalCarbs, totalFat, totalProtein, entry.log_id)

  res.json({ message: 'Entry deleted' })
})

// Get all food entries for today with timestamps
app.get('/api/entries/today', (req, res) => {
  const today = new Date().toISOString().split('T')[0]

  const log = db.prepare('SELECT * FROM daily_logs WHERE date = ?').get(today)
  if (!log) {
    return res.json([])
  }

  const entries = db.prepare(`
    SELECT * FROM food_entries WHERE log_id = ? ORDER BY timestamp DESC
  `).all(log.id)

  res.json(entries)
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
