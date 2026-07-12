/**
 * Normalize pokeemerald item/berry description + name strings for the guide UI.
 * Shared by generators (scripts) and runtime display.
 */

/** Fix game-text placeholders and ALL-CAPS berry grow names. */
export function cleanItemDescription(desc) {
  if (!desc) return "";
  return String(desc)
    .replace(/\{POKEBLOCK\}/gi, "Pok\u00e9block")
    .replace(/\{POK\u00e9MON\}/gi, "Pok\u00e9mon")
    .replace(/\{POKEMON\}/gi, "Pok\u00e9mon")
    .replace(/\{STR_VAR_\d\}/gi, "")
    .replace(/\\[nlp]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/to grow ([A-Z][A-Z0-9]+)\./g, (_, berry) => {
      const name = berry.charAt(0) + berry.slice(1).toLowerCase();
      return `to grow ${name}.`;
    })
    .replace(/\bPOKéMON\b/g, "Pok\u00e9mon")
    .replace(/\bPOKEMON\b/g, "Pok\u00e9mon")
    .replace(/\bPOKé\b/g, "Pok\u00e9")
    .replace(/\bPOKE\b/g, "Pok\u00e9");
}

/** Title-case item names from items.h (keeps TM/HM/PP/etc.). */
export function cleanItemName(name) {
  if (!name) return "";
  return String(name)
    .replace(/POKé/gi, "Pok\u00e9")
    .replace(/POKE(?!BLOCK)/gi, "Pok\u00e9")
    .split(/\s+/)
    .map((w) => {
      if (/^(TM|HM)\d+$/i.test(w)) return w.toUpperCase();
      if (/^(PP|HP|SP|S\.S\.|X)$/i.test(w)) return w.toUpperCase();
      if (/^Pok\u00e9$/i.test(w)) return "Pok\u00e9";
      if (w === w.toUpperCase() && w.length > 1 && !/^(TM|HM|PP|HP|SP)$/i.test(w)) {
        return w.charAt(0) + w.slice(1).toLowerCase();
      }
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(" ")
    .replace(/\bPok\u00e9\b/g, "Pok\u00e9");
}
