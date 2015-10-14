/* global s4a, jQuery  */

jQuery("document").ready(function () {

    var mWidth = 400, mHeight = 400;

    var mNodeId = "f3b9d64b-35a5-4565-8582-aee472b3a483";

    jQuery.ajax({
        type: 'GET',
        url: 'DiagramData.xml',
        dataType: 'xml',
        data: {id: mNodeId},
        contentType: "application/xml; charset=utf-8",
        success: function (pXmlData) {
            /**
             * Diagram data
             * @type AASDiag.DiagramData
             */
            var mDiagramData = s4a.viz.map.util.fixJsonData(jQuery.xml2json(pXmlData));
            console.log(JSON.stringify(mDiagramData));

            mDiagramData.mapType = "choroplethMap";
            s4a.viz.map.getMap("div#diagram1", mDiagramData, mWidth, mHeight);

            /**
             * @type AASDiag.DiagramData
             */
            var mDiagramData2 = s4a.viz.map.util.fixJsonData(jQuery.xml2json(pXmlData));

            mDiagramData2.mapType = "bubbleMap";
            mDiagramData2.colors = ["Blues"];
            s4a.viz.map.getMap("div#diagram2", mDiagramData2, mWidth, mHeight);

            /**
             * @type AASDiag.DiagramData
             */
            var mDiagramData3 = s4a.viz.map.util.fixJsonData(jQuery.xml2json(pXmlData));
            mDiagramData3.mapType = "pieChartMap";
            mDiagramData3.title = "Testdiagram med kaker";
            s4a.viz.map.getMap("div#diagram3", mDiagramData3, mWidth, mHeight);

            /**
             * @type AASDiag.DiagramData
             */
            var mDiagramData4 = s4a.viz.map.util.fixJsonData(jQuery.xml2json(pXmlData));

            mDiagramData4.mapType = "bubbleChoroplethMap";
            mDiagramData4.showSeries = [0, 1];
            mDiagramData4.colors = ["Reds", "Blues"];
            s4a.viz.map.getMap("div#diagram4", mDiagramData4, mWidth, mHeight);
        }
    });
});