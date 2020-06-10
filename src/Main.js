import React, { Component } from 'react'
import web3 from './web3';
import { abi, address } from './contract';
import './MainStyle.scss';


function generateUUID() {
    var uuid = require('uuid');
    return "0x" + (uuid.v1() + uuid.v1()).replace(/-/g, '');
}


export default class Main extends Component {

    constructor(props, context) {
        super(props, context);
        this.contract = new web3.eth.Contract(abi, address);

        this.timer = null;

        this.accountOwnerAddress = null;

        this.contractAPI = {
            getMessageCount: () => this.contract.methods.countMessages().call(),
            getMessage: (uuid) => this.contract.methods.getMessage(uuid).call(),
            getMessageBoxUUID: () => this.contract.methods.getMessageBoxUUID().call(),
            setMessage: (uuid, sender, receiver, msessage, timestamp) => this.contract.methods.setMessage(uuid, sender, receiver, msessage, timestamp).send({
                from: this.accountOwnerAddress
            })
        }

        this.state = {messageBoxUUIDList:[], messageDetails:{}}
    }


    componentWillUnmount() {
        clearInterval(this.timer)
    }
    

    componentDidMount() {  
        // get the current account address
        web3.eth.getAccounts().then(item=>{
            this.accountOwnerAddress = item[0];
        })

        // initial load
        this.contractAPI.getMessageBoxUUID().then((item) => {
            this.setState({messageBoxUUIDList:item})
        })       
        // load every 10 seconds
        this.timer = setInterval(()=>{
            this.contractAPI.getMessageBoxUUID().then((item) => {
                this.setState({messageBoxUUIDList:item})
            })  
        },10000)
    }



    getMessageDetails = (uuid) => {
        this.contractAPI.getMessage(uuid).then((item)=>{
            this.setState({messageDetails: item})
        })
    }


    sendToBlockchain = () =>{
        var sender = document.getElementById("sender").value;
        var receiver = document.getElementById("receiver").value;
        var message = document.getElementById("message").value;
        var uuid = generateUUID();

        
        this.contractAPI.setMessage(uuid, sender, receiver, message, Date.now())
        document.getElementById("sender").value = null;
        document.getElementById("receiver").value = null;
        document.getElementById("message").value = null;
    }
    
    render() {

        const msgIDList = this.state.messageBoxUUIDList.map((item) => {
            return(<div key={item} style={{cursor:"pointer"}} onClick={()=>{this.getMessageDetails(item)}}>{item}</div>)
        })

        return (
            <div>
                <section className="message-box-header">
                    <div>It's an Ethereum Blockchain DAPP Demo.</div>
                    <div>Please notes that the Web3, Metamask stuff may update frequently.</div>
                    <div>This code is for your reference. It may not up to date and cause errror.</div>
                    <div>Please install the Metamask, connected to the Ropsten Test Network and with ETH inside your wallet.</div>
                </section>

                <section className="message-box-body">
                    <section>
                        <div id="sub-title1">Write Message to the Contract</div>
                        <div id="sub-title2">It takes time to write the message into the blockchain.</div>
                        <div id="sub-title2">Once it's stored into the blockchain.</div>
                        <div id="sub-title2">It will be shown on the Message ID List (on the right)</div>
                        <div id="message-input">
                            <div><span style={{flex:1}}>Form: </span><input id="sender" style={{flex:3}} /></div>
                            <div><span style={{flex:1}}>To: </span><input id="receiver"  style={{flex:3}} /></div>
                            <div><span style={{flex:1}}>Message:</span><textarea id="message" style={{flex:3}} rows="4" /></div>
                            <div><button onClick={()=>{this.sendToBlockchain()}}>Send to Blockchain</button></div>
                        </div>
                    </section>

                    <section>
                        <div id="sub-title1">List the Contract Message ID</div>
                        <div id="sub-title2">The list will auto-reaload every 10 seconds</div>
                        <div id="sub-title2">Click the following message ID to load the message details.</div>
                        <div id="msessage-id">{msgIDList}</div>
                    </section>

                    <section>
                        <div id="sub-title1">Message Details</div>
                        <div id="message-details">
                            <div><span>From:</span> {this.state.messageDetails[0]}</div>
                            <div><span>To:</span> {this.state.messageDetails[1]}</div>
                            <div><span>Date:</span> {this.state.messageDetails[3]}</div>
                            <div><span>Message:</span> {this.state.messageDetails[2]}</div>
                        </div>
                    </section>
                </section>
            </div>
        )
    }
}
