//

export const disable_until_htmx_afterOnLoad = `
on click
  toggle [@disabled=true] until htmx:afterOnLoad
end
`;
export const disable_all_button_until_htmx_afterOnLoad = `
on every htmx:beforeSend in <button/>
  tell it
    toggle [@disabled=true] until htmx:afterOnLoad
end
`;
