//

export function date_to_string(date: Date | undefined | null) {
  return date
    ? `${date.toLocaleDateString()} ${date.toLocaleTimeString()} `
    : "";
}
