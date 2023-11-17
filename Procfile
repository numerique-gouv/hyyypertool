postdeploy: >
  curl -fsSL https://fnm.vercel.app/install | bash \
  && export PATH="/app/.local/share/fnm:$PATH" \
  && eval "`fnm env`" \
  && fnm install --lts \
  && bun x prisma generate \
  ;
