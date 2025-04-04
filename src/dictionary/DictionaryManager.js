/**
 * Gestionnaire de dictionnaire de mots.
 * Cette classe gère la liste des mots autorisés pour l'application
 * et génère le prompt système pour le modèle d'IA.
 */
export class DictionaryManager {
  /**
   * Initialise le gestionnaire de dictionnaire.
   *
   * @param {Array<string>} allowedWords - Liste des mots autorisés
   */
  constructor(allowedWords = []) {
    // Liste des mots autorisés pour l'application
    this.allowedWords = allowedWords;
  }

  /**
   * Génère le prompt système qui explique les contraintes du dictionnaire.
   *
   * @returns {string} - Le prompt système
   */
  getSystemPrompt() {
    // Construire le prompt avec les instructions et la liste des mots
    const wordsStr = this.allowedWords.join(", ");

    const prompt = `Tu es un assistant utile. Tu travailles avec des étudiants en première année de design interactif. Tu réponds simplement aux questions en étant pédagogue. Si une image est fournie, la tenir en compte pour répondre. `;

    return prompt;
  }

  /**
   * Récupère la liste des mots du dictionnaire.
   *
   * @returns {Array<string>} - Liste des mots du dictionnaire
   */
  getWords() {
    return [...this.allowedWords]; // Retourne une copie de la liste
  }

  /**
   * Formate la liste des mots pour l'affichage.
   * Les mots sont séparés par des virgules.
   *
   * @returns {string} - Chaîne formatée des mots du dictionnaire
   */
  getFormattedWordList() {
    return this.allowedWords.join(", ");
  }

  /**
   * Met à jour la liste des mots du dictionnaire.
   *
   * @param {Array<string>} words - Liste des mots autorisés
   */
  setWords(words) {
    this.allowedWords = words;
  }
}
