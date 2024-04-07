import { tanksRepository } from '../../repository';

async function updateTank(req, res) {
  const { id } = req.params;
  const { name, size } = req.body;

  const updatedTank = await tanksRepository.updateTank(id, { name, size });

  if (!updatedTank) {
    return res
      .status(404)
      .json({ name: 'NotFoundError', message: 'Tank not found' });
  }

  res.json(updatedTank);
}

export default updateTank;
