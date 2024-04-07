import { Tank } from '../../models';

async function updateTank(tankId, updateData) {
  const updatedTank = await Tank.findByIdAndUpdate(tankId, updateData, {
    new: true,
  });
  return updatedTank;
}

export default updateTank;
