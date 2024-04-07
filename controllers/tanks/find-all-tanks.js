import { tanksRepository } from '../../repository';

async function findAllTanks(_req, res) {
  const tanks = await tanksRepository.findAllTanks();
  res.json(tanks);
}

export default findAllTanks;
