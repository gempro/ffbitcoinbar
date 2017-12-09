/*****************************************************************************\
*                                                                             *
* BitcoinBar: Retrieves the current Bitcoin value and displays it on          *
*                Firefox's status bar.                                        *
*                                                                             *
* Version 1.0                                                Date: 6 Dec 2017 *
*                                                                             *
* In the currect version the following features are functioned:               *
*    1. By double-clicking on the BitcoinBar in Firefox's status bar,   	  *
*       the extension copies the value to the clipboard.                      *
*    2. By right clicking inside the web browser, the right-click   		  *
*       list displays a new entry called "Copy Bitcoin value", if the user    *
*       select this option a prompt box pops up displaying the value, where   *
*       the user may copy that into the clipboard.                            *
*    3. When the user right clicks on the BitcoinBar field in Firefox's       *
*       status bar, the option "Reload Bitcoin value instant"  				  *
*       are displayed.                                                        *
*                                                                             *
* Copyright 2017 Techweb                                     	  			  *
* Email: io@techweb.com                                                		  *
*                                                                             *
* This Addon based on the Firefox Extention Live IP Address 				  *
* https://addons.mozilla.org/de/firefox/addon/live-ip-address/ created by 	  *
* Anastasios Monachos - as I would prefare showing the current Bitcoin        *
* value in the status bar.				                                      *
*                                                                             *
* This program is free software; you can redistribute it and/or modify it     *
* under the terms of the GNU General Public License as published by the Free  *
* Software Foundation; either version 2 of the License, or (at your option)   *
* any later version.                                                          *
*                                                                             *
* This program is distributed in the hope that it will be useful, but WITHOUT *
* ANY WARRANTY; without even the implied warranty of MERCHANTIBLITY or        *
* FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public Licence for   *
* more details.                                                               *
*                                                                             *
* You should have received a copy of the GNU General Public License along     *
* with this program; if not, write to the Free Software Foundation, Inc.,     *
* 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.                    *
*                                                                             *
\*****************************************************************************/

var BitcoinValue;//Exported value for realIPAddress
var refreshTime = 180000;//Set here the default value to check for IP changes (in milliseconds)
var NumberOfIPFinders = 1;
var isValidValue = false;

/***************************************************************************
	This function is called when the user double-clicks on the BitcoinBar 
	status bar section, which automatically copies the Bitcoin value into the clipboard.
***************************************************************************/
function copyBitcoinValueToClipBoard()
{
	const gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
	gClipboardHelper.copyString(BitcoinValue);
	
}

/***************************************************************************
	This is the first thing that is being called from the XUL file.
***************************************************************************/
function updatebitcoinvalue()
{
	bcb_makeRequestIntelCommsXML('http://techweb.at/api/bitcoin/', '');
	self.setTimeout('updatebitcoinvalue()', refreshTime);//Remember to check for IP changes
}

window.addEventListener("load", updatebitcoinvalue, false);


/***************************************************************************
	This is the default Bitcoin value loader
	Start of http://techweb.at/api/bitcoin/
***************************************************************************/
function bcb_makeRequestIntelCommsXML(bitcoinbar_url, bitcoinbar_parameters)
{
	bitcoin_http_request = false;
	bitcoin_http_request = new XMLHttpRequest();
	
	if (bitcoin_http_request.overrideMimeType)
	{
		bitcoin_http_request.overrideMimeType('text/xml');
	}
	if (!bitcoin_http_request)
	{
		var bcb_linkstatusmessage = alert(document.getElementById('bitcoinvalue-strings').getString("ImpossibleCreation"));
		return false;
	}

	bitcoin_http_request.onreadystatechange = bitcoinbar_wwwintelcommsnet;
	bitcoin_http_request.open('GET', bitcoinbar_url + bitcoinbar_parameters, true);
	bitcoin_http_request.send(null);
}
function bitcoinbar_wwwintelcommsnet()
{
	if (bitcoin_http_request.readyState == 4)
	{
		if (bitcoin_http_request.status == 200)
		{
			var xmlobject = bitcoin_http_request.responseXML;
			var bcb_root = xmlobject.getElementsByTagName('value_div')[0];
			var bcb_element = bcb_root.getElementsByTagName("bc");
			var currentbitcoinvalue = bcb_element[0].firstChild.nodeValue;

			//Call function
			checkValueFormat(currentbitcoinvalue);

			if (isValidValue==true)
			{
				if (currentbitcoinvalue != "undefined")
				{
					BitcoinValue = currentbitcoinvalue;
					/****************/
					//The following line passes the value of Bitcoin straight in FF's Statusbar.
					document.getElementById('BitcoinStatusBar').label = currentbitcoinvalue;
					/****************/
					return BitcoinValue;
					updateStatusBar(BitcoinValue);
				}
				else {}
			}
			else
			{
				alert(document.getElementById('bitcoinvalue-strings').getString("RequestProblem"));
			}
		}//End of status 200
	}//End of readyState 4
	document.getElementById('BitcoinStatusBar').setAttribute("tooltiptext", "Bitcoin value is refreshing every "+ Math.floor(refreshTime/60000)+ " minutes");
	return BitcoinValue
}//End of http://techweb.at/api/bitcoin/

/***************************************************************************
	Return the current Bitcoin value
***************************************************************************/
function checkValueFormat(currentbitcoinvalue)
{
	isValidValue = true;
	return isValidValue
}//End of checkValueFormat(currentbitcoinvalue) method
