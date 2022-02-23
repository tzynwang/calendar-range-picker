import en from "./lang/en";
import zh from "./lang/zh";

export default class I18n {
  public lang;

  constructor(locale: "en" | "zh" = "en") {
    if (locale === "en") this.lang = en;
    if (locale === "zh") this.lang = zh;
  }

  t(label: string) {
    if (!this.lang || !Object.keys(this.lang).includes(label)) return "";
    const newLabel = label as keyof typeof this.lang;
    return this.lang[newLabel] ? this.lang[newLabel] : "";
  }
}
