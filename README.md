# IGNITO

>Ignito is the web portal for the annual techfest. Designed with a sleek, modern aesthetic, this platform serves as the central hub for event registrations, competition details, and participant communications.

##  Features

* **Immersive Boot Sequence:** A thematic terminal-style preloader that engages users upon entry.
* **Dynamic Background System:** A continuous, high-performance background featuring counter-rotating 3D rings and a central animated element utilizing hardware-accelerated CSS.
* **"SmoothCard" Interface:** Custom-built interactive cards featuring a dynamic, mouse-tracking radial spotlight and smooth levitation physics (replacing traditional, jittery 3D tilts).
* **Integrated Authentication Terminal:** A seamless, in-page routing system that transitions the user from the landing page to a secure "System Clearance" Sign-In/Sign-Up terminal.
* **Custom Cursor:** A bespoke, dual-layer custom cursor that interacts with clickable elements.
* **Fully Responsive:** Optimized for all viewports, featuring a sleek bottom navigation dock for mobile users.
* **Animated Micro-interactions:** Includes loading bars, scanlines, and animated targeting brackets on hover states.

##  Tech Stack

This project is built using modern, lightweight frontend technologies:

* **Framework:** [React.js](https://reactjs.org/) 
* **Styling & Animations:** [Tailwind CSS](https://tailwindcss.com/)
* **Icons:** [Lucide React](https://lucide.dev/)

##  Prerequisites

Before you begin, ensure you have the following installed on your local machine:

* [Node.js](https://nodejs.org/en/) (v16.0.0 or higher)
* npm 

##  Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### 1. Clone the repository
```bash
git clone https://github.com/li-yah-h/ignito.git
cd ignito
```
### 2. Install Dependencies
```bash
npm install
npm install lucide-react
```
### 3. Start the Development Server
```bash
npm run dev
# or
npm start
```
##  Project Structure

ignito/
├── src/
│   ├── app.jsx              # The main React file containing all logic, routing, and UI
│   ├── index.css            # Contains Tailwind imports, cursor styles, and glitch animations
│   └── main.jsx             # The React entry point that renders app.jsx into index.html
├── .gitignore               # Ignored files 
├── index.html               # The main HTML file where your app is injected
├── package.json             # Lists your dependencies    
├──package-lock.json         # Exact versions of your installed dependencies
├── README.md                # Project documentation
├── tailwind.config.js       # Configuration for Tailwind CSS 
└── vite.config.js           # Configuration for the build tool