/* globals xController */
import ModuleCoordinator from './ModuleCoordinator';

const MODULE_PREFIX = 'fl-pw';

xController((xdiv) => {
  const userInfo = {
    id: xdiv.dataset.userId,
    name: xdiv.dataset.userName,
  };

  const coordinator = new ModuleCoordinator(MODULE_PREFIX, userInfo);
  xdiv.appendChild(coordinator.getWidget());
});
