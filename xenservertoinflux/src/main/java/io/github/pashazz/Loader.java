package io.github.pashazz;

import com.xensource.xenapi.Connection;
import com.xensource.xenapi.Host;
import com.xensource.xenapi.Session;
import com.xensource.xenapi.Types;
import org.apache.xmlrpc.XmlRpcException;
import org.influxdb.BatchOptions;
import org.influxdb.InfluxDB;
import org.influxdb.InfluxDBFactory;
import org.influxdb.dto.Point;
import org.influxdb.dto.Query;
import org.w3c.dom.Node;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

public class Loader implements Closeable {
    protected Connection xapiConnection;
    protected InfluxDB influxDB;
    protected String dbName = "vmemperor";
    protected String basicAuth;
    protected Instant lastLoad;
    protected boolean debug;

    /**
     * Connects to InfluxDB and configures Xen API params
     *
     * @param masterHostUrl URL of xapi pool's master hos
     * @throws MalformedURLException
     */

    Loader(final String masterHostUrl, final String xapiUsername, final String xapiPassword, final String influxDBUrl,
           final boolean debug
    ) throws MalformedURLException, Types.XenAPIException, XmlRpcException {
        this.debug = debug;
        influxDB = InfluxDBFactory.connect(influxDBUrl);
        System.err.println("Connected to InfluxDB " + influxDBUrl);
        BatchOptions batchOptions = BatchOptions.DEFAULTS;
        influxDB.enableBatch(batchOptions);
        influxDB.query(new Query("CREATE DATABASE " + dbName));
        influxDB.setDatabase(dbName);

        xapiConnection = new Connection(new URL(masterHostUrl));
        Session.loginWithPassword(xapiConnection, xapiUsername, xapiPassword);
        basicAuth = "Basic " + Base64.getEncoder().encodeToString(String.format("%s:%s", xapiUsername, xapiPassword).getBytes());
        System.err.println("Connected to XenServer " + masterHostUrl);
    }

    public void start() {
        try {
            while (true) {
                getUpdates(5);
                Thread.sleep(5000);
            }
        }
        catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    public void close() {
        influxDB.close();
        xapiConnection.dispose();
    }


    protected void getUpdates(int secondsAgo) throws IOException, Types.XenAPIException, XmlRpcException {
        lastLoad = Instant.now().minus(Duration.ofSeconds(secondsAgo));
        for (var host : Host.getAll(xapiConnection)) {
            var apiUrl = String.format("http://%s/rrd_updates/?start=%d&host=true", host.getAddress(xapiConnection), lastLoad.getEpochSecond());
            try {
                var url = new URL(apiUrl);
                var conn = url.openConnection();

                conn.setRequestProperty("Authorization", basicAuth);
                try(var reader = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
                    InputSource inputSource;
                    if (debug) {
                        String result = reader.lines().parallel().collect(Collectors.joining("\n"));
                        var writer = new BufferedWriter(new FileWriter("/tmp/xenserver2influx" + lastLoad.toString()));
                        writer.write(result);
                        writer.close();
                        inputSource = new InputSource(new StringReader(result));
                    }
                    else {
                        inputSource = new InputSource(reader);
                    }

                    readXmlData(inputSource);
                }

            } catch (Exception ex) {
                ex.printStackTrace();
            }


            //next: https://jansipke.nl/getting-cpu-memory-disk-and-network-metrics-from-xenserver/ and https://github.com/influxdata/influxdb-java
        }
    }
    protected void readXmlData (InputSource inputSource) throws ParserConfigurationException, IOException, SAXException {
        var parser = new Parser(this, inputSource);
        var time = parser.parse();
        System.err.format("XML document parsed. End time: %s\n", time.toString());
    }


}
