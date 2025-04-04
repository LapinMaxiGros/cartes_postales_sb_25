import IconManager from "./IconManager";
import PostCardSender from "./PostCardSender.js";

export default class CanvasFunctions {
  constructor(canvas) {
    // Initialisation du canvas et de son contexte
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.canvas.pixelRatio = 2;
    this.ctx.imageSmoothingEnabled = true;
    this.width = canvas.width;
    this.height = canvas.height;

    // Gestionnaire d'icônes pour les cercles
    this.iconManager = new IconManager(this.ctx);
    this.initialiserLesSpreadSheet();

    // État initial de la carte postale
    this.images = [];
    this.isFlipped = false;
    this.isButtonPressed = false;
    this.animationInterval = null;
    this.movingCircles = [];
    this.animationSpeed = 0.1;

    // console.log(this.button);

    // Changer la couleur de fond du body
    this.changeBackgroundColor();

    console.log(
      "CanvasFunctions initialisé avec dimensions:",
      this.width,
      "x",
      this.height
    );

    // this.generatePostcard();

    this.postcardSender = new PostCardSender();
    const mail_button = document.getElementById("mail-button");
    mail_button.addEventListener("click", (e) => {
      // Jouer le son swoosh
      const swooshSound = new Audio("../Sound/swoosh.mp3");
      swooshSound.play();

      const mail_destinataire = document.getElementById("message-text").value;
      const flipCardBack = document.querySelector(".flip-card-back-content");
      const text_message = flipCardBack.textContent;
      this.postcardSender.send(mail_destinataire, text_message, this.canvas);
    });
  }

  // Génère une couleur pastel aléatoire
  generatePastelColor() {
    // Valeurs de base pour les couleurs pastel (entre 180 et 255)
    const r = Math.floor(Math.random() * 75) + 180;
    const g = Math.floor(Math.random() * 75) + 180;
    const b = Math.floor(Math.random() * 75) + 180;

    return `rgb(${r}, ${g}, ${b})`;
  }

  // Change la couleur de fond du body
  changeBackgroundColor() {
    const pastelColor = this.generatePastelColor();
    document.body.style.backgroundColor = pastelColor;
  }

  // Charge les icônes depuis le spreadsheet et les associe aux cercles
  async initialiserLesSpreadSheet() {
    await this.iconManager.loadSpreadsheetIcons();
  }

  // Génère une nouvelle carte postale avec tous ses éléments
  generatePostcard(tableau_mots = []) {
    // Réinitialisation des variables de glisser-déposer
    this.draggedCircle = null;
    this.dragOffset = { x: 0, y: 0 };
    this.circles = [];

    // Configuration des cercles
    this.baseRadius = 55;
    this.hoveredCircle = null;
    this.targetRadius = 55;
    this.currentRadius = 55;

    this.initializeCircles(tableau_mots);
    this.circles.forEach((circle) => {
      this.iconManager.initRandomIcon();
    });
    // this.setupMouseEvents();
    this.draw();

    // Démarrer l'animation de changement de place
    this.startIconAnimation();

    // mettre en place un timer pour flipper la carte postale
    setTimeout(() => {
      this.flipCard();
    }, 3000);

    console.log(this.mail_button);
  }

  // Flip la carte postale
  flipCard() {
    const flipCard = document.querySelector(".flip-card");
    flipCard.classList.add("fakehover");

    // mettre en place un timer pour flipper la carte postale
    setTimeout(() => {
      this.flipBack();
    }, 3000);
  }

  // Flip la carte postale vers l'arrière
  flipBack() {
    const flipCard = document.querySelector(".flip-card");
    flipCard.classList.remove("fakehover");
  }

  // Crée une grille hexagonale de cercles avec des positions aléatoires
  initializeCircles(tableau_mots) {
    const baseSpacing = 60;
    const hexSize = this.baseRadius * 2;

    // Calcul du nombre de cercles nécessaires pour remplir la toile
    const gridCols =
      Math.ceil((this.width - baseSpacing * 2) / (hexSize * 1.5)) + 1;
    const gridRows =
      Math.ceil((this.height - baseSpacing * 2) / (hexSize * 0.866)) + 1;

    this.circles = [];

    //vérifier le tableau de mots
    const new_tableau_mots = [];
    tableau_mots.forEach((mot) => {
      if (this.iconManager.icons.hasOwnProperty(mot.toLowerCase())) {
        new_tableau_mots.push(mot);
      }
    });
    console.log(new_tableau_mots);

    // Création de la grille hexagonale
    for (let row = 0; row < gridRows; row++) {
      const offsetX = row % 2 === 0 ? 0 : hexSize; // Décalage alterné pour créer l'effet hexagonal

      for (let col = 0; col < gridCols; col++) {
        const baseX = baseSpacing + col * hexSize * 1.5 + offsetX;
        const baseY = baseSpacing + row * hexSize * 0.866;

        if (baseX > this.width || baseY > this.height) continue;

        // Ajout d'aléatoire pour un effet plus naturel
        const randomOffsetX = (Math.random() - 0.5) * 20;
        const randomOffsetY = (Math.random() - 0.5) * 20;
        const x = baseX + randomOffsetX;
        const y = baseY + randomOffsetY;
        const sizeVariation = (Math.random() - 0.5) * 10;
        const radius = this.baseRadius + sizeVariation;

        // const mot = new_tableau_mots.shift();
        // new_tableau_mots.push(mot);
        const mot =
          new_tableau_mots[Math.floor(new_tableau_mots.length * Math.random())];
        console.log(mot);
        if (this.iconManager.icons.hasOwnProperty(mot.toLowerCase())) {
          this.circles.push({
            x,
            y,
            baseRadius: radius,
            color: "#ffffff",
            isDragging: false,
            mot: mot.toLowerCase(),
          });
        }
      }
    }
  }

