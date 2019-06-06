package io.github.pashazz;

import org.influxdb.dto.Point;
import org.w3c.dom.Node;
import org.xml.sax.InputSource;

import javax.xml.parsers.DocumentBuilderFactory;
import java.time.Instant;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Parser is a class that parsers individual XML RRD documents and adds data points to an InfluxDB database
 *
 * Each VM is assigned a point at a moment of time (thus, a "measurement" of an InfluxDB point is an UUID.
 * The values are the measurements associated with this VM: i.e. cpu load, memory load, etc.
 *
 * The work is going as follows:
 * 1) construct a new Parser object with an InputSource
 * 2) call parse()
 * 3) parse() goes through XML data and adds a mentions about every VM to a legend map
 * 4) Every data point gets added to a point appropriate according to VM UUID (we have n data points at a time, each corresponding to a particular VM)
 * 5) after the XML file is parsed, we're adding the points to the DB. Auto-batch policies apply
 */
public class Parser {
    class Legend  {
        private String uuid;
        private String field;
        private String statType; // "AVERAGE", "MIN", "MAX"
        public Legend(String[] legend) {
            statType = legend[0];
            uuid = legend[2];
            field = legend[3];
        }

        public String getUuid() {
            return uuid;
        }

        public String getField() {
            return field;
        }

        public String getStatType() {
            return statType;
        }
    }

    private Loader loader;
    private InputSource inputSource;
    private Node metaNode;
    private Node dataNode;
    Map<String, Point.Builder> legendMap;
    List<Legend> legends;

    public Parser(Loader loader, InputSource inputSource) {
        this.loader = loader;
        this.inputSource = inputSource;
        this.legends = new LinkedList<>();
        this.legendMap = new HashMap<>();
    }
    /**
     * Parses a XML document, adds data points to an InfluxDB database specified by loader
     * @return Time moment when the last event had occurred
     */
    public Instant parse() {

        try {
            var domFactory = DocumentBuilderFactory.newInstance();
            domFactory.setNamespaceAware(true);
            var builder = domFactory.newDocumentBuilder();
            var doc = builder.parse(inputSource);
            var nodes = doc.getDocumentElement().getChildNodes(); //<xport> {...} </xport>
            for (int i = 0; i < nodes.getLength(); ++i) {
                var node = nodes.item(i);
                if (node.getNodeName().equals("meta")) {
                    metaNode = node;
                } else if (node.getNodeName().equals("data")) {
                    dataNode = node;
                }
            }
            if (metaNode == null)
                throw new IllegalArgumentException("No meta node in XML file");
            if (dataNode == null)
                throw new IllegalArgumentException("No data node in XML file");

            var end = processMetaNode();
            processDataNode();
            return end;

        }
        catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }
    private void processDataNode() {
        var rowNodes = dataNode.getChildNodes();
        for (int j = 0; j < rowNodes.getLength(); ++j) {
            var rowNode = rowNodes.item(j);
            addDataPointsFromRowNode(rowNode);
            clearLegendMap();
        }
    }

    protected void addDataPointsFromRowNode(Node rowNode) {
        var timeNode = rowNode.getFirstChild();
        if (!timeNode.getNodeName().equals("t")) {
            throw new IllegalArgumentException(String.format("timeNode name is %s. Expected: t", timeNode.getNodeName()));
        }

        legendMap.forEach((uuid, point) -> legendMap.replace(uuid, point.time(Long.parseLong(timeNode.getTextContent()), TimeUnit.SECONDS)));
        var currentNode = timeNode.getNextSibling();
        for (var i = legends.iterator(); i.hasNext() && (currentNode != null); currentNode = currentNode.getNextSibling()) {
            if (!currentNode.getNodeName().equals("v"))
                throw new IllegalArgumentException(String.format("currentNode name is %s. Expected: v", currentNode.getNodeName()));
            var legend = i.next();

            legendMap.replace(legend.getUuid(),
                    legendMap.get(legend.getUuid()).addField(legend.getField(), Double.parseDouble(currentNode.getTextContent())));

        }
        writeLegendMapToDB();
    }

    protected Instant processMetaNode() {
        Instant lastLoad = null;
        var metaNodes = metaNode.getChildNodes();
        for (int i = 0; i < metaNodes.getLength(); ++i) {
            var metaNode = metaNodes.item(i);
            if (metaNode.getNodeName().equals("end")) {
                lastLoad = Instant.ofEpochSecond(Long.parseLong(metaNode.getTextContent()));
            }
            else if (metaNode.getNodeName().equals("legend")) {
                var legendNodes = metaNode.getChildNodes();
                for (int k = 0; k < legendNodes.getLength(); ++k) {
                    var legendNode = legendNodes.item(k);
                    var arrLegend = legendNode.getTextContent().split(":");
                    var legend = new Legend(arrLegend);
                    legends.add(legend);
                }
                initializeLegendMap();
            }
        }
        return lastLoad;
    }

    protected void initializeLegendMap () {
        for (var legend: legends) {
            legendMap.putIfAbsent(legend.getUuid(), Point.measurement(legend.getUuid()));
        }
    }

    protected void clearLegendMap() {
        for (var s: legendMap.keySet()) {
            legendMap.replace(s, Point.measurement(s));
        }
    }

    protected void writeLegendMapToDB() {
        legendMap.values().forEach(point -> loader.influxDB.write(point.build()));
    }
}

