export interface TocLink {
  /* id of the section*/
  id: string;

  /* header type h3/h4 */
  level: number;

  /* name of the anchor */
  name: string;

  /* top offset px of the anchor */
  top: number;
}

/**
 * Create a TocLink from an element in static mode, i.e. when no directives are used.
 */
export function tocLinkfromStaticElement(element: HTMLElement): { element: HTMLElement, link: TocLink } {
  element = element.tagName === 'A' ? element.parentElement : element;
  const link = createLink(element);
  return { element, link };
}

export function createLink(element: HTMLElement): TocLink {
  const tagName = element.tagName.match(/^h(\d)$/i);
  let id: string = element.id;
  if (!id) {
    const anchor = element.querySelector('a.anchor');
    if (anchor) {
      id = anchor.id;
    }
  }
  return {
    name: element.getAttribute('name') || element.innerText,
    level: element.getAttribute('level') || <any> (tagName ? tagName[1] : 1),
    top: 0,
    id
  };
}
