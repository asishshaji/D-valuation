pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Roles.sol";

contract Paper is Ownable{
    
    struct Item {
        uint pid;
        string ipfsHash;
        address college;
        address payable student;
        address payable valuator1;
        address payable valuator2;
        address payable reviewer;
        bool isValuated1;
        bool isValuated2;
        uint marks1;
        uint marks2;
        uint marks3;
        bool raiseDispute;
        bool acceptedValidation;
    }
    
    
    uint public paperCount = 0;
    uint public valuatorCount = 0;
    
    
    Roles.Role private colleges;
    Roles.Role private valuators;
    
    mapping(uint => Item) public papers;
    
    mapping(uint => address payable) public valuatorsAddresses;
    
    
    modifier onlyCollege(){
        require(Roles.has(colleges,msg.sender));
        _;
    }
    
    modifier onlyValuator(uint _paperId){
        require(Roles.has(valuators,msg.sender) && (papers[_paperId].valuator1 == msg.sender || papers[_paperId].valuator2 == msg.sender));
        _;
    }
    
    modifier onlyStudent(uint _paperId){
        require(papers[_paperId].student == msg.sender);
        _;
    }
    
    modifier onlyReviewer(uint _paperId){
        require(papers[_paperId].reviewer == msg.sender);
        _;
    }
    
    
    event paperSubmitted(uint _paperId);
    
    
    constructor() public {
    
    }
    
    function addColleges(address _collegeAddress) public onlyOwner {
        Roles.add(colleges, _collegeAddress);
    }
    
    function addValuators(address payable _valuatorAddress) public onlyOwner {
        Roles.add(valuators,_valuatorAddress);
        valuatorsAddresses[valuatorCount] = _valuatorAddress;
        valuatorCount++;
    }
    
    
    function addPaper(address payable _studentAddress, string memory _ipfsHash) public onlyCollege {
        Item memory paper = Item(paperCount, _ipfsHash, msg.sender, _studentAddress,address(0),address(0),address(0),false,false,0,0,0,false,false);
        
        // Randomly select valuators 
        uint randomnumber = uint(keccak256(abi.encodePacked(now, msg.sender))) % valuatorCount;
        
        paper.valuator1 = valuatorsAddresses[randomnumber];
        paper.valuator2 = valuatorsAddresses[randomnumber+1];
      
        
        papers[paperCount] = paper;
        paperCount++;
        emit paperSubmitted(paperCount);
    }
    
    
    function addMarks(uint _paperId, uint marks) public {
        if(papers[_paperId].valuator1 == msg.sender){
            papers[_paperId].marks1 = marks;
            papers[_paperId].isValuated1 = true;
        }else{
            papers[_paperId].marks2 = marks;
            papers[_paperId].isValuated2 = true;
        }
    }
    
    
    
  function reviewerSubmit(uint _paperId, uint _marks) public onlyReviewer(_paperId){
      papers[_paperId].marks3 = _marks;
      papers[_paperId].raiseDispute = false;
  }
    
   function getResultForStudent(uint _paperId) public view onlyStudent(_paperId) returns(uint,uint,uint,address,address,address){
       Item memory paper = papers[_paperId];
       return (paper.marks1, paper.marks2,paper.marks3,paper.valuator1,paper.valuator2,paper.reviewer);
   }
   
   function studentRaiseDispute(uint _paperId) public onlyStudent(_paperId) {
       uint randomnumber = uint(keccak256(abi.encodePacked(now, msg.sender))) % valuatorCount;
       papers[_paperId].reviewer = valuatorsAddresses[randomnumber];
       papers[_paperId].raiseDispute = true;
   }
    
   function acceptValidation(uint _paperId) public onlyStudent(_paperId) {
       
      papers[_paperId].acceptedValidation = true;
      if(papers[_paperId].raiseDispute){
          papers[_paperId].reviewer.transfer(4);
      }
      else{
          papers[_paperId].valuator1.transfer(2);
          papers[_paperId].valuator2.transfer(2);
      }
   }
    
    
    
}