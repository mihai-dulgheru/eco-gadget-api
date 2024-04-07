import { Tank } from '../../models';

async function findTankById(tankId) {
  const tank = await Tank.findById(tankId);
  return tank;
}

export default findTankById;
