# Thailand COVID-19 Data Visualization  

| ![graph web data visualization](https://anonymaew.github.io/virus19th-graph/graph.png) | ![dot data visualization](https://anonymaew.github.io/virus19th-graph/map.png) |
| --- | --- |

Interactive data visualization of COVID-19 patients in Thailand. [Click here](https://anonymaew.github.io/virus19th-graph/) for the website.

## Features

1. Graph web data visualization

   - Patient groups are organized based on the contact group.
   - You can click on a dot to see the detail of that patient group.
   - The graph web is interactive, you can drag each individual dot. (I wrote my own physics)
   - You can go forward or backward in the timeline to visually see the spread.

2. Dot data visualization

   - Patient groups are organized based on location.
   - You can click on a dot to see the detail of that location.
   - You can go forward or backward in the timeline to visually see the spread.

## Stack

- **HTML** for purely static web pages (that was what I only learned at that time)
- **[P5.js](https://p5js.org/)** for processing and visualizing data

## Reminders

- **My project stopped tracking the patients' data on March 30, 2020.** The reason is that I did not expect the situation at that time to be worse, and my program was not designed for that much data. At last, I decided to abandon the project.
- **This web has bad-sizing elements.** Since this is one of the first web projects that I made, I did not know much about CSS and responsive design.

## Source

1. [Patient data](https://ddc.moph.go.th/covid19-dashboard/)
   - The link included in the web is deprecated.
   - The data might not look familiar to my data since I formatted and sanitized the data myself, so feel free to use [mine](https://anonymaew.github.io/virus19th-graph/graph/data.json).
2. [Map image from Mapbox](https://www.mapbox.com)
