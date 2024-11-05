import React, { Component, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import './App.css'

const API_KEY = import.meta.env.VITE_APP_API_KEY;

const DetailView = () => {
    let name = useParams();
    console.log(name.symbol)
    const user = JSON.parse(sessionStorage.getItem(name.symbol))
    console.log(user)
    return (
        <>
            <div className="back-link">
                <Link to="/" onClick={() => {sessionStorage.clear()}}>
                    Back
                </Link>
            </div>
            <div key={user.id} className="forecast-item">
                <img
                    src={`/${user.color}.png`}
                    alt={"sdfsd"}
                />
            </div>
            <h4>Name: {user.name}</h4>
            <h4>Speed: {user.speed}</h4>
            <h4>Color: {user.color}</h4>
        </>

    
    );
  };
  
  export default DetailView;