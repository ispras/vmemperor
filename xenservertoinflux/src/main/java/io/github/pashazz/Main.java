package io.github.pashazz;

import org.apache.commons.cli.*;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.Properties;

public class Main {
    /*
    For now I configured grafana for myself at port 5000
     */

    public static void showHelp(Options options) {
        var formatter = new HelpFormatter();
        var progName = System.getProperty("sun.java.command").split(" ")[0];
        formatter.printHelp(progName, options);
    }
    static String trimProp(String prop) {
        return prop.split("#",2)[0].trim().replaceAll("^[\"']+|[\"']+$", "");
    }
    public static void main(String[] args) {
	// write your code here
        var options = new Options();
        options.addRequiredOption("c", "config", true, "config file location");
        options.addOption("db", "influxDB", true, "InfluxDB URL. Default: http://localhost:8086");
        options.addOption("h", "help", false, "print help message");
        options.addOption("d", "debug", false, "write xml files into /tmp/ folder");

        var parser = new DefaultParser();
        CommandLine line;
        try {
            line = parser.parse(options, args);
        }
        catch (ParseException ex) {
            System.err.println("Argument parser failed: " + ex.getLocalizedMessage());
            showHelp(options);
            return;
        }

        if (line.hasOption("h")) {
            showHelp(options);
            return;
        }
        String influxDB;
        if (!line.hasOption("db"))
            influxDB = "http://localhost:8086";
        else
            influxDB = line.getOptionValue("db");

        var props = new Properties();
        var configPath = Paths.get(line.getOptionValue("c")).toAbsolutePath().toString();
        try {
            var configStream = new FileInputStream(configPath);
            props.load(configStream);
        }
        catch (FileNotFoundException e) {
            System.err.println("File not found: " + configPath);
            return;
        }
        catch (IOException e) {
            System.err.println(e.toString());
            return;
        }
        var masterHostUrl = Main.trimProp(props.getProperty("url"));
        var username = Main.trimProp(props.getProperty("username"));
        var password = Main.trimProp(props.getProperty("password"));

        try {
            Loader loader = new Loader(masterHostUrl, username, password, influxDB, line.hasOption("d"));
            loader.start();
        }
        catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
