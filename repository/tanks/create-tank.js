import { Tank } from '../../models';

async function createTank(tankData) {
  const tank = new Tank(tankData);
  await tank.save();
  return tank;
}

export default createTank;
