pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Roles.sol";


contract Paper is Ownable {
    struct Valuator {
        address payable valuator;
        bool isValuated;
        uint256 marks;
    }
    struct Item {
        uint256 pid;
        string ipfsHash;
        address college;
        address payable student;
        Valuator val1;
        Valuator val2;
        address payable reviewer;
        uint256 reviewermarks;
        bool raiseDispute;
        bool acceptedValidation;
        State state;
    }

    enum State {SUBMITTED, VALUATED, ACCEPTED, REVIEWING}

    uint256 public paperCount = 0;
    uint256 public valuatorCount = 0;

    Roles.Role private colleges;
    Roles.Role private valuators;

    mapping(uint256 => Item) public papers;

    mapping(uint256 => address payable) public valuatorsAddresses;

    modifier onlyCollege() {
        require(Roles.has(colleges, msg.sender));
        _;
    }

    modifier onlyValuator(uint256 _paperId) {
        require(
            papers[_paperId].val1.valuator == msg.sender ||
                papers[_paperId].val2.valuator == msg.sender
        );
        _;
    }

    modifier onlyStudent(uint256 _paperId) {
        require(papers[_paperId].student == msg.sender);
        _;
    }

    modifier onlyReviewer(uint256 _paperId) {
        require(papers[_paperId].reviewer == msg.sender);
        _;
    }

    event PaperforValuator(uint256 id, string ipfs);
    event paperSubmitted(uint256 _paperId);

    constructor() public {}

    // KTU

    function addColleges(address _collegeAddress) public onlyOwner {
        Roles.add(colleges, _collegeAddress);
    }

    function addValuators(address payable _valuatorAddress) public onlyOwner {
        Roles.add(valuators, _valuatorAddress);
        valuatorsAddresses[valuatorCount] = _valuatorAddress;
        valuatorCount++;
    }

    // KTU END

    // College
    function addPaper(address payable _studentAddress, string memory _ipfsHash)
        public
        onlyCollege
    {
        Valuator memory val1 = Valuator(address(0), false, 0);
        Valuator memory val2 = Valuator(address(0), false, 0);

        Item memory paper = Item(
            paperCount,
            _ipfsHash,
            msg.sender,
            _studentAddress,
            val1,
            val2,
            address(0),
            0,
            false,
            false,
            State.SUBMITTED
        );

        // Randomly select valuators
        uint256 randomnumber = uint256(
            keccak256(abi.encodePacked(now, msg.sender))
        ) % valuatorCount;

        paper.val1.valuator = valuatorsAddresses[randomnumber];
        paper.val2.valuator = valuatorsAddresses[randomnumber + 1];

        papers[paperCount] = paper;
        paperCount++;
        emit paperSubmitted(paper.pid);
    }

    // College END

    // valuator

    function addMarks(uint256 _paperId, uint256 marks)
        public
        onlyValuator(_paperId)
    {
        Item memory paper = papers[_paperId];

        if (paper.val1.valuator == msg.sender) {
            paper.val1.marks = marks;
            paper.val1.isValuated = true;
        } else {
            paper.val2.marks = marks;
            paper.val2.isValuated = true;
        }
        paper.state = State.VALUATED;
        papers[_paperId] = paper;
    }

    function getAssignedPapers() public {
        require(Roles.has(valuators, msg.sender));

        for (uint256 i = 0; i <= paperCount; i++) {
            if (
                papers[i].val1.valuator == msg.sender ||
                papers[i].val1.valuator == msg.sender
            ) {
                uint256 paper_id = papers[i].pid;
                string memory ipfsHash = papers[i].ipfsHash;
                emit PaperforValuator(paper_id, ipfsHash);
            }
        }
    }

    function reviewerSubmit(uint256 _paperId, uint256 _marks)
        public
        onlyReviewer(_paperId)
    {
        papers[_paperId].reviewermarks = _marks;
        papers[_paperId].raiseDispute = false;
    }

    //   valuator end

    // For student

    function getResultForStudent(uint256 _paperId)
        public
        view
        onlyStudent(_paperId)
        returns (uint256, uint256, uint256)
    {
        Item memory paper = papers[_paperId];
        return (paper.val1.marks, paper.val2.marks, paper.reviewermarks);
    }

    function getStateForStudent(uint256 _id)
        public
        view
        onlyStudent(_id)
        returns (uint256)
    {
        Item memory paper = papers[_id];
        if (paper.state == State.SUBMITTED) {
            return 0;
        } else if (paper.state == State.VALUATED) {
            return 1;
        } else if (paper.state == State.ACCEPTED) {
            return 2;
        } else {
            return 3;
        }
    }

    function getPaperForStudent(uint256 _paperId)
        public
        view
        onlyStudent(_paperId)
        returns (string memory)
    {
        Item memory paper = papers[_paperId];
        return (paper.ipfsHash);
    }

    function studentRaiseDispute(uint256 _paperId)
        public
        onlyStudent(_paperId)
    {
        uint256 randomnumber = uint256(
            keccak256(abi.encodePacked(now, msg.sender))
        ) % valuatorCount;
        papers[_paperId].reviewer = valuatorsAddresses[randomnumber];
        papers[_paperId].raiseDispute = true;
        papers[_paperId].state = State.REVIEWING;
    }

    function acceptValidation(uint256 _paperId) public onlyStudent(_paperId) {
        papers[_paperId].acceptedValidation = true;
        if (papers[_paperId].raiseDispute) {
            papers[_paperId].reviewer.transfer(4);
        } else {
            papers[_paperId].val1.valuator.transfer(2);
            papers[_paperId].val2.valuator.transfer(2);
        }
        papers[_paperId].state = State.ACCEPTED;
    }

    //   Student END.
}
