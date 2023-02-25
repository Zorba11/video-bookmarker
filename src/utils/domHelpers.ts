export function findElementByClassName(className: string): HTMLElement | null {
  let elements: HTMLCollectionOf<Element> = document.getElementsByTagName('*');

  if (elements.length === 0) return null;

  for (let i = 0; i < elements.length; i++) {
    if (elements[i].classList.length > 0) {
      for (let j = 0; j < elements[i].classList.length; j++) {
        if (elements[i].classList[j].startsWith(className)) {
          return elements[i] as HTMLElement;
        }
      }
    }
  }
}
