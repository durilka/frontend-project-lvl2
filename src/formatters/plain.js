import _ from 'lodash/fp';

const getValue = (value) => (_.isObject(value) ? '[complex value]' : value);

const plainRender = (ast) => {
  const iter = (data, acc = '') => {
    const derivation = data.filter(({ action }) => action !== 'nothing')
      .map(({
        key, action, valueBefore, valueAfter, children,
      }) => {
        const newAcc = !acc ? `${key}` : `${acc}.${key}`;
        switch (action) {
          case 'inside': {
            return iter(children, newAcc);
          }
          case 'added': {
            return `Property '${newAcc}' was added with value: ${getValue(valueAfter)}.`;
          }
          case 'deleted': {
            return `Property ${newAcc} was removed.`;
          }
          case 'updated': {
            return `Property ${newAcc} was updated. From ${getValue(valueBefore)} to ${getValue(valueAfter)}.`;
          }
          default:
            throw new Error('Ooops...unexpected type of node');
        }
      });
    return derivation.join('\n');
  };
  return iter(ast);
};

export default plainRender;
