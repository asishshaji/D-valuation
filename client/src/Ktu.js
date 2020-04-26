import "./App.css";

import React, { Component } from "react";

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Navbar from 'react-bootstrap/Navbar'
import Paper from "./contracts/Paper.json";
import Spinner from 'react-bootstrap/Spinner'
import getWeb3 from "./getWeb3";
import ipfs from './ipfs';

class App extends Component {
    state = {
        storageValue: 0,
        web3: null,
        accounts: null,
        contract: null,
        collegeAddress: 0x0,
        valuatorAddress: 0x0,
        selectedAccout: 0x0,
    };

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();



            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Paper.networks[networkId];
            const instance = new web3.eth.Contract(
                Paper.abi,
                deployedNetwork && deployedNetwork.address,
            );


            this.setState({ web3, accounts, contract: instance, selectedAccout: accounts[0] });

        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    submitCollege = async () => {
        await this.state.contract.methods.addColleges(this.state.collegeAddress).send({ from: this.state.selectedAccout }, (err, hash) => console.log(hash, err));
    }

    submitValidators = async () => {
        await this.state.contract.methods.addValuators(this.state.valuatorAddress).send({ from: this.state.selectedAccout }, (err, hash) => console.log(hash, err));
    }




    render() {
        if (!this.state.web3) {
            return <div>Loading Web3</div>;
        }
        return (
            <div>
                <Navbar bg="light" variant="light">
                    <Navbar.Brand href="#home">
                        KTU
          </Navbar.Brand>
                </Navbar>

                <Container style={{ marginTop: "2rem", padding: '2rem' }}>
                    {/* add colleges */}
                    <Card>
                        <Card.Body>
                            <Card.Title>Add Colleges</Card.Title>
                            <Form.Group>
                                <Form.Label>College Address</Form.Label>
                                <Form.Control type="text" size="sm" placeholder="Wallet address" onChange={(val) => this.setState({ collegeAddress: val.target.value })} />
                            </Form.Group>
                            <Button variant="outline-primary" size="sm" onClick={() => this.submitCollege()}>Add</Button>
                        </Card.Body>
                    </Card>

                    {/* add valuators */}
                    <Card style={{ marginTop: '1rem' }}>
                        <Card.Body>
                            <Card.Title>Add Valuators</Card.Title>
                            <Form.Group>
                                <Form.Label>Valuator Address</Form.Label>
                                <Form.Control type="text" size="sm" placeholder="Wallet address" onChange={(val) => this.setState({ valuatorAddress: val.target.value })} />
                            </Form.Group>
                            <Button variant="outline-primary" size="sm" onClick={() => this.submitValidators()}>Add</Button>
                        </Card.Body>
                    </Card>



                </Container>
            </div>
        );
    }
}

export default App;
