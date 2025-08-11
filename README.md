# Chess Game - DSA Showcase

This is a real-time, multi-player chess game built with Node.js, Express, Socket.io, and Chess.js, designed to demonstrate my proficiency in Data Structures and Algorithms (DSA). The project features a drag-and-drop interface, real-time move synchronization, and a basic AI evaluation system using advanced DSA techniques. It serves as a portfolio piece to highlight my skills in algorithm design and optimization.

## Features
- Real-time multiplayer gameplay via WebSockets (Socket.io).
- Drag-and-drop move mechanics with legal move highlighting.
- Role assignment (White, Black, or Spectator) for multiple players.
- AI-driven win percentage calculation using a custom evaluation function.
- Move history tracking and capture point system.
- DSA-focused implementation for move evaluation and state management.

## Technologies Used
- **Frontend**: HTML, CSS (with Tailwind CSS), JavaScript
- **Backend**: Node.js, Express
- **Real-time Communication**: Socket.io
- **Chess Logic**: Chess.js
- **Deployment**: Vercel (frontend), Heroku/Render (backend)

## DSA Highlights
This project showcases several DSA concepts, implemented to optimize chess move evaluation and game state management:

1. **MinHeap (Priority Queue)**:
   - **Implementation**: A custom `MinHeap` class with `push`, `pop`, `bubbleUp`, and `bubbleDown` methods.
   - **Usage**: Used in the `buildMoveTree` function to prioritize moves based on their evaluation scores during the Minimax algorithm.
   - **Complexity**: O(log n) for `push` and `pop` operations, ensuring efficient move selection.
   - **Purpose**: Enables the AI to quickly identify the best or worst move for the maximizing/minimizing player.

2. **Minimax Algorithm**:
   - **Implementation**: Recursively implemented in `buildMoveTree` to evaluate all possible moves up to a depth of 2 or 3.
   - **Usage**: Simulates game outcomes by alternating between maximizing (White) and minimizing (Black) scores.
   - **Complexity**: O(b^d), where `b` is the branching factor (~35 moves) and `d` is the depth, optimized with shallow depth for performance.
   - **Purpose**: Provides the foundation for the win percentage calculation by predicting future board states.

3. **Map (Hash Table)**:
   - **Implementation**: A `moveTree` `Map` stores FEN strings as keys and inner `Map`s of moves to evaluations as values.
   - **Usage**: Caches move evaluations for each board state to avoid redundant calculations.
   - **Complexity**: O(1) average case for `set` and `get` operations.
   - **Purpose**: Enhances efficiency by reusing prior evaluations, though fully utilized as a transposition table in this implementation.

4. **Array (Stack)**:
   - **Implementation**: A `moveStack` array stores FEN strings after each move.
   - **Usage**: Tracks the game’s move history for potential undo functionality or analysis.
   - **Complexity**: O(1) for push operations.
   - **Purpose**: Provides a foundation for future enhancements like move rollback.

## Prerequisites
- Node.js (v14.x or higher)
- Git
- Vercel CLI (for frontend deployment)
- Heroku CLI or Render account (for backend deployment)

## Installation

### Clone the Repository
```bash
git clone https://github.com/your-username/chess-game.git
cd chess-game
