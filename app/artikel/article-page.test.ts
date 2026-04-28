import React from 'react';
import { expect, test } from 'vitest';
import ArticlePage from './[slug]/page';

function hasComponentNamed(node: React.ReactNode, componentName: string): boolean {
  if (!React.isValidElement(node)) return false;
  const type = node.type;
  if (typeof type === 'function' && type.name === componentName) return true;
  const props = node.props as { children?: React.ReactNode };
  return React.Children.toArray(props.children).some(child => hasComponentNamed(child, componentName));
}

test('renders the shared footer on generated article pages', async () => {
  const element = await ArticlePage({
    params: Promise.resolve({
      slug: 'lichter-filmfest-startet-in-frankfurt-wenn-kino-die-kunst-befragt',
    }),
  });

  expect(hasComponentNamed(element, 'PubFooter')).toBe(true);
});
