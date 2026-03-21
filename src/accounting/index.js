const readline = require('readline');

class AccountSystem {
    constructor() {
        this.balance = 1000.00; // Initial balance matching COBOL
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    // Data layer - equivalent to data.cob
    readBalance() {
        return this.balance;
    }

    writeBalance(newBalance) {
        this.balance = newBalance;
    }

    // Operations layer - equivalent to operations.cob
    viewBalance() {
        const balance = this.readBalance();
        console.log(`Current balance: ${balance.toFixed(2).padStart(8, '0')}`);
    }

    creditAccount() {
        this.rl.question('Enter credit amount: ', (amountStr) => {
            const amount = parseFloat(amountStr);
            if (isNaN(amount) || amount < 0) {
                console.log('Invalid amount. Please enter a positive number.');
                this.showMenu();
                return;
            }

            const currentBalance = this.readBalance();
            const newBalance = currentBalance + amount;
            this.writeBalance(newBalance);
            console.log(`Amount credited. New balance: ${newBalance.toFixed(2).padStart(8, '0')}`);
            this.showMenu();
        });
    }

    debitAccount() {
        this.rl.question('Enter debit amount: ', (amountStr) => {
            const amount = parseFloat(amountStr);
            if (isNaN(amount) || amount < 0) {
                console.log('Invalid amount. Please enter a positive number.');
                this.showMenu();
                return;
            }

            const currentBalance = this.readBalance();
            if (currentBalance >= amount) {
                const newBalance = currentBalance - amount;
                this.writeBalance(newBalance);
                console.log(`Amount debited. New balance: ${newBalance.toFixed(2).padStart(8, '0')}`);
            } else {
                console.log('Insufficient funds for this debit.');
            }
            this.showMenu();
        });
    }

    // Main layer - equivalent to main.cob
    showMenu() {
        console.log('--------------------------------');
        console.log('Account Management System');
        console.log('1. View Balance');
        console.log('2. Credit Account');
        console.log('3. Debit Account');
        console.log('4. Exit');
        console.log('--------------------------------');
        this.rl.question('Enter your choice (1-4): ', (choice) => {
            this.handleChoice(choice);
        });
    }

    handleChoice(choice) {
        switch (choice) {
            case '1':
                this.viewBalance();
                break;
            case '2':
                this.creditAccount();
                break;
            case '3':
                this.debitAccount();
                break;
            case '4':
                console.log('Exiting the program. Goodbye!');
                this.rl.close();
                return;
            default:
                console.log('Invalid choice, please select 1-4.');
                break;
        }
        if (choice !== '4') {
            this.showMenu();
        }
    }

    start() {
        console.log('Starting Account Management System...');
        this.showMenu();
    }
}

// Export for testing
module.exports = { AccountSystem };

// Run the application if this file is executed directly
if (require.main === module) {
    const app = new AccountSystem();
    app.start();
}