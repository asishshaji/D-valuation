import "./App.css";

import React, { Component } from "react";

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import SocialNetwork from "./contracts/SocialNetwork.json";
import getWeb3 from "./getWeb3";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, selectedAccount: 0x0, postCounter: 0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SocialNetwork.networks[networkId];
      const instance = new web3.eth.Contract(
        SocialNetwork.abi,
        deployedNetwork && deployedNetwork.address,
      );

      console.log(accounts)

      const count = await instance.methods.postCounter().call()
      console.log(count)



      const result = await instance.methods.createPost("First", "lola").send({ from: accounts[0]});

      // const post = await instance.methods.idToPost(0).call()
      // console.log(post)

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, selectedAccount: accounts[0]}, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3</div>;
    }
    return (
      <div>
        <Navbar bg="light" variant="light">
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="https://steemitimages.com/DQmbXYhjAsE6o82UCA6rUySRiiHPCKhpge9zKZMQ9MscTUB/DTube%20Logo%20BLACK.png"
              width="80"
              height="30"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Signed in as: {this.state.selectedAccount}
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>

        <Container style={{ marginTop: "2rem" }}>
          <Card>
            <Card.Body>
              <Card.Title>Special title </Card.Title>
              <video src="https://ipfs.io/ipfs/QmeMrTDkJhikJkqb2bRiS2uhBGJCmq67BPLbm4Tjvibopq" height="200" controls autoPlay={false} />
              <Card.Text>
                With supporting text below as a natural lead-in to additional content.
               </Card.Text>
              <Button variant="outline-primary">Tip</Button>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }
}

export default App;
