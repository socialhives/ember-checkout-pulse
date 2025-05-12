import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface TranslatedTextProps {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  children?: React.ReactNode;
}

export const TranslatedText: React.FC<TranslatedTextProps> = ({
  text,
  as: Component = "span",
  className = "",
  children,
}) => {
  const { translate } = useLanguage();
  
  // If children are provided, use text as the translation key
  // Otherwise, use text as both the key and the content to display
  const content = children || text;
  
  return <Component className={className}>{translate(text)}</Component>;
};

// Helper hook to make translations easier to use anywhere in the app
export const useTranslate = () => {
  const { translate } = useLanguage();
  return translate;
};
