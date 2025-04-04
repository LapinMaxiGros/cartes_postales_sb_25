// Code sauvegardé de CanvasFunctions.js

// Propriétés du bouton CTA
const ctaButton = {
  x: width - 200,
  y: height - 80,
  width: 180,
  height: 60,
  text: "Flip",
  isHovered: false,
  isClicked: false,
};

// Palette de couleurs
const colorPalette = {
  colors: [
    { name: "bleu", value: "#a8d8ea" },
    { name: "violet", value: "#d8b4fe" },
    { name: "jaune", value: "#ffd8a8" },
    { name: "rouge", value: "#ffa8a8" },
    { name: "vert", value: "#b2f2bb" },
    { name: "rose", value: "#ffc9de" },
    { name: "turquoise", value: "#99e9f2" },
    { name: "blanc", value: "#ffffff" },
  ],
  size: 40,
  spacing: 10,
  selectedIndex: 7, // Blanc par défaut
  isHovered: -1,
};

// Couleur de fond actuelle
const backgroundColor = colorPalette.colors[colorPalette.selectedIndex].value;

// Configurer les événements pour le bouton CTA
function setupCtaEvents() {
  canvas.addEventListener("mousemove", handleCtaHover);
  canvas.addEventListener("mousedown", handleCtaClick);
  canvas.addEventListener("mouseup", handleCtaRelease);
}

// Configurer les événements pour la palette de couleurs
function setupColorPaletteEvents() {
  canvas.addEventListener("mousemove", handleColorPaletteHover);
  canvas.addEventListener("mousedown", handleColorPaletteClick);
}

// Gérer le survol de la palette de couleurs
function handleColorPaletteHover(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // Calculer la position de la palette
  const paletteHeight =
    colorPalette.colors.length * (colorPalette.size + colorPalette.spacing) -
    colorPalette.spacing;
  const paletteX = width - colorPalette.size - 20; // Collé à droite avec une marge de 20px
  const paletteY = height - 180 - paletteHeight; // Même position verticale qu'avant

  // Vérifier si la souris est sur un carré de couleur
  for (let i = 0; i < colorPalette.colors.length; i++) {
    const colorX = paletteX;
    const colorY = paletteY + i * (colorPalette.size + colorPalette.spacing);

    if (
      mouseX >= colorX &&
      mouseX <= colorX + colorPalette.size &&
      mouseY >= colorY &&
      mouseY <= colorY + colorPalette.size
    ) {
      colorPalette.isHovered = i;
      canvas.style.cursor = "pointer";
      return;
    }
  }

  colorPalette.isHovered = -1;
  canvas.style.cursor = "default";
}

// Gérer le clic sur la palette de couleurs
function handleColorPaletteClick(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // Calculer la position de la palette
  const paletteHeight =
    colorPalette.colors.length * (colorPalette.size + colorPalette.spacing) -
    colorPalette.spacing;
  const paletteX = width - colorPalette.size - 20; // Collé à droite avec une marge de 20px
  const paletteY = height - 180 - paletteHeight; // Même position verticale qu'avant

  // Vérifier si le clic est sur un carré de couleur
  for (let i = 0; i < colorPalette.colors.length; i++) {
    const colorX = paletteX;
    const colorY = paletteY + i * (colorPalette.size + colorPalette.spacing);

    if (
      mouseX >= colorX &&
      mouseX <= colorX + colorPalette.size &&
      mouseY >= colorY &&
      mouseY <= colorY + colorPalette.size
    ) {
      colorPalette.selectedIndex = i;
      backgroundColor = colorPalette.colors[i].value;
      e.stopPropagation();
      return;
    }
  }
}

// Gérer le survol du bouton CTA
function handleCtaHover(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // Vérifier si la souris est sur le bouton
  if (
    mouseX >= ctaButton.x &&
    mouseX <= ctaButton.x + ctaButton.width &&
    mouseY >= ctaButton.y &&
    mouseY <= ctaButton.y + ctaButton.height
  ) {
    ctaButton.isHovered = true;
    canvas.style.cursor = "pointer";
  } else {
    ctaButton.isHovered = false;
    canvas.style.cursor = "default";
  }
}

// Gérer le clic sur le bouton CTA
function handleCtaClick(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // Vérifier si le clic est sur le bouton
  if (
    mouseX >= ctaButton.x &&
    mouseX <= ctaButton.x + ctaButton.width &&
    mouseY >= ctaButton.y &&
    mouseY <= ctaButton.y + ctaButton.height
  ) {
    ctaButton.isClicked = true;
    // Empêcher la propagation pour éviter de déplacer un cercle
    e.stopPropagation();
  }
}

// Gérer le relâchement du clic sur le bouton CTA
function handleCtaRelease(e) {
  if (ctaButton.isClicked) {
    ctaButton.isClicked = false;
    // Action du bouton : réinitialiser les positions des cercles
    initializeCircles();
  }
}

// Dessiner le bouton CTA
function drawCtaButton() {
  const { x, y, width, height, text, isHovered, isClicked } = ctaButton;

  // Dessiner l'ombre du bouton
  ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 5;

  // Dessiner le fond du bouton
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 10);

  // Changer la couleur en fonction de l'état du bouton
  if (isClicked) {
    ctx.fillStyle = "#f8f9fa"; // Blanc légèrement grisé quand cliqué
  } else if (isHovered) {
    ctx.fillStyle = "#f8f9fa"; // Blanc légèrement grisé quand survolé
  } else {
    ctx.fillStyle = "#ffffff"; // Blanc normal
  }

  ctx.fill();

  // Dessiner le contour noir
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Réinitialiser l'ombre pour le texte
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Dessiner le texte du bouton
  ctx.font = "bold 18px Arial";
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + width / 2, y + height / 2);

  ctx.closePath();
}

// Dessiner la palette de couleurs
function drawColorPalette() {
  const { colors, size, spacing, selectedIndex, isHovered } = colorPalette;

  // Calculer la position de la palette
  const paletteHeight = colors.length * (size + spacing) - spacing;
  const paletteX = width - size - 20; // Collé à droite avec une marge de 20px
  const paletteY = height - 180 - paletteHeight; // Même position verticale qu'avant

  // Dessiner chaque carré de couleur
  for (let i = 0; i < colors.length; i++) {
    const colorX = paletteX;
    const colorY = paletteY + i * (size + spacing);

    // Dessiner le contour noir
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(colorX, colorY, size, size);

    // Dessiner le carré de couleur
    ctx.fillStyle = colors[i].value;
    ctx.fillRect(colorX, colorY, size, size);

    // Ajouter un effet de survol
    if (i === isHovered) {
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 3;
      ctx.strokeRect(colorX - 2, colorY - 2, size + 4, size + 4);
    }

    // Ajouter un effet de sélection
    if (i === selectedIndex) {
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 4;
      ctx.strokeRect(colorX - 3, colorY - 3, size + 6, size + 6);
    }
  }
}

// Animation des cercles
function calculateCircleRadius(circle, i) {
  const radiusVariation = Math.sin(Date.now() / 1000 + i * 0.1) * 5;
  return circle.baseRadius + radiusVariation;
}
