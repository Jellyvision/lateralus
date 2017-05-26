import Lateralus from '../src/lateralus';

/**
 * @param {Function} [extraConstructorCode]
 */
export function getLateralusApp (extraConstructorCode) {
  return Lateralus.beget(function () {
    Lateralus.apply(this, arguments);

    if (extraConstructorCode) {
      extraConstructorCode.call(this);
    }
  });
}
