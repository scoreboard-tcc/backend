const { getPagination } = require('./pagination');

describe('getPagination', () => {
  test('It returns the default values', () => {
    const pagination = getPagination({ query: {} });

    expect(pagination).toStrictEqual({
      currentPage: 1,
      perPage: 10,
      isLengthAware: true,
    });
  });

  test('It throws error if currentPage is invalid', () => {
    try {
      getPagination({ query: { currentPage: '1a', perPage: 1 } });
    } catch (error) {
      expect(error).toStrictEqual(new Error('Invalid pagination'));
    }
  });

  test('It throws error if perPage is invalid', () => {
    try {
      getPagination({ query: { currentPage: 1, perPage: '1a' } });
    } catch (error) {
      expect(error).toStrictEqual(new Error('Invalid pagination'));
    }
  });

  test('It throws error if currentPage is 0', () => {
    try {
      getPagination({ query: { currentPage: 0, perPage: 1 } });
    } catch (error) {
      expect(error).toStrictEqual(new Error('Params pageNumber and perPage must be higher than 0'));
    }
  });

  test('It throws error if currentPage is lower than 0', () => {
    try {
      getPagination({ query: { currentPage: -1, perPage: 1 } });
    } catch (error) {
      expect(error).toStrictEqual(new Error('Params pageNumber and perPage must be higher than 0'));
    }
  });

  test('It throws error if perPage is 0', () => {
    try {
      getPagination({ query: { currentPage: 1, perPage: 0 } });
    } catch (error) {
      expect(error).toStrictEqual(new Error('Params pageNumber and perPage must be higher than 0'));
    }
  });

  test('It throws error if perPage is lower than 0', () => {
    try {
      getPagination({ query: { currentPage: 1, perPage: -1 } });
    } catch (error) {
      expect(error).toStrictEqual(new Error('Params pageNumber and perPage must be higher than 0'));
    }
  });

  test('It returns pagination with custom values', () => {
    const pagination = getPagination({ query: { currentPage: 5, perPage: 5 } });

    expect(pagination).toStrictEqual({
      currentPage: 5,
      perPage: 5,
      isLengthAware: true,
    });
  });
});
