# Tip Tracking Dashboard

by Colin Trierweiler

## Project Description

This project is based off of the "Build a Data Dashboard" project at https://towardsdatascience.com/build-a-data-dashboard-using-html-css-javascript by Thomas Reid.

I have changed it to track the tips I make as a restaurant server.

Now it is a web-based dashboard for restaurant servers to track and analyze their tips across different shifts, days, and time periods. Visualize earnings patterns to optimize work schedules and maximize income.

I have changed the mock sales data to include the real data of the tips I made last week, plus other data about how many hours I worked, what day of the week it was, and whether the shift was AM or PM.

This could be developed into a real app to help servers keep track of their tips, and what days and shifts yield the most.  It's obviously different in every restaurant, but it's a way to gather data.

I also changed the CSS to fit my brand (green-text on a black background).

## Setup & Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up the database: `python setupDB.py`
4. Start the server: `node server/server.js`
5. Open http://localhost:3000

I am releasing it under a GNU General Public License, so others may play with the code as they see fit.

## Tech Stack

I am using basic HTML and CSS with an SQLite3 database.  I am using Node.js for the backend.  There is also Bootstrap and Chart.js, for the buttons and charts, respectively.

## Future Ideas

If we move from a web app to a mobile app, I think Flutter would be good.  This would allow us to be cross-platform between Android and iOS.

## Contributions

Contributions are welcome and appreciated! Whether you're fixing bugs, adding features, or improving documentation, your help makes this project better for everyone.

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Feel free to open an issue first to discuss major changes or new features.