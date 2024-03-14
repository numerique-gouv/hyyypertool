//

export function copy_to_clipboard(element: `#${string}` | string) {
  return `
    on click
    set text to ${element}.value
    js(me, text)
      if ('clipboard' in window.navigator) {
        navigator.clipboard.writeText(text)
      }
    end
  `;
}
