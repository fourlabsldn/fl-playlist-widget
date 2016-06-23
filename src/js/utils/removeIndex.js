
import assert from 'fl-assert';
/**
 * Returns a new array without the element in the given index
 * @method removeIndex
 * @param {Int} index
 * @return {Array} [description]
 */
export default function removeIndex(arr, index) {
  assert(typeof index === 'number', `Invalid index: ${index}`);
  return arr.slice(0, index).concat(arr.slice(index + 1, arr.length));
}
