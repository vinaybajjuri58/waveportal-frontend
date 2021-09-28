import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have a metamask");
        return;
      } else {
        console.log("We have an ethereum object", ethereum);
      }
      const accounts = await ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an Authorised account :", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorised account found");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const connectButtonHandler = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get Metamask! ");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  const wave = () => {};

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          <span role="img" aria-label="wave">
            👋
          </span>{" "}
          Hey there!
        </div>

        <div className="bio">
          I am Vinay and I worked on developing web apps so that's pretty cool
          right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
        {!currentAccount && (
          <button className="waveButton" onClick={connectButtonHandler}>
            Connect wallet
          </button>
        )}
      </div>
    </div>
  );
}
