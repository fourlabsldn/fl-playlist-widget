/* globals xController */
import ModuleCoordinator from './ModuleCoordinator';

const MODULE_PREFIX = 'fl-pw';

xController((xdiv) => {
  console.log(xdiv);
  const serverUrl = 'tesssst';
  const userId = 'abcde';

  const coordinator = new ModuleCoordinator(MODULE_PREFIX);
  xdiv.appendChild(coordinator.getWidget());
});
