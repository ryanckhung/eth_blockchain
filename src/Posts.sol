pragma solidity ^0.5.1;

contract Posts{
    
    struct Message{
        string sender;
        string receiver;
        string msg;
        uint timestamp;
    }
    
    mapping(bytes32 => Message) messages;
    bytes32[] public messageBoxUUID;
    
    function setMessage(bytes32 _uuid, string memory _sender, string memory _receiver, string memory _msg, uint _timestamp) public{
        messages[_uuid].sender = _sender;
        messages[_uuid].receiver = _receiver;
        messages[_uuid].msg = _msg;
        messages[_uuid].timestamp = _timestamp;
        
        messageBoxUUID.push(_uuid);
    }
    
    function getMessageBoxUUID() view public returns(bytes32[] memory){
        return messageBoxUUID;
    }
    
    function countMessages() view public returns(uint){
        return messageBoxUUID.length;
    }
    
    function getMessage(bytes32 _uuid) view public returns(string memory, string memory, string memory, uint){
        return (messages[_uuid].sender, messages[_uuid].receiver, messages[_uuid].msg, messages[_uuid].timestamp);
    }
    
}