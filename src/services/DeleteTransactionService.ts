import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepo = getCustomRepository(TransactionsRepository);
    const transaction = await transactionsRepo.findOne(id);

    if (!transaction) {
      throw new AppError('Could not find transaction', 404);
    }

    await transactionsRepo.remove(transaction);
  }
}

export default DeleteTransactionService;
