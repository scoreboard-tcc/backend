/**
 * @param {object} request - express request
 * @returns {object} pagination
 */
function getPagination(request) {
  const { currentPage = 1, perPage = 10 } = request.query;

  const currentPageNumber = Number(currentPage);
  const perPageNumber = Number(perPage);

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(currentPageNumber) || isNaN(perPageNumber)) { throw Error('Invalid pagination'); }

  if (currentPageNumber <= 0 || perPageNumber <= 0) {
    throw Error('Params pageNumber and perPage must be higher than 0');
  }

  return {
    currentPage,
    perPage: perPageNumber,
    isLengthAware: true,
  };
}

module.exports = { getPagination };
