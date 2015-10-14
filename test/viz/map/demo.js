jQuery(document).ready(function() {

    var mWidth = 400;
    var mHeight = 400;

    var mNodeId = "f3b9d64b-35a5-4565-8582-aee472b3a483";

    jQuery.ajax({
        type: 'GET',
        url: 'DiagramData.xml',
        dataType: 'xml',
        data: {id: mNodeId},
        contentType: "application/xml; charset=utf-8",
        success: function(pXmlData) {
            /**
             * Diagram data
             * @type AASDiag.DiagramData
             */
            var mDiagramData = AASDiag.Util.fixJsonData(jQuery.xml2json(pXmlData));
            console.log(JSON.stringify(mDiagramData));
            
            mDiagramData.mapType = "choroplethMap";
            AASDiag.getMap("div#diagram1", mDiagramData, mWidth, mHeight);

            /**
             * @type AASDiag.DiagramData
             */
            var mDiagramData2 = AASDiag.Util.fixJsonData(jQuery.xml2json(pXmlData));
            ;
            mDiagramData2.mapType = "bubbleMap";
            mDiagramData2.colors = ["Blues"];
            AASDiag.getMap("div#diagram2", mDiagramData2, mWidth, mHeight);

            /**
             * @type AASDiag.DiagramData
             */
            var mDiagramData3 = AASDiag.Util.fixJsonData(jQuery.xml2json(pXmlData));
            mDiagramData3.mapType = "pieChartMap";
            mDiagramData3.title = "Testdiagram med kaker";
            AASDiag.getMap("div#diagram3", mDiagramData3, mWidth, mHeight);

            /**
             * @type AASDiag.DiagramData
             */
            var mDiagramData4 = AASDiag.Util.fixJsonData(jQuery.xml2json(pXmlData));
            ;
            mDiagramData4.mapType = "bubbleChoroplethMap";
            mDiagramData4.showSeries = [0, 1];
            mDiagramData4.colors = ["Reds", "Blues"];
            AASDiag.getMap("div#diagram4", mDiagramData4, mWidth, mHeight);
        }
    });
});