  // Configure les événements de la souris pour l'interaction
  setupMouseEvents() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
    this.canvas.addEventListener("mouseleave", this.handleMouseUp.bind(this));
  }

  // Gère le début du glisser-déposer et le clic sur le bouton
  handleMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Vérifie si le clic est sur un cercle pour le déplacer
    for (let i = 0; i < this.circles.length; i++) {
      const circle = this.circles[i];
      const distance = Math.sqrt(
        Math.pow(mouseX - circle.x, 2) + Math.pow(mouseY - circle.y, 2)
      );

      if (distance <= circle.baseRadius) {
        circle.isDragging = true;
        this.draggedCircle = circle;
        return;
      }
    }
  }

  // Gère le mouvement de la souris pour le glisser-déposer et l'effet de survol
  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Suppression de l'effet de survol sur les cercles
    // Les cercles ne changent plus de taille au survol
  }

  // Termine le glisser-déposer
  handleMouseUp() {
    if (this.draggedCircle) {
      this.draggedCircle.isDragging = false;
      this.draggedCircle = null;
    }
  }

  // Formate le texte pour qu'il s'adapte à une largeur maximale
  wrapText(text, maxWidth) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const width = this.ctx.measureText(currentLine + " " + words[i]).width;
      if (width < maxWidth) {
        currentLine += " " + words[i];
      } else {
        lines.push(currentLine);
        currentLine = words[i];
      }
    }
    lines.push(currentLine);
    return lines;
  }

  // Fonction principale de dessin, appelée en boucle
  draw() {
    // Efface et prépare le canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, 0, this.width, this.height);

    if (!this.isFlipped) {
      // Face avant : Affiche la grille d'images
      this.displayImagesGrid(this.images, {
        columns: Math.ceil(this.images.length / 2),
        spacing: 20,
      });

      // Dessine tous les cercles avec leurs icônes
      for (let i = 0; i < this.circles.length; i++) {
        const circle = this.circles[i];
        const radius = circle.baseRadius; // Utilise toujours la taille de base, pas d'effet de survol

        // Dessine le cercle
        this.ctx.beginPath();
        this.ctx.arc(circle.x, circle.y, radius, 0, Math.PI * 2);
        // this.ctx.fillStyle = circle.color;
        // this.ctx.fill();

        // Dessine l'icône dans le cercle
        if (this.iconManager.isReady && circle.mot) {
          this.ctx.save();
          this.ctx.globalCompositeOperation = "darken";
          this.iconManager.drawIcon(
            circle.mot,
            circle.x - radius,
            circle.y - radius,
            radius * 2,
            radius * 2
          );
          this.ctx.restore();
        }

        // Ajoute une bordure au cercle en cours de déplacement
        if (circle.isDragging) {
          this.ctx.strokeStyle = "#000000";
          this.ctx.lineWidth = 2;
          this.ctx.stroke();
        }

        this.ctx.closePath();
      }
    } else {
      // Face arrière : Affiche le texte du chatbot
      // Récupérer le texte du chatbot
      const chatDisplay = document.getElementById("chat-display");
      const messages = chatDisplay.querySelectorAll(
        ".user-message .message-content"
      );
      let chatText = "";

      // Concaténer uniquement les messages de l'utilisateur
      messages.forEach((message) => {
        chatText += message.textContent + "\n\n";
      });

      // Afficher le texte du chatbot
      this.ctx.fillStyle = "#000000";
      this.ctx.font = "bold 24px Arial";
      this.ctx.textAlign = "left";
      this.ctx.textBaseline = "top";

      const maxWidth = this.width - 120;
      const lines = this.wrapText(chatText, maxWidth);

      lines.forEach((line, index) => {
        this.ctx.fillText(line, 60, 60 + index * 30);
      });
    }

    requestAnimationFrame(() => this.draw());
  }

  // Affiche une grille d'images
  displayImagesGrid(images, options = {}) {
    images.forEach((image) => {
      this.ctx.drawImage(
        image.image,
        image.x,
        image.y,
        image.width,
        image.height
      );
    });
  }

  // Démarre l'animation de changement de place des icônes
  startIconAnimation() {
    // Arrêter l'animation existante si elle existe
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }

    // Démarrer une nouvelle animation
    this.animationInterval = setInterval(() => {
      if (this.circles.length > 1) {
        // Sélectionner 20 cercles aléatoires
        const selectedCircles = [];
        const availableIndices = [...Array(this.circles.length).keys()];

        // Sélectionner 20 indices aléatoires
        for (let i = 0; i < Math.min(20, this.circles.length); i++) {
          const randomIndex = Math.floor(
            Math.random() * availableIndices.length
          );
          selectedCircles.push(availableIndices[randomIndex]);
          availableIndices.splice(randomIndex, 1);
        }

        // Mélanger les mots des cercles sélectionnés
        const mots = selectedCircles.map((index) => this.circles[index].mot);
        this.shuffleArray(mots);

        // Réassigner les mots mélangés aux cercles sélectionnés
        selectedCircles.forEach((circleIndex, i) => {
          this.circles[circleIndex].mot = mots[i];
        });
      }
    }, 1000); // Change toutes les secondes
  }

  // Mélange un tableau
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Arrête l'animation
  stopIconAnimation() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }

  writeBackText(text) {
    //get flip-card-back
    const flipCardBack = document.querySelector(".flip-card-back-content");
    flipCardBack.innerHTML = text;
  }
}
