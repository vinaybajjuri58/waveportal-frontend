import React, { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";
import { LoaderComponent } from "./Components";
import "./App.css";
const contractAddress = "0xAfcbaf2B68F07f9828079801E86C01bd2b89E496";

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const contractABI = abi.abi;

  const wave = async () => {
    setLoading(true);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved Total wave count", count.toNumber());

        const waveTxn = await wavePortalContract.wave(inputMessage, {
          gasLimit: 300000,
        });
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesnt exist");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getAllWaves = useCallback(async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const waveportalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const waves = await waveportalContract.getAllWaves();
        let wavesCleaned = [];
        waves.forEach((wave) => {
          console.log({ wave });
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestammp * 1000),
            message: wave.message,
          });
        });
        setAllWaves(wavesCleaned);
        waveportalContract.on("NewWave", (from, timestamp, message) => {
          console.log("NewWave", from, timestamp, message);

          setAllWaves((prevState) => [
            ...prevState,
            {
              address: from,
              timestamp: new Date(timestamp * 1000),
              message: message,
            },
          ]);
        });
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }, [contractABI]);

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
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    getAllWaves();
  }, [getAllWaves]);

  const waveButtonHandler = () => {
    if (inputMessage.length > 0) {
      wave();
    } else {
      console.log("Input Cannot be Empty");
    }
  };

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          <span role="img" aria-label="wave">
            👋
          </span>{" "}
          Hey there!
        </div>
        {loading && <LoaderComponent />}
        <div className="bio">
          I am Vinay and I worked on developing web apps so that's pretty cool
          right? Connect your Ethereum wallet and send me a good lofi beats
          playlist!
        </div>

        <input type="text" value={inputMessage} onChange={handleInputChange} />

        <button className="waveButton" onClick={waveButtonHandler}>
          Wave at Me
        </button>
        {!currentAccount && (
          <button className="waveButton" onClick={connectButtonHandler}>
            Connect wallet
          </button>
        )}
        {allWaves.map((wave, index) => {
          return (
            <div
              key={index}
              style={{
                backgroundColor: "OldLace",
                marginTop: "16px",
                padding: "8px",
              }}
            >
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
