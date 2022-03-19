function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// (D1) 1. Create the buildCharts function.
function buildCharts(sample) {
  // (D1) 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // (D1) 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // (D1) 4. Create a variable that filters the samples for the object with the desired sample number.
    var desiredSample = samples.filter(sampleObj => sampleObj.id == sample);


    // (D3) 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var desiredMeta = metadata.filter(sampleObj => sampleObj.id == sample);

    // (D1) 5. Create a variable that holds the first sample in the array.
    var firstSample = desiredSample[0];
  
    // (D3) 2. Create a variable that holds the first sample in the metadata array.
    
    var firstMeta = desiredMeta[0];

    // (D1) 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;

    // (D3) 3. Create a variable that holds the washing frequency.
    var washingFrequency = parseFloat(firstMeta.wfreq);
 

    // (D1) 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.slice(0,10).reverse().map(otu_ids =>`OTU ${otu_ids}`);
    

    // (D1) 8. Create the trace for the bar chart. 
    var xticks = sampleValues.slice(0,10).reverse();
    var labels = otuLabels.slice(0,10).reverse();
    var barData = [{
      type: "bar",
      text: labels,
      x:xticks,
      y:yticks,
      orientation: "h"
    }];
    // (D1) 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",  
    };
    // (D1) 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // (D2) 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds
      }
    }];

    // (D2) 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis:{title: "OTU ID"},
      hovermode:"closest"
      
      
    };

    // (D2) 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // (D3) 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: washingFrequency,
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10]},
        bar: { color: "black"},
        steps: [
          {range: [0,2], color: "red"},
          {range: [2,4], color: "orange"},
          {range: [4,6], color: "yellow"},
          {range: [6,8], color: "limegreen"},
          {range: [8,10], color: "forestgreen"},
      
      ]
      }
    
    }];
    
    // (D3) 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 500, height: 400,
      title: "Belly Button Washing Frequency <br> Scrubs per Week"
       
    };

    // (D3) 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
