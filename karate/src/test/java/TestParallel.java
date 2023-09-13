package resources;

import com.intuit.karate.Results;
import com.intuit.karate.Runner;
import net.masterthought.cucumber.Configuration;
import net.masterthought.cucumber.ReportBuilder;
import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.Test;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TestParallel {

    @Test
    public void testParallel() {
        Results results = Runner.path("classpath:resources/steps")
                .outputCucumberJson(true)
                .parallel(5);
        generateReport(results.getReportDir());
        zipReportFolder();
        assertEquals(0, results.getFailCount(), results.getErrorMessages());
    }

    public static void generateReport(String karateOutputPath) {
        Collection<File> jsonFiles = FileUtils.listFiles(new File(karateOutputPath), new String[]{"json"}, true);
        List<String> jsonPaths = new ArrayList<>(jsonFiles.size());
        jsonFiles.forEach(file -> jsonPaths.add(file.getAbsolutePath()));
        Configuration config = new Configuration(new File("target"), "Karate Template Project");
        ReportBuilder reportBuilder = new ReportBuilder(jsonPaths, config);
        reportBuilder.generateReports();
    }


    public static void zipReportFolder() {
        Path sourceDir = Paths.get("target", "cucumber-html-reports");
        Path zipFile = Paths.get("target", "cucumber-reports.zip");

        try (FileOutputStream fos = new FileOutputStream(zipFile.toFile());
             ZipOutputStream zos = new ZipOutputStream(fos)) {

            Files.walk(sourceDir).forEach(path -> {
                try {
                    String entry = sourceDir.relativize(path).toString().replace("\\", "/");
                    if (Files.isDirectory(path)) {
                        zos.putNextEntry(new ZipEntry(entry + "/"));
                        zos.closeEntry();
                    } else {
                        zos.putNextEntry(new ZipEntry(entry));
                        Files.copy(path, zos);
                        zos.closeEntry();
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            });
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
