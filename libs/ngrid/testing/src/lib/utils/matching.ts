import { TestElement } from '@angular/cdk/testing';

export async function findHostClassMatch(hostElement: TestElement, regExp: RegExp): Promise<RegExpMatchArray | undefined> {
  const classAttribute = await hostElement.getAttribute('class');
  return findClassMatch(classAttribute, regExp);
}

export function findClassMatch(classAttributeValue: string, regExp: RegExp): RegExpMatchArray | undefined {
  for (const c of classAttributeValue.split(' ')) {
    const match = c.trim().match(regExp);
    if (match) {
      return match;
    }
  }
}
