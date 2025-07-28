import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Totals from './components/Totals';
import AddResults from './components/AddResults';
import ViewResults from './components/ViewResults';

function App() {
    return ( <
        div className = "container" >
        <
        h1 > Polling App < /h1>

        <
        nav >
        <
        ul >
        <
        li > < Link to = "/" > Totals < /Link></li >
        <
        li > < Link to = "/add" > Add Results < /Link></li >
        <
        li > < Link to = "/view" > View Results < /Link></li >
        <
        /ul> < /
        nav >

        <
        Routes >
        <
        Route path = "/"
        element = { < Totals / > }
        /> <
        Route path = "/add"
        element = { < AddResults / > }
        /> <
        Route path = "/view"
        element = { < ViewResults / > }
        /> < /
        Routes > <
        /div> 
    );
}

export default App;