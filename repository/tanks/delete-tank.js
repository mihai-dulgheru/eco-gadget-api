import { Tank } from '../../models';

async function deleteTank(tankId) {
  const result = await Tank.findByIdAndDelete(tankId);
  return result;
}

export default deleteTank;
