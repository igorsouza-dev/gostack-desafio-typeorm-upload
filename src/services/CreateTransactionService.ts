import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepo = getCustomRepository(TransactionsRepository);
    const categoryRepo = getRepository(Category);

    const categoryEntity = await categoryRepo.findOne({
      where: { title: category },
    });

    let categoryId = null;

    if (categoryEntity) {
      categoryId = categoryEntity.id;
    } else {
      const newCategory = categoryRepo.create({
        title: category,
      });
      await categoryRepo.save(newCategory);
      categoryId = newCategory.id;
    }
    if (type === 'outcome') {
      const balance = await transactionRepo.getBalance();
      if (balance.total < value) {
        throw new AppError('Insuficient funds', 400);
      }
    }

    const transaction = transactionRepo.create({
      title,
      type,
      value,
      category_id: categoryId,
    });
    await transactionRepo.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
