import { Tank } from '../../models';

async function findAllTanks() {
  const tanks = await Tank.find({});
  return tanks;
}

export default findAllTanks;
