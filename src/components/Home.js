import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Home extends Component {
    render() {
        return (
            <div className="card">
                <center>
                    <h1>Welcome to the Rafale App!</h1>
                    <Link to={"/map"}><button className="btn red">Open Map</button></Link>
                </center>
            </div>
        )
    }
}
