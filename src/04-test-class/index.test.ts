import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';
import { random } from 'lodash';

jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  random: jest.fn(),
}));

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const account = getBankAccount(100);
    expect(account.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(100);
    expect(() => account.withdraw(200)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const from = getBankAccount(100);
    const to = getBankAccount(100);

    expect(() => from.transfer(200, to)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const from = getBankAccount(100);

    expect(() => from.transfer(200, from)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const account = getBankAccount(100);

    account.deposit(200);
    expect(account.getBalance()).toBe(300);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(100);

    account.withdraw(20);
    expect(account.getBalance()).toBe(80);
  });

  test('should transfer money', () => {
    const from = getBankAccount(100);
    const to = getBankAccount(100);

    from.transfer(20, to);
    expect(from.getBalance()).toBe(80);
    expect(to.getBalance()).toBe(120);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(100);

    (random as jest.Mock).mockReturnValueOnce(50);
    (random as jest.Mock).mockReturnValueOnce(1);

    const balance = await account.fetchBalance();
    expect(balance).toBe(50);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(100);

    (random as jest.Mock).mockReturnValueOnce(50);
    (random as jest.Mock).mockReturnValueOnce(1);

    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(50);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(100);

    (random as jest.Mock).mockReturnValueOnce(50);
    (random as jest.Mock).mockReturnValueOnce(0);

    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
