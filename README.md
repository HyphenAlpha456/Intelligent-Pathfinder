# 🚦 Dynamic Pathfinding Visualizer with Real-Time Obstacle Handling

A fully interactive, grid-based simulation tool that visualizes advanced **A\*** pathfinding algorithms with support for **diagonal movement**, **terrain-aware cost mapping**, and **real-time dynamic rerouting** based on user-selected priorities. This intuitive visualizer allows users to simulate intelligent agent behavior in dynamically changing environments.

---

## 🧠 Key Features

- ✅ **Interactive Grid System** with live cell selection
- 🔁 **Real-Time Rerouting** based on environment changes
- 🔄 **Dynamic Priority Switching** between fastest path and cheapest cost
- ⛔ **Live Obstacle Placement/Removal**
- 🧱 **Terrain Cost Mapping** for simulating different surfaces
- 📍 **Start & End Point Customization**
- 🧭 **Enhanced A\*** implementation with 8-directional movement

---

## 🧪 How It Works

Users can interactively build a grid by:

- Setting **start** and **end** points
- Adding or removing **obstacles**
- Assigning **movement costs** to cells
- Choosing whether the agent prioritizes **speed** or **efficiency**
- Watching the agent move in real-time and reroute if obstacles or priorities change

Under the hood, the tool uses an **enhanced A\*** algorithm with diagonal path support and a cost function that dynamically adapts based on the selected priority mode.

---

## 💻 Technologies Used

- **HTML5** – Structure and layout
- **CSS3** – Styling and responsive design
- **JavaScript (Vanilla)** – Grid rendering, algorithm logic, real-time updates
- **Data Structures & Algorithms** – A\*, MinHeap, Grid graph modeling

---

## 📂 Files Used

- `index.html` – Main structure of the app  
- `styles.css` – All visual styling  
- `script.js` – Core algorithm and interaction logic  


---



## 🚀 Practical Use Cases

 This project serves as a **conceptual demonstration** of dynamic pathfinding systems used in real-world applications:

- 🛣️ **Autonomous Vehicle Navigation**  
  Helps self-driving systems adapt routes based on changing road or traffic conditions.

- 🧠 **AI in Game Development**  
  Guides NPCs with realistic pathfinding in evolving game environments.

- 🏥 **Disaster and Emergency Evacuation Planning**  
  Simulates safest or fastest paths out of hazardous zones.

- 🏗️ **Robotics Movement Planning**  
  Enables robots to adapt to dynamic factory or warehouse layouts.

- 📦 **Smart Delivery Routing**  
  Assists in recalculating optimal delivery paths on-the-fly.

- 🎓 **Education and Demonstration**  
  Serves as a live demo for teaching search algorithms and decision-making in AI.

---

## 📌 Getting Started

1. Clone or download the repository  
2. Place all files (`index.html`, `styles.css`, `script.js`, `demo.gif`) in the same folder  
3. Open `index.html` in your browser  
4. Start experimenting with setting start/end points, obstacles, and priorities!

---
