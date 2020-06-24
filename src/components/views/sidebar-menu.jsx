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
		            <h3>bElisa</h3>
		        </div>

		        <ul className="list-unstyled CTAs">
		            <p>Options Admin</p>

		            <li className="active">
		                <a href="#ClientsSubmenu" data-toggle="collapse" aria-expanded="false">Clients</a>
		                <ul className="collapse list-unstyled" id="ClientsSubmenu">
		                    <li>
				            	<a href="/base-words">Smart Actions</a>
				            </li>
				            
		                    <li>
		                        <a href="#">Home 2</a>
		                    </li>
		                    <li>
		                        <a href="#">Home 3</a>
		                    </li>
		                </ul>
		            </li>

		            <li className="active">
		                <a href="#UsersSubmenu" data-toggle="collapse" aria-expanded="false">Users</a>
		                <ul className="collapse list-unstyled" id="UsersSubmenu">
		                    <li>
				            	<a href="/base-words">Smart Actions</a>
				            </li>
				            
		                    <li>
		                        <a href="#">Home 2</a>
		                    </li>
		                    <li>
		                        <a href="#">Home 3</a>
		                    </li>
		                </ul>
		            </li>

		            <li className="active">
		                <a href="#ApplicationSubmenu" data-toggle="collapse" aria-expanded="false">Application</a>
		                <ul className="collapse list-unstyled" id="ApplicationSubmenu">
		                    <li>
				            	<a href="/base-words">Smart Actions</a>
				            </li>
				            
		                    <li>
		                        <a href="#">Home 2</a>
		                    </li>
		                    <li>
		                        <a href="#">Home 3</a>
		                    </li>
		                </ul>
		            </li>

		            <li className="active">
		                <a href="#SystemsSubmenu" data-toggle="collapse" aria-expanded="false">Systems</a>
		                <ul className="collapse list-unstyled" id="SystemsSubmenu">
		                    <li>
				            	<a href="/base-words">Smart Actions</a>
				            </li>
				            
		                    <li>
		                        <a href="#">Home 2</a>
		                    </li>
		                    <li>
		                        <a href="#">Home 3</a>
		                    </li>
		                </ul>
		            </li>

		            {/*
	                <li>
	                    <a href="https://bootstrapious.com/tutorial/files/sidebar.zip" className="download">Download source</a>
	                </li>
	                <li>
	                    <a href="https://bootstrapious.com/p/bootstrap-sidebar" className="article">Back to article</a>
	                </li>*/}
	            </ul>

		        <ul className="list-unstyled components">
		            <p>Options Client</p>

		            <li>
		            	<a href="/dashboard">Dashboard</a>
		            </li>

		            <li>
		            	<a href="/real-time">Real Time</a>
		            </li>

		            <li>
		            	<a href="/base-words">Words Base</a>
		            </li>

		            {/*<li className="active">
		                <a href="#realTimeSubmenu" data-toggle="collapse" aria-expanded="false">Real Time</a>
		                <ul className="collapse list-unstyled" id="realTimeSubmenu">
		                    <li>
				            	<a href="/real-time">Real Time</a>
				            </li>
		                    <li>
		                        <a href="#">Home 2</a>
		                    </li>
		                    <li>
		                        <a href="#">Home 3</a>
		                    </li>
		                </ul>
		            </li>*/}

		            {/*<li className="active">
		                <a href="#WordsBaseSubmenu" data-toggle="collapse" aria-expanded="false">Words Base</a>
		                <ul className="collapse list-unstyled" id="WordsBaseSubmenu">
		                    <li>
				            	<a href="/base-words">Words Base</a>
				            </li>

		                    <li>
		                        <a href="#">Home 2</a>
		                    </li>
		                    <li>
		                        <a href="#">Home 3</a>
		                    </li>
		                </ul>
		            </li>*/}

		            <li className="active">
		                <a href="#TeamSubmenu" data-toggle="collapse" aria-expanded="false">Team collaboration</a>
		                <ul className="collapse list-unstyled" id="TeamSubmenu">
		                    <li>
				            	<a href="/base-words">Team collaboration</a>
				            </li>
				            
		                    <li>
		                        <a href="#">Home 2</a>
		                    </li>
		                    <li>
		                        <a href="#">Home 3</a>
		                    </li>
		                </ul>
		            </li>

		            <li className="active">
		                <a href="#IntegrationsSubmenu" data-toggle="collapse" aria-expanded="false">Integrations</a>
		                <ul className="collapse list-unstyled" id="IntegrationsSubmenu">
		                    <li>
				            	<a href="/base-words">Integrations</a>
				            </li>
				            
		                    <li>
		                        <a href="#">Home 2</a>
		                    </li>
		                    <li>
		                        <a href="#">Home 3</a>
		                    </li>
		                </ul>
		            </li>

		            <li className="active">
		                <a href="#ReportingSubmenu" data-toggle="collapse" aria-expanded="false">Reporting</a>
		                <ul className="collapse list-unstyled" id="ReportingSubmenu">
		                    <li>
				            	<a href="/base-words">Reporting</a>
				            </li>
				            
		                    <li>
		                        <a href="#">Home 2</a>
		                    </li>
		                    <li>
		                        <a href="#">Home 3</a>
		                    </li>
		                </ul>
		            </li>

		            <li className="active">
		                <a href="#SmartActionsSubmenu" data-toggle="collapse" aria-expanded="false">Smart Actions</a>
		                <ul className="collapse list-unstyled" id="SmartActionsSubmenu">
		                    <li>
				            	<a href="/base-words">Smart Actions</a>
				            </li>
				            
		                    <li>
		                        <a href="#">Home 2</a>
		                    </li>
		                    <li>
		                        <a href="#">Home 3</a>
		                    </li>
		                </ul>
		            </li>


		            {/*<li className="active">
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
		            </li> */}
		        </ul>

		    </nav>
    );
  }
}