import React, { Component } from "react";

class NavBar extends Component {
    render() {
        return (
            <React.Fragment>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                    <div className="container">
                        <a className="navbar-brand" href="/">
                            <img className="header-logo" src="../logo.svg" />
                        </a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="/navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        
                    </div>
                </nav>
            </React.Fragment>
        );
    }
}

export default NavBar;