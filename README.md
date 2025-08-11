# ♟️ Chess Game - DSA and AI Showcase

A real-time, multi-player chess game built with **Node.js**, **Express**, **Socket.io**, and **Chess.js**.  
This project demonstrates foundational **Data Structures and Algorithms (DSA)** and **Artificial Intelligence (AI)** concepts through move evaluation, game tree search, and state management.  

It features drag-and-drop gameplay, role assignment (White, Black, or Spectator), and a basic AI-driven win percentage calculator.  
Designed as a portfolio piece to highlight **DSA and AI** skills.

---

## 🚀 Features

- **Real-time multiplayer** via WebSockets for synchronized moves across players.  
- **Intuitive drag-and-drop interface** with legal move highlighting.  
- **Automatic role assignment** for White, Black, or Spectator.  
- **Capture point tracking** and game status updates (check, checkmate, stalemate).  
- **Flipped board view** for the Black player.  
- **Basic AI evaluation** to display win percentage based on board position.  

---

## 🧠Algorithm Details


### 🧠 Minimax Algorithm — How It Works:
- For each move, it temporarily applies the move (`chess.move()`), recursively evaluates the next position, and undoes the move (`chess.undo()`).
- A **MinHeap** is used to store and prioritize moves based on their evaluation scores.
- The final evaluation (`eval`) is the maximum or minimum score, depending on whether the player is maximizing or minimizing.

This allows the game to predict the win percentage (`calculateWinPercentage`) by simulating future board states, giving an indication of which side has the advantage.

---

### 📊 Evaluation Function
**Implementation:**  
The `evaluateBoard` function assigns scores based on **piece values** (`PIECE_VALUES`) and **positional bonuses** (`POSITIONAL_BONUSES`).

**How It Works:**  
- Iterates over the 8x8 board, calculating a score that reflects the **material advantage** (e.g., a queen is worth 9 points) and **positional strength** (e.g., pawns are valued higher in the center).  
- A small penalty is added if the current player is in check.

---

## 📚 Data Structures Used

### 1. MinHeap (Priority Queue)
- **Methods:** `push`, `pop`, `bubbleUp`, `bubbleDown`  
- **Usage:** In `buildMoveTree` to store and sort move-evaluation pairs.  
- **Complexity:**  
  - Push / Pop → **O(log n)**  
  - `isEmpty` → **O(1)**  

---

### 2. Minimax Algorithm
- Recursive game tree traversal alternating between maximizing and minimizing scores.
- Integrated with **MinHeap** for optimal move ordering.
- **Complexity:** O(b^d) where:
  - **b** ≈ branching factor (~35 moves)
  - **d** = depth (2 or 3)

---

### 3. Map (Hash Table)
- **Implementation:** Stores move evaluations using FEN strings as keys.
- **Purpose:** Caches evaluations for board states.
- **Complexity:** O(1) average for set/get operations.

---

### 4. Array (Stack)
- **Implementation:** `moveStack` stores FEN strings after each move.
- **Purpose:** Tracks game history.
- **Complexity:** O(1) for push.

---

## 🛠 Tech Stack

**Frontend:** HTML, Tailwind CSS, JavaScript  
**Backend:** Node.js, Express  
**Real-time:** Socket.IO  
**Chess Logic:** Chess.js  
**Deployment:** Vercel (frontend), Render / Heroku (backend)

---

## ⚙️ Installation

```bash
# Clone repo
git clone https://github.com/your-username/chess-game.git
cd chess-game

# Install dependencies
npm install

# Run server
node app.js
