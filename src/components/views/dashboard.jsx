import React, { Component } from "react";
import $ from "jquery";
import Mousewheel from "jquery-mousewheel";
import mCustomScrollbar from "malihu-custom-scrollbar-plugin";

export default class Dashboard extends Component {
  componentDidMount(){
  	$(document).ready(function () {
        //$('#sidebar').addClass('active');
        $("#sidebar").mCustomScrollbar({
            theme: "minimal"
        });

        $('#dismiss, .overlay').on('click', function () {
        	//alert('sdfdsfds');
            // hide sidebar
            $('#sidebar').removeClass('active');
            // hide overlay
            $('.overlay').removeClass('active');
        });

        $('#sidebarCollapse').on('click', function () {
        	//alert('sidebarCollapse');
            // open sidebar
            $('#sidebar').addClass('active');
            // fade in the overlay
            $('.overlay').addClass('active');
            $('.collapse.in').toggleClass('in');
            $('a[aria-expanded=true]').attr('aria-expanded', 'false');
        });
    });
  }

  render() {
    return (
        <div className="wrapper">
			<nav id="sidebar">

		        <div id="dismiss">
		            <i className="fas fa-arrow-left"></i>
		        </div>

		        <div className="sidebar-header">
		            <h3>Bootstrap Sidebar</h3>
		        </div>

		        <ul className="list-unstyled components">
		            <p>Dummy Heading</p>
		            <li className="active">
		                <a href="#homeSubmenu" data-toggle="collapse" aria-expanded="false">Home</a>
		                <ul className="collapse list-unstyled" id="homeSubmenu">
		                    <li>
		                        <a href="#">Home 1</a>
		                    </li>
		                    <li>
		                        <a href="#">Home 2</a>
		                    </li>
		                    <li>
		                        <a href="#">Home 3</a>
		                    </li>
		                </ul>
		            </li>
		            <li>
		                <a href="#">About</a>
		                <a href="#pageSubmenu" data-toggle="collapse" aria-expanded="false">Pages</a>
		                <ul className="collapse list-unstyled" id="pageSubmenu">
		                    <li>
		                        <a href="#">Page 1</a>
		                    </li>
		                    <li>
		                        <a href="#">Page 2</a>
		                    </li>
		                    <li>
		                        <a href="#">Page 3</a>
		                    </li>
		                </ul>
		            </li>
		            <li>
		                <a href="#">Portfolio</a>
		            </li>
		            <li>
		                <a href="#">Contact</a>
		            </li>
		        </ul>

		        <ul class="list-unstyled CTAs">
                <li>
                    <a href="https://bootstrapious.com/tutorial/files/sidebar.zip" class="download">Download source</a>
                </li>
                <li>
                    <a href="https://bootstrapious.com/p/bootstrap-sidebar" class="article">Back to article</a>
                </li>
            </ul>
		    </nav>

		    <div id="content">
	            <nav className="navbar navbar-expand-lg navbar-light bg-light">
		            <div className="container-fluid">
		                <button type="button" id="sidebarCollapse" className="btn btn-info">
		                    <i className="fas fa-align-left"></i>
		                    <span>&nbsp;Menú</span>
		                </button>

		                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="nav navbar-nav ml-auto">
                            <li class="nav-item active">
                                <a class="nav-link" href="#">Page</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Page</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Page</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Page</a>
                            </li>
                        </ul>
                    </div>

		            </div>
		        </nav>

	            <h2>Collapsible Sidebar Using Bootstrap 4</h2>
	            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
	            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
	            <div className="line"></div>
	            <h2>Lorem Ipsum Dolor</h2>
	            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
	            <div className="line"></div>

	            <h2>Lorem Ipsum Dolor</h2>
	            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
	            <div className="line"></div>
	            <h3>Lorem Ipsum Dolor</h3>
	            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
	        </div>

	        <div className="overlay"></div>
		</div>
    );
  }
}