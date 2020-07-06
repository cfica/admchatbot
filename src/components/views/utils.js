import React, { Component } from "react";
//import * as jwtEncrypt from 'jwt-token-encrypt';

//utilsjs
export default class Utils{
    static utilMethod = (data) => {
        return ('');
    }

    /*static async _encode(jwtDetails, publicData, encryption, privateData){
    	const token = await jwtEncrypt.generateJWT(
		      jwtDetails,
		      publicData,
		      encryption,
		      privateData
	    );
	    return token;
    }

    static _encodeData = (publicData) =>{
	    //encriptación de extremo a extremo..
	    // Data that will only be available to users who know encryption details.
	    const privateData = {
	        email: "user",
	        bank: "HSBC",
	        pin: "1234",
	    };
	     
	    // Encryption settings
	    const encryption = {
	        key: 'AAAAAAAAAAAAAA',
	        //algorithm: 'aes-256-cbc',
	        algorithm: 'HS256'
	      };
	     
	    // JWT Settings
	    const jwtDetails = {
	        secret: '1234567890', // to sign the token
	        // Default values that will be automatically applied unless specified.
	        // algorithm: 'HS256',
	        // expiresIn: '12h',
	        // notBefore: '0s',
	        // Other optional values
	        key: 'ThisIsMyAppISS',// is used as ISS but can be named iss too
	    };
	 
	    const token = this._encode(jwtDetails, publicData, encryption, privateData);
	}

	static _decodeData = (token) =>{
	    // Encryption settings
	    const encryption = {
	        key: 'AAAAAAAAAAAAAA',
	        algorithm: 'aes-256-cbc',
	      };
	     
	    const decrypted = jwtEncrypt.readJWT(token, encryption);
	}*/
}
