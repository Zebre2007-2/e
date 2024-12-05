// Vendetta Translation Plugin - TypeScript Version

// Interface pour représenter un message Discord
interface Message {
  content: string;
}

// Variables globales pour gérer l'état du plugin
let enabled: boolean = false;
let targetLang: string = "en"; // Langue par défaut (anglais)

// Fonction d'ajout de l'icône de traduction dans la barre de discussion
function addTranslationIcon(): void {
  const chatInput = document.querySelector(".chat-input") as HTMLElement;
  if (!chatInput) return;

  const icon = document.createElement("div");
  icon.textContent = "🌐";
  icon.style.cursor = "pointer";
  icon.style.marginLeft = "8px";
  icon.style.fontSize = "20px";
  icon.style.opacity = "0.5"; // Apparence par défaut désactivée

  // Gestion du clic pour activer/désactiver la traduction
  icon.addEventListener("click", () => {
    enabled = !enabled;
    icon.style.opacity = enabled ? "1" : "0.5";
  });

  chatInput.appendChild(icon);
}

// Fonction de traduction via l'API Google Translate
async function translateText(text: string, lang: string): Promise<string> {
  const response = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(
      text
    )}`
  );
  const data = await response.json();
  return data[0][0][0];
}

// Hook pour intercepter les messages envoyés et les traduire
function hookSendMessage(): void {
  const originalSendMessage = (window as any).sendMessage; // Hypothèse que sendMessage existe

  (window as any).sendMessage = async function (message: Message) {
    if (enabled && message.content) {
      message.content = await translateText(message.content, targetLang);
    }
    return originalSendMessage.call(this, message);
  };
}

// Ajout d'un sélecteur de langue
function addLanguageSelector(): void {
  const langOptions: string[] = ["en", "fr", "es", "de", "it", "pt"];
  const langSelector = document.createElement("select");

  langOptions.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang;
    option.textContent = lang.toUpperCase();
    langSelector.appendChild(option);
  });

  langSelector.addEventListener("change", (e) => {
    targetLang = (e.target as HTMLSelectElement).value;
  });

  document.body.appendChild(langSelector); // Position à ajuster selon l'UI de Vendetta
}

// Fonction d'initialisation du plugin
function init(): void {
  addTranslationIcon();
  addLanguageSelector();
  hookSendMessage();
}

// Exécute l'initialisation du plugin
init();
