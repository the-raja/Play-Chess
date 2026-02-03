# Real-Time Chess Game

A web-based, real-time multiplayer chess game built with Node.js, Express, and Socket.io. This project features a client-side AI that calculates win probability based on a sophisticated heuristic evaluation function.

[Link to Live Demo]() <!-- Add your Vercel deployment link here -->

## Features

-   **Real-Time Multiplayer:** Play chess with another person in real-time.
-   **Spectator Mode:** Users can join and watch ongoing games.
-   **AI Win Percentage:** A client-side "AI" provides a real-time estimation of the win percentage based on the current board state.
-   **Move Highlighting:** Shows legal moves when a piece is selected.
-   **Piece Drag and Drop:** An intuitive interface for moving pieces.
-   **Flippable Board:** The board automatically flips for the player with the black pieces.

## Technologies Used

-   **Backend:** Node.js, Express.js
-   **Frontend:** HTML, CSS, Vanilla JavaScript
-   **Real-Time Communication:** Socket.io
-   **Chess Logic:** chess.js
-   **Deployment:** Vercel

## How to Run Locally

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd chess-project
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Start the server:**
    ```bash
    npm start
    ```

5.  Open your browser and go to `http://localhost:3000`. Open a second browser tab or window to the same address to play against yourself.

## Showcasing DSA and AI Skills

This project serves as a practical demonstration of fundamental Data Structures & Algorithms (DSA) and classical Artificial Intelligence principles.

### Data Structures & Algorithms (DSA)

-   **MinHeap:** A custom `MinHeap` data structure is implemented from scratch to efficiently manage and prioritize potential moves within the AI's search algorithm. This showcases a core understanding of heap properties and operations (`push`, `pop`, `bubbleUp`, `bubbleDown`).
-   **Game Tree Search:** The project uses a recursive, tree-based algorithm (`buildMoveTree`) to explore possible future moves, demonstrating an understanding of tree traversal and search algorithms.

### Artificial Intelligence (AI)

This project implements a **classical, heuristic-based AI**, which is a cornerstone of game AI development.

-   **Heuristic Evaluation Function:** The AI's intelligence is centered around a sophisticated `evaluateBoard` function. This function goes beyond simple piece counting and analyzes the board based on several key chess principles:
    -   **Material Advantage:** The relative value of pieces on the board.
    -   **Positional Advantage:** Bonuses for pieces placed in strategically valuable locations.
    -   **Pawn Structure:** Penalties for weaknesses like doubled pawns.
    -   **King Safety:** Penalties for an exposed king.
    -   **Rook Positioning:** Bonuses for rooks on powerful open or semi-open files.
    -   **Bishop Pair:** A bonus for possessing both bishops, which is a key long-term strategic advantage.

-   **Heuristic Search:** The AI uses its evaluation function to guide a search for the best possible move, showcasing an ability to model intelligent decision-making in a complex, turn-based environment.
