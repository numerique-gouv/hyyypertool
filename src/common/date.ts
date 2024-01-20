//

export function date_to_string(date: Date | undefined | null) {
  return date
    ? `${date.toLocaleDateString("fr-FR")} ${date.toLocaleTimeString("fr-FR")} `
    : "";
}
