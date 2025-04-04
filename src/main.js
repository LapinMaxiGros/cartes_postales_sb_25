/**
 * Point d'entrée principal de l'application.
 * Ce fichier initialise tous les composants et démarre l'application.
 */
import "./styles/style.css";
import "./styles/dragDrop.css";
import "./styles/mediaInput.css";
import "./minify/minify.css";
import "./styles/flipCard.css";
import { ChatInterface } from "./ui/ChatInterface.js";
import { FunctionCallHandler } from "./functions/FunctionCallHandler.js";
import { FunctionRegistry } from "./functions/FunctionRegistry.js";
import { JsonDictionaryManager } from "./dictionary/JsonDictionaryManager.js";
import { DictionaryManager } from "./dictionary/DictionaryManager.js";
import { LMStudioClient } from "./api/LMStudioClient.js";
import { MinifyManager } from "./minify/MinifyManager.js";
import { TerminalInterface } from "./ui/TerminalInterface.js";
import { ThemeSelector } from "./ui/ThemeSelector.js";
import { ModeSelector } from "./ui/ModeSelector.js";
import { DragAndDropManager } from "./ui/DragAndDropManager.js";

// Attendre que le DOM soit complètement chargé avant d'initialiser l'application
// document.addEventListener("DOMContentLoaded", () => {
function start() {
  // ===== CONFIGURATION DE BASE =====

  // Vérifier si le mode JSON est activé (sauvegardé dans le stockage local)
  const savedMode = localStorage.getItem("useJsonMode");
  const useJsonMode = savedMode !== null ? savedMode === "true" : false;

  // Liste des mots autorisés pour le dictionnaire
  const dictionary = [
    "bikini",
    "towel",
    "umbrella",
    "float",
    "mat",
    "palmtrees",
    "kayak",
    "hatsunglasses",
    "cap",
    "cooler",
    "sunhat",
    "flipflops",
    "snorkel",
    "goggles",
    "shorts",
    "sweatshirt",
    "tanktop",
    "shoes",
    "tshirt",
    "sneakers",
    "glasses",
    "backpack",
    "slippers",
    "jacket",
    "wipes",
    "toiletries",
    "socks",
    "runningshoes",
    "bottle",
    "charger",
    "snake",
    "crocodile",
    "frog",
    "lizard",
    "chameleon",
    "toad",
    "books",
    "steak",
    "guitar",
    "laptop",
    "earbuds",
    "paddleball",
    "camcorder",
    "binoculars",
    "speaker",
    "camera",
    "money",
    "cards",
    "ball",
    "scallop",
    "crab",
    "fish",
    "shrimp",
    "shark",
    "salmon",
    "octopus",
    "boots",
    "stove",
    "tent",
    "map",
    "pot",
    "poles",
    "sleepingbag",
    "gps",
    "thermos",
    "clock",
    "vanity",
    "bed",
    "desk",
    "mirror",
    "pillow",
    "nightstand",
    "bookshelf",
    "blanket",
    "wardrobe",
    "shelf",
    "rug",
    "curtains",
    "bedsheet",
    "cleaning",
    "dresser",
    "closet",
    "blinds",
    "broom",
    "firstaid",
    "soapdish",
    "comb",
    "soap",
    "toothbrush",
    "spray",
    "deodorant",
    "lotion",
    "tissues",
    "razor",
    "hairdryer",
    "clippers",
    "perfume",
    "pan",
    "lid",
    "whisk",
    "spatula",
    "colander",
    "butter",
    "cheese grater",
    "jug",
    "kettle",
    "plate",
    "grater",
    "knife",
    "drinks",
    "powerbank",
    "gloves",
    "beanie",
    "deckchair",
    "rubikscube",
    "sunglasses",
    "notebook",
    "book",
    "openbook",
    "jumprope",
    "pizza",
    "burger",
    "kimchi",
    "sandwiches",
    "ramen",
    "pasta",
    "meatbowl",
    "taco",
    "hamburger",
    "sushi",
    "paella",
    "bento",
    "fries",
    "donut",
    "pencil",
    "square",
    "holepuncher",
    "stickers",
    "pencilsharpener",
    "ruler",
    "stapler",
    "pushpins",
    "eraser",
    "highlighter",
    "glue",
    "scissors",
    "sharpener",
    "paperclips",
    "TVremote",
    "remote",
    "printer",
    "vr_headset",
    "usb",
    "hdmi_adapter",
    "monitor",
    "hotplate",
    "external_drive",
    "keyboard",
    "webcam",
    "smartwatch",
    "hammer",
    "drill",
    "pliers",
    "tape",
    "handsaw",
    "level",
    "cutter",
    "wrench",
    "staplegun",
    "cutters",
    "lime",
    "saw",
    "multitool",
    "nutcracker",
    "bicycle",
    "segway",
    "suv",
    "rowboat",
    "scooter",
    "car",
    "van",
    "canoe",
    "skateboard",
    "motorcycle",
    "motorbike",
    "motorboat",
    "raft",
    "flannel",
    "turtleneck",
    "cardigan",
    "coat",
    "coffee",
    "pumpkin",
    "cocoa",
    "trashcan",
    "jar",
    "boot",
    "soup",
    "snowboots",
    "pie",
    "maplesyrup",
    "poutine",
    "fishingrod",
    "cabin",
    "boat",
    "yacht",
    "cruiseship",
    "champagne",
    "beer",
    "Ruins",
    "House",
    "LogCabin",
    "Skyscraper",
    "Igloo",
    "Castle",
    "Hospital",
    "Cabin",
    "Hotel",
    "Cathedral",
    "Tent",
    "Building",
    "Temple",
    "Rotunda",
    "Mountain",
    "GreekTemple",
    "Towers",
    "River",
    "Pagoda",
    "Stadium",
    "Arena",
    "Church",
    "Fountain",
    "Warehouse",
    "Trees",
    "Village",
    "Forest",
    "Mosque",
    "Dome",
    "Greenhouse",
    "GreenHouse",
    "Cave",
    "Crater",
    "Lighthouse",
    "Island",
    "Tower",
    "Bridge",
    "Volcano",
    "Colosseum",
    "Rocks",
    "Pyramid",
    "Complex",
    "City",
    "Desert",
    "Telescope",
    "Ferriswheel",
    "Observatory",
  ];

  // Configuration de l'API LMStudio
  const lmUrl = "http://localhost:1234/v1/chat/completions";
  const modelName = "gemma-3-12b-it";

  // ===== INITIALISATION DES COMPOSANTS =====

  // 1. Créer le client pour communiquer avec l'API LMStudio
  const lmClient = new LMStudioClient(lmUrl, modelName);

  // 2. Créer le gestionnaire de dictionnaire selon le mode choisi
  const dictManager = useJsonMode
    ? new JsonDictionaryManager(dictionary) // Mode JSON
    : new DictionaryManager(dictionary); // Mode standard

  // 3. Créer le gestionnaire d'appels de fonctions
  // En mode JSON, on lui passe le dictionnaire JSON pour qu'il puisse enregistrer les fonctions
  const functionHandler = new FunctionCallHandler(
    useJsonMode ? dictManager : null
  );

  // ===== INTERFACE UTILISATEUR =====

  // 1. Initialiser l'interface de chat
  const chatInterface = new ChatInterface(
    lmClient,
    dictManager,
    functionHandler
  );
  chatInterface.initialize();

  // 2. Initialiser le sélecteur de mode (JSON vs Standard)
  const modeSelector = new ModeSelector(
    useJsonMode,
    dictManager,
    functionHandler
  );

  // 3. Initialiser le sélecteur de thème
  const themeSelector = new ThemeSelector();

  // 4. Initialiser le terminal
  const terminalElement = document.getElementById("terminal-content");
  const terminal = new TerminalInterface(terminalElement);
  terminal.initialize();

  // 6. Initialiser le gestionnaire de minimisation
  const minifyManager = new MinifyManager(chatInterface);
  minifyManager.initialize();

  // Forcer le mode minifié au chargement
  minifyManager.minimize();

  // // Empêcher l'expansion du chat
  // const expandButton = document.querySelector(".expand-button");
  // if (expandButton) {
  //   expandButton.style.display = "none";
  // }

  // 4. Créer le registre de fonctions qui définit toutes les fonctions disponibles
  const functionRegistry = new FunctionRegistry(functionHandler, minifyManager);

  // 5. Enregistrer toutes les fonctions définies dans le registre
  functionRegistry.registerAllFunctions();

  // 6. Configurer le terminal dans le registre de fonctions
  functionRegistry.initializeTerminal(terminal);

  // Initialize drag and drop for dictionary display
  const dictionaryDisplay = document.getElementById("dictionary-display");
  new DragAndDropManager(dictionaryDisplay, dictManager);
}

window.addEventListener("DOMContentLoaded", () => {
  start();
});
