const readline = require('readline');
const { AccountSystem } = require('./index');

// Mock readline and console
jest.mock('readline');
jest.mock('console', () => ({
  log: jest.fn(),
}));

describe('AccountSystem', () => {
  let app;
  let mockRl;
  let consoleLogSpy;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock readline.createInterface
    mockRl = {
      question: jest.fn(),
      close: jest.fn(),
    };
    readline.createInterface.mockReturnValue(mockRl);

    // Spy on console.log
    consoleLogSpy = jest.spyOn(console, 'log');

    // Create app instance
    app = new AccountSystem();
  });

  describe('TC001: View Initial Account Balance', () => {
    test('should display initial balance of 1000.00', () => {
      app.viewBalance();

      expect(consoleLogSpy).toHaveBeenCalledWith('Current balance: 001000.00');
    });
  });

  describe('TC002: Credit Account with Positive Amount', () => {
    test('should add positive amount to balance', () => {
      // Mock user input
      mockRl.question.mockImplementation((query, callback) => {
        callback('500.00');
      });

      // Call creditAccount and simulate the flow
      app.creditAccount();

      // Since it's async, we need to wait or check after
      // But since it calls callback immediately, balance should be updated
      expect(app.balance).toBe(1500.00);
      expect(consoleLogSpy).toHaveBeenCalledWith('Amount credited. New balance: 001500.00');
    });
  });

  describe('TC003: Debit Account with Sufficient Funds', () => {
    test('should subtract amount when sufficient funds', () => {
      app.balance = 1500.00; // Set initial balance

      mockRl.question.mockImplementation((query, callback) => {
        callback('300.00');
      });

      app.debitAccount();

      expect(app.balance).toBe(1200.00);
      expect(consoleLogSpy).toHaveBeenCalledWith('Amount debited. New balance: 001200.00');
    });
  });

  describe('TC004: Debit Account with Insufficient Funds', () => {
    test('should show error when insufficient funds', () => {
      mockRl.question.mockImplementation((query, callback) => {
        callback('1500.00');
      });

      app.debitAccount();

      expect(app.balance).toBe(1000.00); // Unchanged
      expect(consoleLogSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
    });
  });

  describe('TC005: Multiple Credit Operations', () => {
    test('should accumulate multiple credits', () => {
      // First credit
      mockRl.question.mockImplementationOnce((query, callback) => {
        callback('100.00');
      });
      app.creditAccount();

      // Second credit
      mockRl.question.mockImplementationOnce((query, callback) => {
        callback('200.00');
      });
      app.creditAccount();

      expect(app.balance).toBe(1300.00);
    });
  });

  describe('TC006: Multiple Debit Operations', () => {
    test('should accumulate multiple debits', () => {
      app.balance = 1500.00;

      // First debit
      mockRl.question.mockImplementationOnce((query, callback) => {
        callback('100.00');
      });
      app.debitAccount();

      // Second debit
      mockRl.question.mockImplementationOnce((query, callback) => {
        callback('200.00');
      });
      app.debitAccount();

      expect(app.balance).toBe(1200.00);
    });
  });

  describe('TC007: Credit and Debit Sequence', () => {
    test('should handle mixed operations correctly', () => {
      // Credit
      mockRl.question.mockImplementationOnce((query, callback) => {
        callback('500.00');
      });
      app.creditAccount();

      // Debit
      mockRl.question.mockImplementationOnce((query, callback) => {
        callback('200.00');
      });
      app.debitAccount();

      expect(app.balance).toBe(1300.00);
    });
  });

  describe('TC008: Invalid Menu Choice', () => {
    test('should handle invalid choice gracefully', () => {
      // Mock showMenu to avoid infinite loop
      app.showMenu = jest.fn();

      app.handleChoice('5');

      expect(consoleLogSpy).toHaveBeenCalledWith('Invalid choice, please select 1-4.');
      expect(app.showMenu).toHaveBeenCalled();
    });
  });

  describe('TC009: Zero Amount Credit', () => {
    test('should not change balance for zero credit', () => {
      mockRl.question.mockImplementation((query, callback) => {
        callback('0.00');
      });

      app.creditAccount();

      expect(app.balance).toBe(1000.00);
    });
  });

  describe('TC010: Zero Amount Debit', () => {
    test('should not change balance for zero debit', () => {
      mockRl.question.mockImplementation((query, callback) => {
        callback('0.00');
      });

      app.debitAccount();

      expect(app.balance).toBe(1000.00);
    });
  });

  describe('TC011: Negative Amount Credit', () => {
    test('should reject negative credit', () => {
      mockRl.question.mockImplementation((query, callback) => {
        callback('-100.00');
      });

      app.creditAccount();

      expect(app.balance).toBe(1000.00);
      expect(consoleLogSpy).toHaveBeenCalledWith('Invalid amount. Please enter a positive number.');
    });
  });

  describe('TC012: Negative Amount Debit', () => {
    test('should reject negative debit', () => {
      mockRl.question.mockImplementation((query, callback) => {
        callback('-100.00');
      });

      app.debitAccount();

      expect(app.balance).toBe(1000.00);
      expect(consoleLogSpy).toHaveBeenCalledWith('Invalid amount. Please enter a positive number.');
    });
  });

  describe('TC013: Large Amount Credit', () => {
    test('should handle large credit amounts', () => {
      mockRl.question.mockImplementation((query, callback) => {
        callback('999999.99');
      });

      app.creditAccount();

      expect(app.balance).toBe(1000999.99);
    });
  });

  describe('TC014: Large Amount Debit', () => {
    test('should handle large debit with insufficient funds', () => {
      mockRl.question.mockImplementation((query, callback) => {
        callback('999999.99');
      });

      app.debitAccount();

      expect(app.balance).toBe(1000.00);
      expect(consoleLogSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
    });
  });

  describe('TC015: Balance Persistence Across Sessions', () => {
    test('should reset balance on new instance', () => {
      const app1 = new AccountSystem();
      app1.balance = 1500.00;

      const app2 = new AccountSystem();
      expect(app2.balance).toBe(1000.00);
    });
  });

  describe('TC016: Exit Application', () => {
    test('should close readline interface on exit', () => {
      app.handleChoice('4');

      expect(mockRl.close).toHaveBeenCalled();
    });
  });

  describe('TC017: Menu Loop Continuation', () => {
    test('should continue showing menu after operations', () => {
      // This is more of an integration test, but we can test that showMenu is called
      app.showMenu = jest.fn();
      app.handleChoice('1'); // View balance

      expect(app.showMenu).toHaveBeenCalled();
    });
  });
});