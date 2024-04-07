import { tanksRepository } from '../../repository';

async function findTankById(req, res) {
  const tank = await tanksRepository.findTankById(req.params.id);
  if (tank) {
    res.json(tank);
  } else {
    res.status(404).json({ name: 'NotFoundError', message: 'Tank not found' });
  }
}

export default findTankById;
