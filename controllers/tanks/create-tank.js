import { tanksRepository } from '../../repository';

async function createTank(req, res) {
  const { name, size } = req.body;
  const dbResponse = await tanksRepository.createTank({ name, size });
  res.json(dbResponse);
}

export default createTank;
