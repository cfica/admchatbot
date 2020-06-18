import React, { Component } from "react";
import $ from "jquery";
import Mousewheel from "jquery-mousewheel";
import mCustomScrollbar from "malihu-custom-scrollbar-plugin";

export default class SidebarMenu extends Component {
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
      		<nav id="sidebar">

		        <div id="dismiss">
		            <i className="fas fa-arrow-left"></i>
		        </div>

		        <div className="sidebar-header">
		            <h3>Bootstrap Sidebar</h3>
		        </div>

		        <ul className="list-unstyled components">
		            <p>Dummy Heading</p>
		            <li>
		            	<a href="/dashboard">Dashboard</a>
		            </li>

		            <li>
		            	<a href="/real-time">Real Time</a>
		            </li>

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
    );
  }
}