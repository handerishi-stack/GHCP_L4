# Test Plan for COBOL Student Account Management System

This test plan covers the business logic and functionality of the COBOL-based student account management system. It includes test cases for all major operations: viewing balance, crediting accounts, debiting accounts, and system behavior validation. The plan is designed to validate business requirements and will serve as a foundation for creating unit and integration tests in the Node.js transformation.

## Test Cases

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC001 | View Initial Account Balance | Application is started with default balance | 1. Start the application<br>2. Select option 1 (View Balance) | Display shows "Current balance: 001000.00" |  |  | Initial balance should be $1000.00 |
| TC002 | Credit Account with Positive Amount | Application is running with initial balance | 1. Select option 2 (Credit Account)<br>2. Enter amount "500.00"<br>3. Select option 1 to view balance | Display shows "Amount credited. New balance: 001500.00" then "Current balance: 001500.00" |  |  | Credit operation adds to balance |
| TC003 | Debit Account with Sufficient Funds | Account has sufficient balance (e.g., $1500.00 from TC002) | 1. Select option 3 (Debit Account)<br>2. Enter amount "300.00"<br>3. Select option 1 to view balance | Display shows "Amount debited. New balance: 001200.00" then "Current balance: 001200.00" |  |  | Debit operation subtracts from balance when funds available |
| TC004 | Debit Account with Insufficient Funds | Account has balance of $1000.00 | 1. Select option 3 (Debit Account)<br>2. Enter amount "1500.00" | Display shows "Insufficient funds for this debit." |  |  | System prevents overdraft |
| TC005 | Multiple Credit Operations | Application is running | 1. Select option 2, enter "100.00"<br>2. Select option 2, enter "200.00"<br>3. Select option 1 to view balance | Balance shows cumulative total: 001300.00 |  |  | Multiple credits accumulate correctly |
| TC006 | Multiple Debit Operations | Account has sufficient balance | 1. Select option 3, enter "100.00"<br>2. Select option 3, enter "200.00"<br>3. Select option 1 to view balance | Balance shows cumulative deduction |  |  | Multiple debits deduct correctly |
| TC007 | Credit and Debit Sequence | Application is running | 1. Select option 2, enter "500.00"<br>2. Select option 3, enter "200.00"<br>3. Select option 1 to view balance | Balance reflects net change (+500 -200 = +300) |  |  | Mixed operations maintain correct balance |
| TC008 | Invalid Menu Choice | Application is running | 1. Enter invalid choice "5" | Display shows "Invalid choice, please select 1-4." and redisplays menu |  |  | System handles invalid input gracefully |
| TC009 | Zero Amount Credit | Application is running | 1. Select option 2<br>2. Enter amount "0.00"<br>3. View balance | Balance remains unchanged |  |  | Zero credit should not affect balance |
| TC010 | Zero Amount Debit | Application is running | 1. Select option 3<br>2. Enter amount "0.00"<br>3. View balance | Balance remains unchanged |  |  | Zero debit should not affect balance |
| TC011 | Negative Amount Credit | Application is running | 1. Select option 2<br>2. Enter amount "-100.00" | Balance increases by 100.00 (COBOL may handle negative as positive) |  |  | Verify how system handles negative inputs |
| TC012 | Negative Amount Debit | Application is running | 1. Select option 3<br>2. Enter amount "-100.00" | Balance decreases by 100.00 or error |  |  | Verify negative debit behavior |
| TC013 | Large Amount Credit | Application is running | 1. Select option 2<br>2. Enter large amount "999999.99" | Balance updates to new large value |  |  | Test balance field limits |
| TC014 | Large Amount Debit | Account has sufficient balance | 1. Select option 3<br>2. Enter large amount exceeding balance | Shows insufficient funds error |  |  | Large debit with insufficient funds |
| TC015 | Balance Persistence Across Sessions | Application restarted | 1. Perform credit/debit operations<br>2. Exit and restart application<br>3. View balance | Balance resets to initial $1000.00 (no persistence between runs) |  |  | Current implementation has no file persistence |
| TC016 | Exit Application | Application is running | 1. Select option 4 (Exit) | Application terminates with "Exiting the program. Goodbye!" |  |  | Clean application exit |
| TC017 | Menu Loop Continuation | Application is running | 1. Perform any valid operation<br>2. Observe menu redisplays | Menu continues to display until exit is chosen |  |  | Application runs in loop until exit |