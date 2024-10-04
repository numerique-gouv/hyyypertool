//

//
// Inspired by https://github.com/GouvernementFR/dsfr/blob/fe9d66b4ccaa7c3a3c0cb07eca69ddd6787965c4/src/scheme/script/scheme/scheme-boot.js#L14
//

export const set_prefers_color_scheme = `
-- from https://github.com/sqwxl/harfang/blob/afb20cbc60c9eb44d2ce0501a7f754afc7395915/app/templates/partials/theme_toggle.html#L59C33-L84C1
def nextTheme()
  set currentTheme to localStorage.theme
  set prefersDark to window.matchMedia("(prefers-color-scheme: dark)").matches

  if prefersDark
      -- auto(dark) -> light -> dark
      if no currentTheme
          return "light"
      else if currentTheme is "light"
          return "dark"
      else
          return null
      end
  else
      -- auto(light) -> dark -> light
      if no currentTheme
          return "dark"
      else if currentTheme is "dark"
          return "light"
      else
          return null
      end
  end
end

on load
  set theme to nextTheme()
  if no theme
      call localStorage.removeItem("theme")
  else
      set localStorage.theme to theme
  end
`;
