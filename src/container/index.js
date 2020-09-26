/* eslint-disable no-param-reassign */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const awilix = require('awilix');
const glob = require('glob');
const path = require('path');

const container = awilix.createContainer();

const singletonClass = (c) => awilix.asClass(c, { lifetime: awilix.Lifetime.SINGLETON });

/**
 * @param {string} string - Glob string
 */
function processGlob(string) {
  const files = glob.sync(string);
  const data = files
    .map((file) => ({
      name: path.basename(file, '.js').charAt(0).toLowerCase() + path.basename(file, '.js').slice(1),
      path: path.resolve(file),
    }));

  const containerData = data.reduce((map, file) => {
    map[file.name] = singletonClass(require(file.path));

    return map;
  }, {});

  container.register(containerData);
}

processGlob('src/repositories/*Repository.js');
processGlob('src/useCases/**/*{Controller,UseCase}.js');

module.exports = container;
