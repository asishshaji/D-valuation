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
        selectedAccout: 0x0,
        paper: null,
        ipfsHash: "",
        loaderShow: false,
        studentAddress: 0x0,
        college: null
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


            this.setState({ web3, accounts, contract: instance, selectedAccout: accounts[0], college: accounts[4] });

        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };



    submitPaper = async () => {
        await this.state.contract.methods.addPaper(this.state.studentAddress, this.state.ipfsHash).send({ from: this.state.college, gas:3000000 }, (err, hash) => console.log(hash, err));
    }


    sendToIpfs = async (event) => {
        this.setState({ loaderShow: true })
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => this.convertToBuffer(reader)
    }

    convertToBuffer = async (reader) => {
        //file is converted to a buffer for upload to IPFS
        const buffer = await Buffer.from(reader.result);
        this.setState({ paper: buffer });

        await ipfs.add(this.state.paper, (err, hash) => {
            this.setState({ ipfsHash: hash[0].path })
            this.setState({ loaderShow: false })
            alert(`Hash is ${hash[0].path}`)
        })

    };

    render() {
        if (!this.state.web3) {
            return <div>Loading Web3</div>;
        }
        return (
            <div>
                <Navbar bg="light" variant="light">
                    <Navbar.Brand href="#home">
                        Colleges
                    </Navbar.Brand>
                </Navbar>

                <Container style={{ marginTop: "2rem", padding: '2rem' }}>

                    {/* Add papers */}
                    <Card style={{ marginTop: '1rem' }}>
                        <Card.Body>
                            <Card.Title>Add Paper</Card.Title>
                            <Form.Group>
                                <Form.File
                                    id="answer-paper"
                                    label="Answer paper"
                                    custom
                                    onChange={(event) => this.sendToIpfs(event)}
                                />
                                <Form.Label>Student Address</Form.Label>
                                <Form.Control type="text" size="sm" placeholder="Wallet address" onChange={(val) => this.setState({ studentAddress: val.target.value })} />
                            </Form.Group>
                            <Button variant="outline-primary" size="sm" onClick={() => this.submitPaper()}>
                                {this.state.loaderShow ? <Spinner
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    aria-hidden="false"
                                /> : null}
                                Add</Button>
                        </Card.Body>
                    </Card>

                </Container>
            </div>
        );
    }
}

export default App;
