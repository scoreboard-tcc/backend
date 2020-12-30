/**
 * @param string
 */
function isEmpty(string) {
  return string === null || string === undefined || !string.trim().length;
}

module.exports = { isEmpty };
