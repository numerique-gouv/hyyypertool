export const is_sticky = `
on intersection(intersecting) having threshold 1
  if intersecting remove .is-sticky else add .is-sticky
end
`;
