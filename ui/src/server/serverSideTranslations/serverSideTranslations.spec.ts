import { modifyI18nStore } from './serverSideTranslations';

const mockI18nContent = {
  common: {
    foo: 'bar',
    bar: 'baz',
    a: {
      b: '1',
      c: '2',
      d: '3',
      e: {
        a: '1',
        b: '2',
        c: '3',
        d: {
          a: '1',
          b: '2',
          c: '3',
        },
      },
    },
  },
};

describe('no exclude and include', () => {
  test('should return original object', () => {
    expect(modifyI18nStore(mockI18nContent, [])).toMatchObject(mockI18nContent);
  });
});

describe('have include config', () => {
  test('plain include', () => {
    expect(
      modifyI18nStore(mockI18nContent, [
        {
          nameSpace: 'common',
          include: ['foo', 'bar'],
        },
      ]),
    ).toMatchObject({
      common: {
        foo: 'bar',
        bar: 'baz',
      },
    });
  });
  test('deep include 1', () => {
    expect(
      modifyI18nStore(mockI18nContent, [
        {
          nameSpace: 'common',
          include: ['foo', { a: 'b' }],
        },
      ]),
    ).toMatchObject({
      common: {
        foo: 'bar',
        a: {
          b: '1',
        },
      },
    });
  });
  test('deep include 2', () => {
    expect(
      modifyI18nStore(mockI18nContent, [
        {
          nameSpace: 'common',
          include: ['foo', { a: ['b', 'd', { e: 'b' }] }],
        },
      ]),
    ).toMatchObject({
      common: {
        foo: 'bar',
        a: {
          b: '1',
          d: '3',
          e: {
            b: '2',
          },
        },
      },
    });
  });
  test('deep include 3', () => {
    expect(
      modifyI18nStore(mockI18nContent, [
        {
          nameSpace: 'common',
          include: ['foo', { a: { e: { d: ['a', 'b'] } } }],
        },
      ]),
    ).toMatchObject({
      common: {
        foo: 'bar',
        a: {
          e: {
            d: {
              a: '1',
              b: '2',
            },
          },
        },
      },
    });
  });
});

describe('have exclude config', () => {
  test('plain exclude', () => {
    expect(
      modifyI18nStore(mockI18nContent, [
        {
          nameSpace: 'common',
          exclude: ['foo', 'a'],
        },
      ]),
    ).toMatchObject({
      common: {
        bar: 'baz',
      },
    });
  });
  test('deep exclude 1', () => {
    expect(
      modifyI18nStore(mockI18nContent, [
        {
          nameSpace: 'common',
          exclude: ['foo', { a: ['d', 'e'] }],
        },
      ]),
    ).toMatchObject({
      common: {
        bar: 'baz',
        a: {
          b: '1',
          c: '2',
        },
      },
    });
  });
  test('deep exclude 2', () => {
    expect(
      modifyI18nStore(mockI18nContent, [
        {
          nameSpace: 'common',
          exclude: ['foo', { a: ['d', { e: ['b', 'd'] }] }],
        },
      ]),
    ).toMatchObject({
      common: {
        bar: 'baz',
        a: {
          b: '1',
          c: '2',
          e: {
            a: '1',
            c: '3',
          },
        },
      },
    });
  });
  test('deep exclude 3', () => {
    expect(
      modifyI18nStore(mockI18nContent, [
        {
          nameSpace: 'common',
          exclude: ['foo', { a: ['d', { e: ['b', { d: ['a', 'c'] }] }] }],
        },
      ]),
    ).toMatchObject({
      common: {
        bar: 'baz',
        a: {
          b: '1',
          c: '2',
          e: {
            a: '1',
            c: '3',
            d: {
              b: '2',
            },
          },
        },
      },
    });
  });
});
