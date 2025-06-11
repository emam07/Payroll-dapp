// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Payroll {
    address public owner;
    // Mapping from employee address to their set salary amount
    mapping(address => uint256) public employees;
    // Mapping to track if salary has been released for a period (simple check)
    // For a real app, this would need more sophisticated period tracking
    mapping(address => bool) public salaryReleasedThisPeriod; 

    event EmployeeAdded(address indexed employee, uint256 salary);
    event SalaryReleased(address indexed employee, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    /**
     * @dev Adds or updates an employee's salary.
     * @param _employee The address of the employee.
     * @param _salary The salary amount in Wei.
     */
    function addEmployee(address _employee, uint256 _salary) public onlyOwner {
        require(_employee != address(0), "Invalid employee address");
        require(_salary > 0, "Salary must be greater than zero");
        employees[_employee] = _salary;
        salaryReleasedThisPeriod[_employee] = false; // Reset status when salary is updated
        emit EmployeeAdded(_employee, _salary);
    }

    /**
     * @dev Releases salary to an employee.
     * Requires the contract to hold sufficient Ether.
     * For simplicity, assumes a single payment per employee per "period" defined by salaryReleasedThisPeriod.
     */
    function releaseSalary(address _employee) public onlyOwner {
        require(_employee != address(0), "Invalid employee address");
        require(employees[_employee] > 0, "Employee not registered or salary is zero");
        require(salaryReleasedThisPeriod[_employee] == false, "Salary already released for this period");
        
        uint256 amountToRelease = employees[_employee];
        require(address(this).balance >= amountToRelease, "Contract balance insufficient");

        salaryReleasedThisPeriod[_employee] = true; // Mark as released for this period

        (bool success, ) = _employee.call{value: amountToRelease}("");
        require(success, "Failed to send Ether to employee");

        emit SalaryReleased(_employee, amountToRelease);
    }
    
    // Function to fund the contract (so it has Ether to pay salaries)
    receive() external payable {}

    // Function to reset the 'salaryReleasedThisPeriod' status for all employees
    // In a real app, this would be triggered monthly/bi-weekly.
    function resetSalaryPeriod() public onlyOwner {
        // This is a simplified way. In a real app, you'd iterate registered employees
        // or have a more complex system to track which employees were paid.
        // For a 1-day dApp, we can manually reset specific employee's status or imply it.
        // For now, let's keep it simple and assume a fresh state or manual reset per employee.
        // A better approach would be to track 'lastPaidTimestamp' per employee.
    }

    // A simple public view to see an employee's set salary
    function getEmployeeSalary(address _employee) public view returns (uint256) {
        return employees[_employee];
    }
}