
import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface TranslatedTextProps {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export const TranslatedText: React.FC<TranslatedTextProps> = ({
  text,
  as: Component = "span",
  className = "",
}) => {
  const { translate } = useLanguage();
  
  return <Component className={className}>{translate(text)}</Component>;
};
