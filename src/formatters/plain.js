import _ from 'lodash';

const stringify = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }

  if (typeof value === 'string') {
    return `'${value}'`;
  }

  return `${value}`;
};

export default (diff) => {
  const iter = (node, parentPath) => {
    const output = node
      .map((entry) => {
        const { key, type } = entry;
        const currentPath = `${parentPath}${key}`;

        switch (type) {
          case 'nest':
            return iter(entry.children, `${currentPath}.`);

          case 'removed':
            return `Property '${currentPath}' was removed`;

          case 'added':
            return `Property '${currentPath}' was added with value: ${stringify(entry.newValue)}`;

          case 'changed':
            return `Property '${currentPath}' was updated. From ${stringify(entry.oldValue)} to ${stringify(entry.newValue)}`;

          case 'unchanged':
            return [];

          default:
            throw new Error(`Unable to parse the comparison result. Unknown entry type: "${entry.type}"`);
        }
      });
    return output.flat();
  };
  return iter(diff, '').join('\n');
};
