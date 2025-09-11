//

export function copy_value_to_clipboard(element: `#${string}` | string) {
  return `
    on click
      set text to ${element}.value or ${element}.innerText
      js(me, text)
        navigator.clipboard.writeText(text)
      end
      halt
  `;
}
