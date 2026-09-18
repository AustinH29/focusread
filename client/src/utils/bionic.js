// Bold the first ~half of each word for bionic reading.
export function applyBionic(text) {
  return text.split(/(\s+)/).map((token, i) => {
    if (/^\s+$/.test(token)) return token;
    const boldLen = Math.max(1, Math.ceil(token.length / 2));
    return `<b>${token.slice(0, boldLen)}</b>${token.slice(boldLen)}`;
  }).join('');
}
