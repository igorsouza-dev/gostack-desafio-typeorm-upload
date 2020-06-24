import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const incomeResults = await this.find({
      where: { type: 'income' },
    });
    const income = incomeResults.reduce(
      (accumulator, transaction) => accumulator + Number(transaction.value),
      0,
    );
    const outcomeResults = await this.find({
      where: { type: 'outcome' },
    });
    const outcome = outcomeResults.reduce(
      (accumulator, transaction) => accumulator + Number(transaction.value),
      0,
    );

    return { income, outcome, total: income - outcome };
  }
}

export default TransactionsRepository;
