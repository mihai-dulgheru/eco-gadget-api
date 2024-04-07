import { tanksRepository } from '../../repository';

async function deleteTank(req, res) {
  const dbResponse = await tanksRepository.deleteTank(req.params.id);
  if (dbResponse) {
    res.json(dbResponse);
  } else {
    res.status(404).json({ name: 'NotFoundError', message: 'Tank not found' });
  }
}

export default deleteTank;
