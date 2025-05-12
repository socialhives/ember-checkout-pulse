import React, { createContext, useState, useContext } from "react";

// Define available languages
export type Language = "en" | "fr" | "zu" | "af"; // English, French, Zulu, Afrikaans

// Define context type
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translate: (text: string) => string;
}

// Create default translations for common UI text
const translations: Record<string, Record<Language, string>> = {
  "Welcome": {
    en: "Welcome",
    fr: "Bienvenue",
    zu: "Siyakwamukela",
    af: "Welkom"
  },
  "Payment Amount": {
    en: "Payment Amount",
    fr: "Montant du paiement",
    zu: "Inani lemali",
    af: "Betalingsbedrag"
  },
  "Enter Amount": {
    en: "Enter Amount",
    fr: "Entrer le montant",
    zu: "Faka inani",
    af: "Voer bedrag in"
  },
  "Pay Now": {
    en: "Pay Now",
    fr: "Payez maintenant",
    zu: "Khokha manje",
    af: "Betaal nou"
  },
  "Login": {
    en: "Login",
    fr: "Connexion",
    zu: "Ngena",
    af: "Teken in"
  },
  "Email": {
    en: "Email",
    fr: "Email",
    zu: "I-imeyili",
    af: "E-pos"
  },
  "Password": {
    en: "Password",
    fr: "Mot de passe",
    zu: "Iphasiwedi",
    af: "Wagwoord"
  },
  "Sign In": {
    en: "Sign In",
    fr: "Se connecter",
    zu: "Ngena ngemvume",
    af: "Teken in"
  },
  "Register": {
    en: "Register",
    fr: "S'inscrire",
    zu: "Bhalisa",
    af: "Registreer"
  },
  "or": {
    en: "or",
    fr: "ou",
    zu: "noma",
    af: "of"
  },
  "Sign in with Google": {
    en: "Sign in with Google",
    fr: "Se connecter avec Google",
    zu: "Ngena nge-Google",
    af: "Meld aan met Google"
  }
};

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");

  const translate = (text: string): string => {
    // If we have a translation for this text, return it
    if (translations[text] && translations[text][language]) {
      return translations[text][language];
    }
    // Otherwise return the original text
    return text;
  };

  const value = {
    language,
    setLanguage,
    translate
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
