/**
 * Gestionnaire d'enregistrement des fonctions.
 * Cette classe définit toutes les fonctions disponibles pour le modèle d'IA
 * et gère leur affichage dans le terminal.
 */
export class FunctionRegistry {
  /**
   * Constructeur du registre de fonctions.
   * Initialise les fonctions disponibles et le gestionnaire de fonctions.
   *
   * @param {Object} functionHandler - Le gestionnaire de fonctions qui traitera les appels
   */
  constructor(functionHandler, minifyManager) {
    this.functions = {};
    this.functionHandler = functionHandler;
    this.terminal = null;
    this.minifyManager = minifyManager;
    this.canvasFunctions = minifyManager.canvasManager.canvasFunctions;

    // Définition des fonctions disponibles
    this.availableFunctions = {
      reponse_dictionnaire: {
        handler: (args) => {
          // Cette fonction permet de traiter une réponse en utilisant
          // strictement les mots du dictionnaire
          const result = {
            success: true,
            message: `Réponse traitée avec ${
              args.mots?.length || 0
            } mots du dictionnaire`,
          };

          this.canvasFunctions.generatePostcard(args.mots);

          // Afficher le résultat dans le terminal
          this.terminal.showInTerminal("reponse_dictionnaire", args, result);
        },
        description:
          "Traite une réponse en utilisant strictement les mots du dictionnaire sans en inventer de nouveaux",
        parameters: {
          mots: {
            type: "array",
            description:
              "Liste des mots du dictionnaire à utiliser dans la réponse",
            items: {
              type: "string",
            },
          },
        },
      },
    };
  }

  /**
   * Initialise le terminal pour afficher les résultats des fonctions.
   *
   * @param {Object} terminal - Le terminal à utiliser
   */
  initializeTerminal(terminal) {
    this.terminal = terminal;
  }

  /**
   * Enregistre toutes les fonctions définies dans availableFunctions.
   * Cette méthode est appelée au démarrage de l'application.
   */
  registerAllFunctions() {
    // Parcourir toutes les fonctions disponibles et les enregistrer
    Object.entries(this.availableFunctions).forEach(([name, funcConfig]) => {
      this.functionHandler.registerFunction(
        name,
        funcConfig.handler,
        funcConfig.description,
        funcConfig.parameters
      );
    });
  }
}
