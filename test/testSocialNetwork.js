const Paper = artifacts.require('Paper');


contract("Paper", accounts => {
    let contract;

    const university = accounts[0];

    const college1 = accounts[1];
    const college2 = accounts[2];

    const valuator1 = accounts[3];
    const valuator2 = accounts[4];
    const valuator3 = accounts[5];
    const valuator4 = accounts[6];

    const student =  accounts[7];


    before(async () => {
        contract = await Paper.deployed();
    });

    describe('tests', async () => {
        it("Owner is university", async () => {
            const owner = await contract.owner();
            assert.equal(owner, university);
        });

        it("College added", async () => {
            const result1 = await contract.addColleges(college1);
            const result2 = await contract.addColleges(college2);
        });

        it("Valutors added", async () => {
            const result1 = await contract.addValuators(valuator1);
            const result2 = await contract.addValuators(valuator2);
            const result3 = await contract.addValuators(valuator3);
            const result4 = await contract.addValuators(valuator4);

            const result = await contract.valuatorCount();

            assert.equal(result, 4);

        });
        
        it("Paper added", async () => {
            const result = await contract.addPaper(student, "ASFSAF",{from:college1});
            const info = await contract.papers(0);
        });

    
        it("Marks added", async () => {
            const result = await contract.addMarks(0,99,{from:valuator3});
        });

        it("Dispute Raised", async () => {
            const result = await contract.getResultForStudent(0,{from:student});
        });


        it("Result for student", async () => {
            const result = await contract.getResultForStudent(0,{from:student});
            console.log(result)
        });

        

    })
});
