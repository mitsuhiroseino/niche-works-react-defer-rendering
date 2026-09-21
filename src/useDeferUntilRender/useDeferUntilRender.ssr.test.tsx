// @vitest-environment node
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import useDeferUntilRender from './useDeferUntilRender';

function Fixture({ initialCondition }: { initialCondition?: boolean }) {
  const { node } = useDeferUntilRender('ready-content', '.marker', {
    pending: 'pending-content',
    initialCondition,
  });
  return <>{node}</>;
}

describe('useDeferUntilRender (SSR)', () => {
  it('document/MutationObserverが存在しない環境でもrenderToStringが例外なく完了する', () => {
    // getSnapshotはdocument.querySelectorに依存するため、
    // SSR時にgetServerSnapshotへ正しくフォールバックできていないとここで例外になる
    expect(() => renderToString(<Fixture />)).not.toThrow();
  });

  it('initialConditionを指定しない場合、pending側のノードがSSR出力に含まれる', () => {
    const html = renderToString(<Fixture />);
    expect(html).toContain('pending-content');
    expect(html).not.toContain('ready-content');
  });

  it('initialCondition: trueを指定した場合、ready側のノードがSSR出力に含まれる', () => {
    const html = renderToString(<Fixture initialCondition />);
    expect(html).toContain('ready-content');
    expect(html).not.toContain('pending-content');
  });
});
