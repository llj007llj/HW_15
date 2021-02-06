const SAMPLE_JSON_FILE = "samples.json";

function generateDemographicInfo(sampleId) {
  d3.json(SAMPLE_JSON_FILE).then((data) => {
    const metaData = data.metadata;
    const filteredResults = metaData.filter(sampleobject => sampleobject.id == sampleId);
    const result = filteredResults[0];
    
    const panel = d3.select("#sample-metadata");
    panel.html("");
    
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(key + ": " + value);
    });
  });
}

function bubbleChart(otuIds, otuLabels, sampleValues) {
  const bubbleLayout = {
    margin: {
      t: 0
    },
    xaxis: {
      title: "OTU ID"
    },
    hovermode: "closest",
    showlegend: false
  };

  const bubbleData = [{
    x: otuIds,
    y: sampleValues,
    text: otuLabels,
    mode: "markers",
    marker: {
      color: otuIds,
      size: sampleValues
    }
  }];

  Plotly.newPlot("bubble", bubbleData, bubbleLayout);
}

function barChart(otuIds, otuLabels, sampleValues) {
  const barLayout = {
    margin: {
      t: 30,
      l: 150
    }
  };

  const barData = [{
    y: otuIds.slice(0, 10).map(otuId => "OTU " + otuId).reverse(),
    x: sampleValues.slice(0, 10).reverse(),
    text: otuLabels.slice(0, 10).reverse(),
    type: "bar",
    orientation: "h"
  }];

  Plotly.newPlot("bar", barData, barLayout);
}

function generateCharts(sampleId) {
  d3.json(SAMPLE_JSON_FILE).then((data) => {
    const samples = data.samples;
    const filteredResults = samples.filter(sampleobject => sampleobject.id == sampleId);
    const result = filteredResults[0]

    const otuIds = result.otu_ids;
    const otuLabels = result.otu_labels;
    const sampleValues = result.sample_values;

    barChart(otuIds, otuLabels, sampleValues);
    bubbleChart(otuIds, otuLabels, sampleValues);
  });
}

function optionChanged(sampleId) {
  generateDemographicInfo(sampleId);
  generateCharts(sampleId);
}

function main() {
  const selector = d3.select("#selDataset");

  d3.json(SAMPLE_JSON_FILE).then((data) => {
    const sampleData = data.names;
    sampleData.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);
    });

    const sampleId = sampleData[0];
    generateDemographicInfo(sampleId);
    generateCharts(sampleId);
  });
}

main();