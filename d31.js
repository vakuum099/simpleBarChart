"use strict"
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