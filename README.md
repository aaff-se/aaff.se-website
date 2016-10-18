# aaff.se website

## About
This is the source code for the main portfolio site on [aaff.se][1]. Inspired by the work made by [ustwo][2] - the site works as an universal single page application, with front end running on a React/Node instance, but fetching all the content through an API from a sub-domain running WordPress.

Feel free to copy, edit, update, and use in any way, but please give credit where it is due. Happy tinkering! 

## Structure

### Front end / React & Node code
All the front end code resides in the node-folder, using webpack to bundle up all the necessary files - both for server-side and client use. The reason to bundling up the server files as well is that the Node app is deployed using Passenger for easy monitoring.


### Back end / WordPress code
All back end code resides in the wp-folder, basically everything uploaded to wp-content/. 

The theme contains nothing more than a index and stylesheet - since everything is rendered by React.

The plugins are divided into two parts. The "site engine" which contains all the code responsible for saving content the way we want it - Custom post types, media settings, and so on. The second part is the "rest API" which (you guessed it) runs all the code responsible for serving all the content from the custom end points.

## License 

aaff.se website Copyright (C) 2015 Anton Andersson Form & Funktioner

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>.

[1]: https://www.aaff.se
[2]: https://ustwo.com 