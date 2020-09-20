"use strict"
/*User Story #1: My heat map should have a title with a corresponding id="title".

User Story #2: My heat map should have a description with a corresponding id="description".

User Story #3: My heat map should have an x-axis with a corresponding id="x-axis".

User Story #4: My heat map should have a y-axis with a corresponding id="y-axis".

User Story #5: My heat map should have rect elements with a class="cell" that represent the data.

User Story #6: There should be at least 4 different fill colors used for the cells.

User Story #7: Each cell will have the properties data-month, data-year, data-temp containing their corresponding month, year, and 
temperature values.

User Story #8: The data-month, data-year of each cell should be within the range of the data.

User Story #9: My heat map should have cells that align with the corresponding month on the y-axis.

User Story #10: My heat map should have cells that align with the corresponding year on the x-axis.

User Story #11: My heat map should have multiple tick labels on the y-axis with the full month name.

User Story #12: My heat map should have multiple tick labels on the x-axis with the years between 1754 and 2015.

User Story #13: My heat map should have a legend with a corresponding id="legend".

User Story #14: My legend should contain rect elements.

User Story #15: The rect elements in the legend should use at least 4 different fill colors.

User Story #16: I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.

User Story #17: My tooltip should have a data-year property that corresponds to the data-year of the active area.

Here is the dataset you will need to complete this project: 
https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json

You can build your project by forking this CodePen pen ( https://codepen.io/freeCodeCamp/pen/MJjpwO ). Or you can use this CDN link to 
run the tests in any environment you like:  https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js
 */
 
const padding = 50;
const h = 600;
const w = 255*3+padding * 2;

const mySvg = d3.select('body')
		.append('svg')
		.attr('height', h)
		.attr('width', w)
		.style('background-color', 'cyan')
		.attr('id', 'title');



const rawData = new XMLHttpRequest();
rawData.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);			
rawData.send();
rawData.onload = main;

function main() {

	const dataset = JSON.parse(rawData.responseText).data;
	
	const description = JSON.parse(rawData.responseText)
							.description.replace('-', '\n')
							.split('\n');
							
	description.push('From ' 
					+ JSON.parse(rawData.responseText).from_date 
					+ ' till ' 
					+ JSON.parse(rawData.responseText).to_date + '.');

	tableDescription(description, padding, mySvg);
	//
	draw(dataset, mySvg, padding, h);

}

function tableDescription(description, padding, mySvg) {
	mySvg.selectAll('text')
		.data(description)
		.enter()
		.append('text')
		.attr('x', padding  +10)
		.attr('y', (d, i) => padding * (1+i))
		.text((d)=> d);
}


function draw (data, mySvg, padding, h){

	const yScale = d3.scaleLinear()
		.domain([0, d3.max(data, (d) => d[1])])
		.range([h - padding, padding]);
		
	const xScale = d3.scaleTime()
		.domain([d3.min(data, d => Date.parse(d[0])), d3.max(data, d => Date.parse(d[0]))])
		.range([padding, w - padding]);
	
	const yAxis = d3.axisLeft(yScale);
	const xAxis = d3.axisBottom(xScale);
	
	mySvg.append("g")
		.attr("transform", "translate(" + padding + ", " + '0' + ")")
		.attr('id', 'y-axis')
		.call(yAxis);
		
	mySvg.append("g")
		.attr("transform", "translate(" + '0' + ", " + (h - padding) + ")")
		.attr('id', 'x-axis')
		.call(xAxis);
	
	const tooltip = d3
		.select("body")
		.append("div")
		.attr("id", "tooltip");
	
	mySvg.selectAll('rect')
		.data(data)
		.enter()
		.append('rect')
		.attr('x', (d, i) => xScale(Date.parse(d[0])))
		.attr('y', (d) => yScale(Number(d[1]) - padding))
		.attr('height', (d) => h - padding - yScale(Number(d[1])))
		.attr('width', 3)
		.attr('class', 'bar')
		.attr('data-date', d => d[0])
		.attr('data-gdp', d => d[1])
		.attr('fill', 'blue')
		.on("mouseover", d => {
			tooltip
				.attr('data-date', d[0])
				.text(d[0] + '\r' + d[1] +' $Bil')
				.style("left", d3.event.pageX + "px")
				.style("top", d3.event.pageY - 28 + "px")
				.transition()
				.duration(200)
				.style("opacity", 1)
		})
		.on("mouseout", () => {
			tooltip
				.transition()
				.duration(200)
				.style("opacity", 0);
		});
}